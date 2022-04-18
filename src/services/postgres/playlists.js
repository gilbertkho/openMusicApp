const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class PlaylistsService {
    constructor(){
        this._pool = new Pool();
    }

    async addPlaylist(name, owner){
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if(result.rowCount <= 0){
            throw new InvariantError('Gagal menambahkan playlist.');
        }

        return result.rows[0].id;
    }

    async getPlaylist(owner){
        const query = {
            text: `SELECT p.id, p.name, u.username 
            FROM playlists p, users u
            WHERE p.owner = $1 AND p.owner = u.id`,
            values: [owner],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deletePlaylist(id){
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(result.rowCount <= 0){
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan.');
        }
    }

    async addPlaylistSong(playlistId, songId){
        const id = `playlist_songs-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);
        if(result.rowCount <= 0){
            return new InvariantError('Gagal menambahkan lagu kedalam playlist.');
        }

        return result.rows[0].id;
    }

    async getPlaylistSong(playlistId){
        const queryPlaylist = {
            text: `SELECT p.id, p.name, u.username
            FROM playlists p, users u
            WHERE p.id = $1 AND p.owner = u.id`,
            values: [playlistId],
        };
        
        const resultPlaylist = await this._pool.query(queryPlaylist);

        if(resultPlaylist.rowCount <= 0){
            throw new NotFoundError('Playlist tidak ditemukan.');
        }

        const querySong = {
            text: `SELECT s.id, s.title, s.performer
            FROM songs s
            LEFT JOIN playlist_songs p ON p.song_id = s.id
            WHERE p.playlist_id = $1
            GROUP BY p.playlist_id`,
            values: [playlistId],
        };

        const resultSong = await this._pool.query(querySong);

        resultPlaylist.rows[0].songs = resultSong.rows;

        return resultPlaylist.rows[0];
    }

    async deletePlaylistSong(playlistId, songId){
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if(result.rowCount <= 0){
            return new NotFoundError('Gagal menghapus lagu. Lagu tidak ditemukan');
        }        
    }
}

module.exports = PlaylistsService;
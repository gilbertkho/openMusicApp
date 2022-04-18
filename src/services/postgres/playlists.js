const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

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

    async deletePlaylist(id, owner){
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
            values: [id, owner],
        };

        const result = await this._pool.query(query);

        if(result.rowCount <= 0){
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan.');
        }
    }

    async addPlaylistSong(playlistId, songId){
        await this.verifySong(songId);
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
            text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists, users
            WHERE playlists.id = $1 AND playlists.owner = users.id`,
            values: [playlistId],
        };
        
        const resultPlaylist = await this._pool.query(queryPlaylist);        

        if(resultPlaylist.rowCount <= 0){
            throw new NotFoundError('Playlist tidak ditemukan.');
        }

        const querySong = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
            LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };
        
        const resultSong = await this._pool.query(querySong);
       
        resultPlaylist.rows[0].songs = resultSong.rows;

        return resultPlaylist.rows[0];
    }

    async deletePlaylistSong(playlistId, songId){
        await this.verifySong(songId);        
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if(result.rowCount <= 0){
            return new NotFoundError('Gagal menghapus lagu. Lagu tidak ditemukan');
        }        
    }

    async verifyPlaylistOwner(id, owner){
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifySong(songId){
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songId],
        };

        const result = await this._pool.query(query);

        if(result.rowCount <= 0){
            throw new NotFoundError('Lagu tidak ditemukan');
        }        
    }
}

module.exports = PlaylistsService;
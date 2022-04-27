const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError =  require('../../exceptions/InvariantError');
const NotFoundError =  require('../../exceptions/NotFoundError');

class AlbumService {
    constructor(){
        this._pool = new Pool();
    }

    async addAlbum({name, year}){
        const id = 'album-'+nanoid(16);

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id){        
        const query = {
            text: `SELECT id, name, year, cover as "coverUrl" FROM albums WHERE id = $1`,
            values: [id],
        };

        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Album tidak ditemukan');
        }

        const querySong = {
            text: 'SELECT * FROM songs WHERE album_id = $1',
            values: [id],
        }
        const resultSong = await this._pool.query(querySong);
        result.rows[0].songs = resultSong.rows;

        return result.rows[0];
    }

    async editAlbumById(id, {name, year}){
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id],
        };

        const result =  await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id){
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
        }
    }

    async processAlbumLike(userId, albumId){
        const query = {
            text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if(result.rowCount <= 0){
            const id =  `album_likes-${nanoid(16)}`;
            const queryAdd = {
                text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
                values: [id, userId, albumId],
            };
    
            const resultAdd = await this._pool.query(queryAdd);
            
            if(!resultAdd.rows.length){
                throw new InvariantError('Likes gagal ditambahkan');
            }
            
            return true;
        }
        else{
            const queryDel = {
                text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
                values: [userId, albumId],
            };
    
            const resultDel = await this._pool.query(queryDel);
                
            if(!resultDel.rows.length){
                throw new InvariantError('Likes gagal dihapus');
            }

            return false;
        }
    }    

    async getAlbumLike(id){
        const query = {
            text: 'SELECT COUNT(*) as LIKES FROM user_album_likes WHERE album_id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        
        if(result.rowCount <= 0){
            throw new NotFoundError('Likes pada album tidak ditemukan');
        }

        return parseInt(result.rows[0].likes);
    }

    async updateAlbumCover(albumId, cover){
        const query = {
            text: 'UPDATE albums SET cover = $2 WHERE id = $1 RETURNING id',
            values: [albumId, cover],
        };

        const result = await this._pool.query(query);
        
        if(result.rowCount <= 0){
            throw new NotFoundError('Album tidak ditemukan');
        }
    }
}

module.exports = AlbumService;
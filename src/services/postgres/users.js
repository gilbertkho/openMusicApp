const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
    constructor(){
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}) {
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, password, fullname],
        }

        const result = await this._pool.query(query);
        if(!result.rows[0].id){
            throw new InvariantError('User gagal ditambahkan.');
        }

        return result.rows[0].id;
    }

    async verifyNewUsername(username){
        const query = {
            text: 'SELECT username FROM users where username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);
        if(result.rowCount > 0){
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }

    async verifyUserCredential(username, password){
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1 AND password = $2',
            values: [username, password],
        };
    
        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }
        
        return result.rows[0].id;
    }

    async verifyUser(id){
        const query = {
            text: 'SELECT id FROM users WHERE id = $1',
            values: [id],
        };
    
        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }
        
        return result.rows[0].id;
    }
}

module.exports = UsersService;
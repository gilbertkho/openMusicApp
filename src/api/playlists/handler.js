const AuthenticationError = require('../../exceptions/AuthenticationError');
const ClientError = require('../../exceptions/ClientError');
const UsersService = require('../../services/postgres/users');

class PlaylistsHandler {
    constructor(usersService, service, validator){
        this._usersService = usersService;
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
        this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
        this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);        
    }

    async postPlaylistHandler(request, h){
        try{
            this._validator.validatePlaylistPayload(request.payload);
            const {name} = request.payload;
            const {id: credentialId} = request.auth.credentials;
            await this._usersService.verifyUser(credentialId);
            const playlistId =  await this._service.addPlaylist(name, credentialId);

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId,
                },
            })
            response.code(201);
            return response;
        }
        catch(error){
            console.log(request.payload);
            console.log(error);
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async getPlaylistHandler(request, h){
        try{
            const {id: credentialId} = request.auth.credentials;            

            const playlists =  await this._service.getPlaylist(credentialId);
            
            return {
                status: 'success',
                data: {
                    playlists,
                },
            };
        }
        catch(error){
            console.log(error);
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async deletePlaylistHandler(request, h){
        try{
            const {id} = request.params;
            await this._service.deletePlaylist(id);
            
            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
            };
        }
        catch(error){
            console.log(error);
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async postPlaylistSongsHandler(request, h){
        try{

        }
        catch(error){
            console.log(error);
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async getPlaylistSongsHandler(request, h){
        try{

        }
        catch(error){
            console.log(error);
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async deletePlaylistSongsHandler(request, h){
        try{

        }
        catch(error){
            console.log(error);
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }
}

module.exports = PlaylistsHandler;
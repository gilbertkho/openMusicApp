const AuthenticationError = require('../../exceptions/AuthenticationError');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(service, validator){
        // this._usersService = usersService;
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
            // await this._usersService.verifyUser(credentialId);
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
            const {id: credentialId} = request.auth.credentials;
            await this._service.verifyPlaylistOwner(id, credentialId);
            await this._service.deletePlaylist(id, credentialId);
            
            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
            };
        }
        catch(error){
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
            this._validator.validatePlaylistSongPayload(request.payload);
            const {id} = request.params;
            const {songId} = request.payload;
            const {id: credentialId} = request.auth.credentials;

            await this._service.verifyPlaylistOwner(id, credentialId);
            await this._service.addPlaylistSong(id, songId);

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke dalam playlist.',
            });
            response.code(201);
            return response;
        }
        catch(error){
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
            const {id} = request.params;
            const {id: credentialId} = request.auth.credentials;

            console.log(id);
            await this._service.verifyPlaylistOwner(id, credentialId);
            const playlist = await this._service.getPlaylistSong(id);

            return {
                status: 'success',
                data: {
                    playlist
                }
            }
        }
        catch(error){
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
            this._validator.validatePlaylistSongPayload(request.payload);
            const {id} = request.params;            
            const {songId} = request.payload;
            const {id: credentialId} = request.auth.credentials;

            await this._service.verifyPlaylistOwner(id, credentialId);
            await this._service.deletePlaylistSong(id, songId);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
            };
        }
        catch(error){
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
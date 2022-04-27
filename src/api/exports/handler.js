const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
    constructor(service, playlistsService, validator){
        this._service = service;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
    }

    async postExportPlaylistHandler(request, h){
        try{
            this._validator.validateExportPlaylistPayload(request.payload);
            let {playlistId} = request.params;
            let {targetEmail} = request.payload;
            let {id: credentialId} = request.auth.credentials;
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            
            const message = {
                userId: credentialId,
                targetEmail: targetEmail,
            };

            await this._service.sendMessage('export:playlist', JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Permintaan Anda sedang kami proses',
            });
            response.code(201);
            return response;
        }
        catch(error){
            if (error instanceof ClientError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = ExportsHandler;
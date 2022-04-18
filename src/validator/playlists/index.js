const {
    PlaylistPayloadSchema,
    PlaylistSongPayloadSchema
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistSongPayloadSchema.validate(payload);
        if(!auth){
            throw new AuthenticationError('Autentikasi tidak ditemukan');
        }
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    },
}

module.exports = PlaylistsValidator;

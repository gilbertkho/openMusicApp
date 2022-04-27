const Joi = require('joi');

const ExportPlaylistPayloadSchema = Joi.object({
    targetEmail: Joi.string().required(),
});

module.exports = {ExportPlaylistPayloadSchema}
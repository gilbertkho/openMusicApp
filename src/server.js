require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
//ALBUM
const album = require('./api/album');
const AlbumService = require('./services/postgres/album');
const AlbumValidator = require('./validator/album');
//SONG
const song = require('./api/song');
const SongService = require('./services/postgres/song');
const SongValidator = require('./validator/song');
//USER
const users = require('./api/users');
const UsersService = require('./services/postgres/users');
const UsersValidator = require('./validator/users');
//AUTHENTICATION
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/authentications');
const AuthenticationsValidator =  require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');
//PLAYLIST
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/playlists');
const PlaylistsValidator = require('./validator/playlists');
//EXPORTS
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');
//UPLOADS
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const init = async() => {
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const albumService =  new AlbumService();
    const songService =  new SongService();
    const playlistsService = new PlaylistsService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes:{
            cors:{
                origin:['*'],
            },
        },
    });

    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert
        }
    ]);

    server.auth.strategy('openmusicapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: album,
            options: {
                service: albumService,
                validator: AlbumValidator
            }
        },
        {
            plugin: song,
            options: {
                service: songService,
                validator: SongValidator
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,                
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,                
            },
        },
        {
            plugin: _exports,
            options: {
              service: ProducerService,
              playlistsService: playlistsService,
              validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
              service: storageService,
              albumService: albumService,
              validator: UploadsValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();

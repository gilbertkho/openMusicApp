const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler
    },    
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistHandler
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistHandler
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongsHandler
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistSongsHandler
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistSongsHandler
    },
]

module.exports = routes;
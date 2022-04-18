/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('albums',{
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name:{
            type: 'TEXT',
            notNull: true,
        },
        year:{
            type: 'INTEGER',
            notNull: true,
        },
    });
    pgm.createTable('songs',{
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title:{
            type: 'TEXT',
            notNull: true,
        },
        year:{
            type: 'INTEGER',
            notNull: true,
        },
        performer:{
            type: 'TEXT',
            notNull: true,
        },
        genre:{
            type: 'TEXT',
            notNull: true,
        },
        duration:{
            type: 'INTEGER',
        },
        album_id:{
            type: 'TEXT',
            foreignKeys: {
                refrences: 'albums',
                columns: 'id'
            }
        }
    });
    pgm.createTable('users',{
        id: {
            type: 'TEXT',
            primaryKey: true,
        },
        username:{
            type: 'TEXT',
            notNull: true,
        },
        password:{
            type: 'TEXT',
            notNull: true,
        },
        fullname:{
            type: 'TEXT',
            notNull: true,
        },        
    });
    pgm.createTable('authentications',{
        token:{
            type: 'TEXT',
            notNull: true,
        },              
    });
    pgm.createTable('playlists',{
        id:{
            type: 'TEXT',
            primaryKey: true,
        },
        name:{
            type: 'TEXT',
            notNull: true,
        },
        owner:{
            type: 'TEXT',
            foreignKeys: {
                refrences: 'users',
                columns: 'id'
            }
        }
    });
    pgm.createTable('playlist_songs',{
        id:{
            type: 'TEXT',
            primaryKey: true,
        },
        playlist_id:{
            type: 'TEXT',
            foreignKeys: {
                refrences: 'playlists',
                columns: 'id'
            }
        },
        song_id:{
            type: 'TEXT',
            foreignKeys: {
                refrences: 'songs',
                columns: 'id'
            }
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('albums');
    pgm.dropTable('songs');
    pgm.dropTable('users');
    pgm.dropTable('authentications');
    pgm.dropTable('playlists');
    pgm.dropTable('playlist_songs');
};

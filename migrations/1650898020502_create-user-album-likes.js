/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('user_album_likes',{
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id:{
            type: 'TEXT',
            foreignKeys: {
                refrences: 'users',
                columns: 'id'
            }
        },
        album_id:{
            type: 'TEXT',
            foreignKeys: {
                refrences: 'albums',
                columns: 'id'
            }
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('user_album_likes');
};

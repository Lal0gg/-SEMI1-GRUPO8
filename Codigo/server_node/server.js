const fastify = require('fastify')({
  logger: true
})
var AWS = require('aws-sdk');
const {Pool} = require('pg');
const strftime = require('strftime')

require('dotenv').config();

AWS.config.loadFromPath('./config.json');

endpoint = process.env.ENDPOINT;
db_port = process.env.DB_PORT;
db_user = process.env.DB_USER;
db_pass = process.env.DB_PASS;
db_name = process.env.DB_NAME;
bucket_name = process.env.BUCKET_NAME;

const pool = new Pool({
    host: endpoint,
    database: db_name,
    user: db_user,
    password: db_pass,
    port: db_port,
    /*
    ssl: {
        rejectUnauthorized: false
    }
    */
});

const UserCreation = {
    schema: {
        body: {
            type: 'object',
            required: ['username','name','password','photo_base64'],
            properties:{
                username: { type: 'string' },
                name: { type: 'string' },
                password: { type: 'string' },
                photo_base64: { type: 'string' },
            },
        }
    }
};

const PhotoUpload = {
    schema: {
        body: {
            type: 'object',
            required: ['photo_name','photo_base64','album_id'],
            properties:{
                photo_name: { type: 'string' },
                photo_base64: { type: 'string' },
                album_id: { type: 'integer' },
            },
        }
    }
}

const AlbumCreation = {
    schema: {
        body: {
            type: 'object',
            required: ['album_name','user_id'],
            properties:{
                album_name: { type: 'string' },
                user_id: { type: 'integer' },
            },
        }
    }
}

const AlbumDeletion = {
    schema: {
        body: {
            type: 'object',
            required: ['album_id'],
            properties:{
                album_id: { type: 'integer' },
            },
        }
    }
}

const AlbumUpdate = {
    schema: {
        body: {
            type: 'object',
            required: ['album_name','album_id'],
            properties:{
                album_name: { type: 'string' },
                album_id: { type: 'integer' },
            },
        }
    }
}

const UserUpdate = {
    schema: {
        body: {
            type: 'object',
            required: ['password','user_id'],
            properties:{
                password: { type: 'string' },
                user_id: { type: 'integer' },
                new_username: { type: 'string' },
                new_name: { type: 'string'},
                new_photo_base64: { type : 'string' }

            },
        }
    }
}

const Login = {
    schema: {
        body: {
            type: 'object',
            required: ['password','username'],
            properties:{
                password: { type: 'string' },
                username: { type: 'string' },
            },
        }
    }

}

fastify.post('/signin',UserCreation, async(request,reply) => {

    const client = await pool.connect();
    const user = request.body
    try{  
        await client.query('BEGIN')

        var text = 'INSERT INTO userr VALUES (DEFAULT,$1, $2, $3)';
        var values = [user.username,user.name,user.password];
        await client.query(text,values);

        var result = await client.query('SELECT id_user FROM userr WHERE username = $1;',[user.username])
        id = result.rows[0].id_user;

        text = 'INSERT INTO album VALUES (DEFAULT, $1, $2,1::bit(1));';
        values = ['Fotos de Perfil',id];
        await client.query(text,values);

        var result = await client.query('SELECT id_album FROM album WHERE id_user = $1;',[id])
        album_id = result.rows[0].id_album;

        f = base64ToFile(user.photo_base64);
        mt = f.type
        const key_name = strftime('%Y_%m_%d_%H-%M-%S.%L');

        var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

        const uploadParams = {
            Bucket : bucket_name,
            Key: key_name,
            Body: await f.arrayBuffer().then((arrayBuffer) => Buffer.from(arrayBuffer, 'binary')),
            ContentType: f.type,
        }


        object_url = `https://s3-${s3.config.region}.amazonaws.com/${bucket_name}/${key_name}`


        text = 'INSERT INTO photo VALUES (DEFAULT,$1,$2,1::bit(1),$3)';
        values = [key_name,object_url,album_id];
        await client.query(text,values);

        var object_url;
        s3.upload(uploadParams, function(err,data){
            if (err) {
                console.log('Error', err);
            } if (data) {
                console.log('Upload Success', data.Location);
            }
        });
        await client.query('COMMIT')
        reply
            .code(201)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({message:'user created'})
            
    }catch (err){
        await client.query('ROLLBACK')
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err})
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }
});

fastify.get('/get_user/:username', async(request,reply) => {
    const client = await pool.connect();
    try{
        const rows = await client.query('SELECT id_user,username,name FROM userr WHERE username = $1',[request.params.username]);
       const user_info = rows.rows[0] 

        const text = 'SELECT link FROM photo JOIN album ON album.id_album = photo.id_album WHERE album.id_user = $1 AND album.isProfilePictureAlbum = 1::bit(1) AND photo.isProfilePicture = 1::bit(1);'
        profile_picture = await client.query(text,[user_info.id_user])
        reply
            .code(201)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({
                id: user_info.id_user,
                username: user_info.username,
                name: user_info.name,
                profile_picture_url: profile_picture.rows[0].link 
            });

    }catch (err){
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err})
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }

});

fastify.get('/get_album_list/:username', async(request,reply) => {
    const client = await pool.connect();
    try{
        text = 'SELECT album.id_album,album.name FROM album JOIN userr ON userr.id_user = album.id_user WHERE userr.username = $1'
        const rows = await client.query(text,[request.params.username])
        var albums = []
        rows.rows.forEach((element,i) => {
            albums[i] = {
                album_name: element.name,
                album_id: element.id_album
            }
        });
        reply
            .code(201)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({
                albums: albums
            });
    }catch (err){
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err})
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }

});

fastify.get('/get_album_photos/:id_album', async(request,reply) => {
    const client = await pool.connect();
    try{
        text = 'SELECT id_photo,name,link FROM photo WHERE id_album = $1;'
        const rows = await client.query(text,[request.params.id_album])
        var photos = []
        rows.rows.forEach((element,i) => {
            photos[i] = {
                photo_id : element.id_photo,
                photo_name : element.name,
                photo_url : element.link
            }
        });
        reply
            .code(201)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({
                album_id : Number(request.params.id_album),
                photos: photos
            });
    }catch (err){
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err})
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }

});

fastify.post('/upload_photo', PhotoUpload , async(request,reply) => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN')
        const photo = request.body
        f = base64ToFile(photo.photo_base64);
        mt = f.type
        const key_name = strftime('%Y_%m_%d_%H-%M-%S.%L');

        var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

        const uploadParams = {
            Bucket : bucket_name,
            Key: key_name,
            Body: await f.arrayBuffer().then((arrayBuffer) => Buffer.from(arrayBuffer, 'binary')),
            ContentType: f.type,
        }

        object_url = `https://s3-${s3.config.region}.amazonaws.com/${bucket_name}/${key_name}`


        text = 'INSERT INTO photo VALUES (DEFAULT,$1,$2,0::bit(1),$3)';
        values = [photo.photo_name,object_url,photo.album_id];
        await client.query(text,values);

        var object_url;
        s3.upload(uploadParams, function(err,data){
            if (err) {
                console.log('Error', err);
            } if (data) {
                console.log('Upload Success', data.Location);
            }
        });
        await client.query('COMMIT')
        reply
            .code(201)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({message:'photo created'})
    }catch (err){
        await client.query('ROLLBACK')
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err})
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }

});

fastify.post('/create_album', AlbumCreation , async(request,reply) => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN')
        const album = request.body
        client.query('INSERT INTO album VALUES (DEFAULT,$1,$2,0::bit(1))',[album.album_name,album.user_id])
        await client.query('COMMIT')
        reply
            .code(201)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({message:'album created'})
    }catch (err){
        await client.query('ROLLBACK')
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err})
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }

});

fastify.post('/delete_album', AlbumDeletion , async(request,reply) => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        const album = request.body;
        await client.query('DELETE FROM album WHERE id_album = $1',[album.album_id]);
        await client.query('COMMIT');
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({message:'album deleted'});
    }catch (err){
        await client.query('ROLLBACK');
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err});
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }
});

fastify.post('/edit_album', AlbumUpdate , async(request,reply) => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        const album = request.body;
        await client.query('UPDATE album SET name = $1 WHERE id_album = $2',[album.album_name,album.album_id]);
        await client.query('COMMIT');
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({message:'album updated'});
    }catch (err){
        await client.query('ROLLBACK');
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err});
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }
});

fastify.post('/update_profile', UserUpdate , async(request,reply) => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        const user = request.body;
        const log = await client.query('SELECT * FROM userr WHERE id_user = $1 AND password = $2',[user.user_id,user.password]);
        if (log.rowCount === 0){
            throw new Error("Incorrect password")
        }
        if (user.new_username && !(user.new_username === "" )){
            await client.query('UPDATE userr SET username = $1 WHERE id_user = $2',[user.new_username,user.user_id])
        }
        if (user.new_name && !(user.new_name === "")){
            await client.query('UPDATE userr SET name = $1 WHERE id_user = $2',[user.new_name,user.user_id])
        }
        if (user.new_photo_base64 && !(user.new_photo_base64 === "")){
            var text = 'SELECT id_album FROM album WHERE id_user = $1 AND isProfilePictureAlbum = 1::bit(1)';
            const rows = await client.query(text,[user.user_id])
            const id_album = rows.rows[0].id_album;
            text = 'UPDATE photo SET isProfilePicture=0::bit(1) WHERE isProfilePicture=1::bit(1) AND id_album = $1';
            await client.query(text,[id_album]);
            f = base64ToFile(user.new_photo_base64);
            mt = f.type
            const key_name = strftime('%Y_%m_%d_%H-%M-%S.%L');

            var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

            const uploadParams = {
                Bucket : bucket_name,
                Key: key_name,
                Body: await f.arrayBuffer().then((arrayBuffer) => Buffer.from(arrayBuffer, 'binary')),
                ContentType: f.type,
            }

            object_url = `https://s3-${s3.config.region}.amazonaws.com/${bucket_name}/${key_name}`


            text = 'INSERT INTO photo VALUES (DEFAULT,$1,$2,1::bit(1),$3)';
            values = [key_name,object_url,id_album];
            await client.query(text,values);

            var object_url;
            s3.upload(uploadParams, function(err,data){
                if (err) {
                    console.log('Error', err);
                } if (data) {
                    console.log('Upload Success', data.Location);
                }
            });
        }
        await client.query('COMMIT');
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({message:'user updated'});
    }catch (err){
        await client.query('ROLLBACK');
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err.message});
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }
});

fastify.post('/login', Login , async(request,reply) => {
    const client = await pool.connect();
    try{
        creds = request.body;
        const rows = await client.query('SELECT 0 FROM userr WHERE username = $1 AND password = $2',[creds.username,creds.password]);
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({correct:rows.rowCount != 0});
    }catch (err){
        await client.query('ROLLBACK');
        reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({detail: err.message});
        console.error('Database connection failed due to ' + err);

    }finally{
        client.release();
    }
});

fastify.listen({ port: 8000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
});

function base64ToFile(data){

    let mime = detectMimeType(data);

    let dataStr = atob(data);
    let n = dataStr.length;
    let dataArr = new Uint8Array(n);

    while (n--) {
        dataArr[n] = dataStr.charCodeAt(n);
    }

    let file = new File([dataArr], 'File.png', { type: mime });

    return file;
};

const Signatures = {
  JVBERi0: 'application/pdf',
  R0lGODdh: 'image/gif',
  R0lGODlh: 'image/gif',
  iVBORw0KGgo: 'image/png',
  '/9j/': 'image/jpg',
  Qk02U: 'image/bmp',
};

function detectMimeType(base64 = '') {
  let mimeType;

  Object.entries(Signatures).some(([signature, type]) => {
    const signatureWasFound = base64.startsWith(signature);
    if (signatureWasFound) mimeType = type;
    return signatureWasFound;
  });

  return mimeType;
}

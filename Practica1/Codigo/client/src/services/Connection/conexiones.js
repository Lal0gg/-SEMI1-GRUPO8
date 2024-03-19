import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://practica1-130466634.us-east-2.elb.amazonaws.com'
});


export const Login = async (username, password) => {
    const res = await instance.post('/login',{username: username, password: password});
    console.log("Soy el response de login", res.data);
    return res;
}


export const ObtenerDataUsuario = async (username) => {
    const res = await instance.get('/get_user/'+username);
    console.log("Soy el response de obtener data de usuario", res.data);
    return res;
}

export const ObtenerAlbumLista = async (username) => {
    const res = await instance.get('/get_album_list/'+username);
    console.log("Soy el response de obtener lista de album", res.data);
    return res;

}

export const ObtenerAlbumsFotos = async (id_album) =>{
    const res = await instance.get('/get_album_photos/'+id_album);
    console.log("Soy el response de obtener fotos ", res.data);
    return res;
} 

export const SubirFoto = async (photo_name,photo_base64,album_id) => {
    const res = await instance.post('/upload_photo',{photo_name: photo_name,  photo_base64:photo_base64,album_id:album_id});
    console.log("Soy el response de subir foto", res.data);
    return res;
}

export const CrearAlbum = async (album_name,user_id) => {
    const res = await instance.post('/create_album',{album_name: album_name, user_id:user_id});
    console.log("Soy el response de crear album", res.data);
    return res;
}

export const BorrarAlbum = async (album_id) => {
    const res = await instance.post('/delete_album',{album_id: album_id});
    console.log("Soy el response de borrar album", res.data);
    return res;
}

export const EditarAlbum = async (album_id,album_name) => {
    const res = await instance.post('/edit_album',{album_id: album_id, album_name: album_name});
    console.log("Soy el response de editar album", res.data);
    return res;
}

export const Actualizarusuario = async ( password,user_id,new_username, new_name,new_photo_base64) => {
    const res = await instance.post('/update_profile',{password:password,user_id:user_id,new_username: new_username, new_name: new_name, new_photo_base64:new_photo_base64});
    console.log("Soy el response de actualizar usuario", res.data);
    return res;
}

export const CrearUsuario = async (username, name, password, photo_base64) => {
    const res = await instance.post('/signin',{username: username, name: name, password: password, photo_base64:photo_base64});
    console.log("Se creo el usuario")
    console.log("Soy el response de crear usuario", res.data);
    return res;   
}
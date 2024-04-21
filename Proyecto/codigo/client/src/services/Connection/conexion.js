import axios from 'axios'


//API PARA LOGGEARSE
const instance = axios.create({
    baseURL: 'https://z2pv465v88.execute-api.us-east-1.amazonaws.com/test'
});


//API PARA HANDLER DE  CAPITULOS, SERIES

const instance2 = axios.create({
    baseURL: 'https://m1.tailde98b.ts.net/'
});


export const Login = async (username, password) => {
        const res = await instance.post('/login', {
            username: username,
            password: password 
        });
        console.log("soy el response de login ", res.data)
        return res;
}

export const AddUser = async (username,password,email) => {
    const res = await instance.post('/signup', {
        username: username,
        password: password,
        email: email
    });
    console.log("soy el response de login ", res.data)
    return res;
}


export const VerifiUser = async (username,confirmationCode) => {
    const res = await instance.post('/confirmUser', {
        username: username,
        confirmationCode:confirmationCode
    });
    console.log("soy el response de login ", res.data)
    return res;
}

export const GetTranscript = async (url) => {
    const res = await instance2.post('/getTranscript', {
        url: url
    });
}

export const CreateChapter = async (chapterNumber,serieId) => {
    const res = await instance2.post('/createChapter', {
        chapterNumber: chapterNumber,
        serieId: serieId
    });
    console.log("soy el response de login ", res.data)
    return res;
}


export const CreateSerie = async (coverB64,description,name,ownerToken) => {
    const res = await instance2.post('/createSerie', {
        coverB64: coverB64,
        description: description,
        name: name,
        ownerToken: ownerToken
    }
);
    console.log("soy el response de login ", res.data)
    return res;
}

export const FollowSerie  = async (accesToken,serieId) => {
    const res = await instance2.post('/followSerie', {
        accesToken: accesToken,
        serieId: serieId
    });
    console.log("soy el response de login ", res.data)
    return res;


}

export const GetSeriesPrivates = async (token) => {
    try {
        const res = await instance2.get('/getPrivateSerie', {
            params: {
                token: token
            },
            headers: {
                Accept: 'application/json, application/problem+json'
            }
        });
        console.log("soy el response de series xd ", res.data);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error; // Propaga el error para manejarlo donde se llame a esta función
    }
};

export const GetSeries = async () => {
    const res = await instance2.get('/getSeries');
    console.log("soy el response de series ", res.data)
    return res;
}

export const GetNumOfChapters = async (idSerie) => {
    const res = await instance2.get('/serie/'+idSerie)
    console.log("soy el response de series ", res.data)
    return res;

}

export const GetChapter = async (idSerie,chaptNum) => {
    const res = await instance2.get('/serie/'+idSerie+'/ch/'+chaptNum)
    console.log("soy el response de series ", res.data)
    return res;

}

export const TraductionYAudio = async (input,sourceLang,voiceLang) => {
    const res = await instance2.post('/translate', {
        input: input,
        sourceLang: sourceLang,
        voiceLang: voiceLang
    });
    console.log("soy el response de login ", res.data)
    return res;

}


export const UploadOrUpdateCoverSeries = async (imageB64,serieId) => {

    const res = await instance2.post('/uploadCover', {
        imageB64: imageB64,
        serieId: serieId
    });
    console.log("soy el response de login ", res.data)
    return res;
}


export const UploadPhotoOfCap = async (chapterNumber,imageB64,pageNumber,serieId) => {
    const res = await instance2.post('/uploadImg', {
        chapterNumber: chapterNumber,
        imageB64: imageB64,
        pageNumber: pageNumber,
        serieId: serieId
    });
    console.log("soy el response de login ", res.data)
    return res;

}
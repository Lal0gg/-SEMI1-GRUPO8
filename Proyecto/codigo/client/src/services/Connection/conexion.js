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

export const GetSeries = async () => {
    const res = await instance2.get('/getSeries');
    console.log("soy el response de series ", res.data)
    return res;
}


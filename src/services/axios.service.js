import axios from 'axios';

// Instances Axios distinctes pour chaque URL de base
const axiosHerocorp = axios.create({
    baseURL: "https://apidemo.iut-bm.univ-fcomte.fr/herocorp"
});

const axiosAuthapi = axios.create({
    baseURL: "https://apidemo.iut-bm.univ-fcomte.fr/authapi"
});

// Fonctions utilitaires pour les requêtes HTTP
async function postRequest(uri, data, config = {}, name, authapi = false) {
    let answer = null;
    const instance = authapi ? axiosAuthapi : axiosHerocorp; // Sélection de l'instance Axios

    try {
        answer = await instance.post(uri, data, config);
        return answer.data;
    } catch (error) {
        console.error(error, name);
        throw error; // Renvoyer l'erreur
    }
}

async function getRequest(uri, config = {}, name, authapi = false) {
    let answer = null;
    const instance = authapi ? axiosAuthapi : axiosHerocorp; // Sélection de l'instance Axios

    try {
        answer = await instance.get(uri, config);
        return answer.data;
    } catch (error) {
        console.error(error, name);
        throw error; // Renvoyer l'erreur
    }
}

async function putRequest(uri, data, config = {}, name, authapi = false) {
    let answer = null;
    const instance = authapi ? axiosAuthapi : axiosHerocorp; // Sélection de l'instance Axios

    try {
        answer = await instance.put(uri, data, config);
        return answer.data;
    } catch (error) {
        console.error(error, name);
        throw error; // Renvoyer l'erreur
    }
}

async function deleteRequest(uri, config = {}, name, authapi = false) {
    let answer = null;
    const instance = authapi ? axiosAuthapi : axiosHerocorp; // Sélection de l'instance Axios

    try {
        answer = await instance.delete(uri, config);
        return answer.data;
    } catch (error) {
        console.error(error, name);
        throw error; // Renvoyer l'erreur
    }
}

async function patchRequest(uri, data, config = {}, name, authapi = false) {
    let answer = null;
    const instance = authapi ? axiosAuthapi : axiosHerocorp; // Sélection de l'instance Axios

    try {
        answer = await instance.patch(uri, data, config);
        return answer.data;
    } catch (error) {
        console.error(error, name);
        throw error; // Renvoyer l'erreur
    }
}

export {
    postRequest,
    getRequest,
    putRequest,
    deleteRequest,
    patchRequest
};
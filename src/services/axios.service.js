import axios from 'axios';

const axiosHerocorp = axios.create({
    baseURL: "https://apidemo.iut-bm.univ-fcomte.fr/herocorp"
});

const axiosAuthapi = axios.create({
    baseURL: "https://apidemo.iut-bm.univ-fcomte.fr/authapi"
});


function getAxiosInstance(authapi) {
    return authapi ? axiosAuthapi : axiosHerocorp;
}


function handleError(error, name) {
    console.error(`Error in ${name}:`, error?.response?.data ?? error.message ?? error);
    throw error;
}


async function postRequest(uri, data, config = {}, name, authapi = false) {
    const instance = getAxiosInstance(authapi);
    try {
        const response = await instance.post(uri, data, config);
        return response.data;
    } catch (error) {
        handleError(error, name);
    }
}

async function getRequest(uri, config = {}, name, authapi = false) {
    const instance = getAxiosInstance(authapi);
    try {
        const response = await instance.get(uri, config);
        return response.data;
    } catch (error) {
        handleError(error, name);
    }
}

async function putRequest(uri, data, config = {}, name, authapi = false) {
    const instance = getAxiosInstance(authapi);
    try {
        const response = await instance.put(uri, data, config);
        return response.data;
    } catch (error) {
        handleError(error, name);
    }
}

async function deleteRequest(uri, config = {}, name, authapi = false) {
    const instance = getAxiosInstance(authapi);
    try {
        const response = await instance.delete(uri, config);
        return response.data;
    } catch (error) {
        handleError(error, name);
    }
}

async function patchRequest(uri, data, config = {}, name, authapi = false) {
    const instance = getAxiosInstance(authapi);
    try {
        const response = await instance.patch(uri, data, config);
        return response.data;
    } catch (error) {
        handleError(error, name);
    }
}

export {
    postRequest,
    getRequest,
    putRequest,
    deleteRequest,
    patchRequest
};

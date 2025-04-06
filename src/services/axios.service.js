import axios from 'axios';

const axiosAgent = axios.create({
    baseURL: "https://apidemo.iut-bm.univ-fcomte.fr/herocorp"
});

async function postRequest(uri, data, config = {}, name) {
    let answer = null
    try {
        answer = await axiosAgent.post(uri, data, config)
    } catch (error) {
        answer = console.error(error, name)
    }

    return answer.data;
}

async function getRequest(uri, config = {}, name) {
    let answer = null
    try {
        answer = await axiosAgent.get(uri, config)
    } catch (error) {
        answer = console.error(error, name)
    }

    return answer.data;
}

async function putRequest(uri, data, config = {}, name) {
    let answer = null
    try {
        answer = await axiosAgent.put(uri, data, config)
    } catch (error) {
        answer = console.error(error, name)
    }

    return answer.data;
}

async function deleteRequest(uri, config = {}, name) {
    let answer = null
    try {
        answer = await axiosAgent.delete(uri, config)
    } catch (error) {
        answer = console.error(error, name)
    }

    return answer.data;
}

async function patchRequest(uri, data, config = {}, name) {
    let answer = null
    try {
        answer = await axiosAgent.patch(uri, data, config)
    } catch (error) {
        answer = console.error(error, name)
    }

    return answer.data;
}


export { 
    postRequest,
    getRequest,
    putRequest,
    deleteRequest,
    patchRequest
 };


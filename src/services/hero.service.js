import {getRequest, postRequest, putRequest} from '@/services/axios.service'

//=================API CALLS=================

async function getAllHeroesFromApi(){
    return getRequest('/heroes/getaliases', 'getAllHeroes')
}

async function createHeroFromApi(data) {
    if (!data.publicName || !data.realName) {
        throw new Error("publicName and realName are required fields.");
    }

    if (data.powers) {
        if (!Array.isArray(data.powers)) {
            throw new Error("powers must be an array.");
        }

        for (const power of data.powers) {
            if (!power.name || !power.type || !power.level) {
                throw new Error("Each power must have name, type, and level.");
            }

            if (power.type < 1 || power.type > 7) {
                throw new Error("power.type must be between 1 and 7.");
            }

            if (power.level < 0 || power.level > 100) {
                throw new Error("power.level must be between 0 and 100.");
            }
        }
    }

    return postRequest('/heroes/create', data, 'createHero');
}

async function updateHeroFromApi(data, orgSecret) {
    if (!data._id) {
        throw new Error("_id is a required field.");
    }

    const headers = orgSecret ? { 'org-secret': orgSecret } : {};
    const queryString = orgSecret ? `?org-secret=${orgSecret}` : '';

    return putRequest(`/heroes/update${queryString}`, data, 'updateHero', headers);
}

async function getHeroByIdFromApi(id, orgSecret) {
    if (!id) {
        throw new Error("id is a required parameter.");
    }
    if (!orgSecret) {
        throw new Error("orgSecret is a required parameter.");
    }

    const uri = `/heroes/getbyid/${id}?org-secret=${orgSecret}`;

    return getRequest(uri, {}, 'getHeroById');
}


//=================CONTROLLER=================

async function getAllHeroes(){
    let answer = await getAllHeroesFromApi()
    return answer;
}

async function createHero(data){
    let answer = await createHeroFromApi(data)
    return answer;
}

async function updateHero(data){
    let answer = await updateHeroFromApi(data)
    return answer;
}

async function getHeroById(id, orgSecret){
    let answer = await getHeroByIdFromApi(id, orgSecret)
    return answer;
}


export {
    getAllHeroes,
    createHero,
    updateHero,
    getHeroById
}

import { getRequest, postRequest, patchRequest } from "./axios.service";


//=================API CALLS=================

async function getAllTeamsFromApi(){
    return getRequest('/teams/get', 'getAllTeams')
}

async function createTeamFromApi(data) {
    if (!data.name) {
        throw new Error("The 'name' field is required to create a team.");
    }

    return postRequest('/teams/create', data, 'createTeam');
}

async function addHeroesToTeamFromApi({ idHero, idTeam }) {
    if (!idHero) {
        throw new Error("The 'idHeroes' field must be a non-empty array.");
    }
    if (!idTeam) {
        throw new Error("The 'idTeam' field is required.");
    }

    const uri = "/teams/addheroes?id-team=" + idTeam;
    return patchRequest(uri, { idHeroes: [idHero] }, 'addHeroesToTeam'); // Envoyer idHero dans un tableau
}

async function removeHeroesFromTeamFromApi(data) {
    if (!data.idHeroes || !Array.isArray(data.idHeroes) || data.idHeroes.length === 0) {
        throw new Error("The 'idHeroes' field must be a non-empty array.");
    }
    if (!data.idTeam) {
        throw new Error("The 'idTeam' field is required.");
    }

    return patchRequest('/teams/removeheroes', data, 'removeHeroesFromTeam');
}



//=================Controller==================

async function getAllTeams(){
    let answer = await getAllTeamsFromApi()
    return answer;
}

async function createTeam(data){
    let answer = await createTeamFromApi(data)
    return answer;
}

async function addHeroesToTeam(data){
    let answer = await addHeroesToTeamFromApi(data)
    return answer;
}

async function removeHeroesFromTeam(data){
    let answer = await removeHeroesFromTeamFromApi(data)
    return answer;
}


export {
    getAllTeams,
    createTeam,
    addHeroesToTeam,
    removeHeroesFromTeam
}
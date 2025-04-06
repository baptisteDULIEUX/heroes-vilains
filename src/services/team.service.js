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
        console.log("idHero (request):", idHero);
        throw new Error("The 'idHeroes' field must be a non-empty array.");
    }
    if (!idTeam) {
        throw new Error("The 'idTeam' field is required.");
    }

    const uri = "/teams/addheroes";
    const data = { idHeroes: [idHero], idTeam: idTeam };

    return patchRequest(uri, data, 'addHeroesToTeam');
}

async function removeHeroesFromTeamFromApi(heroId, teamId) {
    if (!heroId) {
        console.log("heroId (request):", heroId);
        throw new Error("The 'idHeroes' field must be a non-empty array.");
    }
    if (!teamId) {
        console.log("teamId (request):", teamId);
        throw new Error("The 'idTeam' field is required.");
    }

    const uri = "/teams/removeheroes";
    const data = { idHeroes: [heroId], idTeam: teamId };

    return patchRequest(uri, data, 'removeHeroesFromTeam');
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

async function addHeroesToTeam({idHero, idTeam}){
    let answer = await addHeroesToTeamFromApi({ idHero, idTeam})
    return answer;
}

async function removeHeroesFromTeam(data) {
    try {
        const response = await removeHeroesFromTeamFromApi(data.heroId, data.teamId);
        return response.data;
    } catch (error) {
        console.error('Error removing hero from team:', error);
        throw error;
    }
}


export {
    getAllTeams,
    createTeam,
    addHeroesToTeam,
    removeHeroesFromTeam
}
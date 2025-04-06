import { getRequest, postRequest, patchRequest } from "./axios.service";

//=================API CALLS=================

async function getAllOrgsFromApi() {
    return getRequest('/orgs/get', 'getAllOrgs');
}

async function createOrgFromApi(data) {
    if (!data.name || typeof data.name !== 'string') {
        throw new Error("The 'name' field is required and must be a string.");
    }
    if (!data.secret || typeof data.secret !== 'string') {
        throw new Error("The 'secret' field is required and must be a string.");
    }

    return postRequest('/orgs/create', data, 'createOrg');
}

async function addTeamToOrgFromApi(idTeam, orgSecret) {
    if (!idTeam) {
        throw new Error("The 'idTeam' field is required.");
    }

    const uri = `/orgs/addteam?org-secret=${orgSecret}`;

    const data = { idTeam: idTeam };

    return patchRequest(uri, data, 'addTeamToOrg');
}

async function removeTeamFromOrgFromApi(idTeam, orgSecret) {
    if (!idTeam) {
        throw new Error("The 'idTeam' field is required.");
    }

    const uri = `/orgs/removeteam?org-secret=${orgSecret}`

    return patchRequest(uri, { idTeam: idTeam }, 'removeTeamFromOrg');
}

async function getOrgByIdFromApi(id, orgSecret) {
    if (!id || !orgSecret) {
      console.error('Missing parameters:', { id, orgSecret });
      throw new Error("The 'id' parameter is required.");
    } 
    const uri = `/orgs/getbyid/${id}?org-secret=${orgSecret}`;
    return getRequest(uri, {}, 'getOrgById');
  }



//=================Controller==================

async function getAllOrgs() {
    let answer = await getAllOrgsFromApi();
    return answer;
}

async function createOrg(data) {
    let answer = await createOrgFromApi(data);
    return answer;
}

async function addTeamToOrg(idTeam, orgSecret) {
    let answer = await addTeamToOrgFromApi(idTeam, orgSecret);
    return answer;
}

async function removeTeamFromOrg(idTeam, orgSecret) {
    let answer = await removeTeamFromOrgFromApi(idTeam, orgSecret);
    return answer;
}

async function getOrgById(id, orgSecret) {
    let answer = await getOrgByIdFromApi(id, orgSecret);
    console.log("request" + JSON.stringify(answer));
    return answer;
}

export {
    getAllOrgs,
    createOrg,
    addTeamToOrg,
    removeTeamFromOrg,
    getOrgById
};
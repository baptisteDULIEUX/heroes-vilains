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

async function addTeamToOrgFromApi(data, orgSecret) {
    if (!data.idTeam) {
        throw new Error("The 'idTeam' field is required.");
    }

    const headers = orgSecret ? { 'org-secret': orgSecret } : {};
    const queryString = orgSecret ? `?org-secret=${orgSecret}` : '';

    return patchRequest(`/orgs/addteam${queryString}`, data, 'addTeamToOrg', headers);
}

async function removeTeamFromOrgFromApi(data, orgSecret) {
    if (!data.idTeam) {
        throw new Error("The 'idTeam' field is required.");
    }

    const headers = orgSecret ? { 'org-secret': orgSecret } : {};
    const queryString = orgSecret ? `?org-secret=${orgSecret}` : '';

    return patchRequest(`/orgs/removeteam${queryString}`, data, 'removeTeamFromOrg', headers);
}

async function getOrgByIdFromApi(id, orgSecret) {
    if (!id || !orgSecret) {
      console.error('Missing parameters:', { id, orgSecret }); // Debug
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

async function addTeamToOrg(data) {
    let answer = await addTeamToOrgFromApi(data);
    return answer;
}

async function removeTeamFromOrg(data) {
    let answer = await removeTeamFromOrgFromApi(data);
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
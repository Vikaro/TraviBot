import Axios from "../../node_modules/axios/index";

const api = Axios.create({
    baseURL: 'http://localhost:8080/api'
})

export async function fetchBeers(filter) {
    const { data } = await api.get('/beers', {
        params: { food: filter }
    })
    return data
}

export async function login() {
    return api.get('/login')
}

export async function autoBuild() {
    return api.get('/buildings/auto')
}

export async function fetchAdventures() {
    return api.get('/adventures')
}
export async function runAllAdventures() {
    return api.get('/adventures/auto')
}
export async function fetchVillages() { return api.get('/villages') }

export async function autoBuildVillage(villageId) { return api.get(`/villages/${villageId}/new-buildings`)}
export async function smithyUpgrades(villageId) { return api.get(`/villages/${villageId}/smithy`)}
export async function smithyAutoUpgrade(villageId) { return api.get(`/villages/${villageId}/smithy/auto`)}
export async function smithyUpgrade(villageId, upgradeId) { return api.get(`/villages/${villageId}/smithy/${upgradeId}`)}
export async function sendUnits(villageId, data) { return api.post(`/villages/${villageId}/send-units`,data)}
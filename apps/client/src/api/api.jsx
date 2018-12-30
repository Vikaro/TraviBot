import Axios from "../../node_modules/axios/index";

const api = Axios.create({
    baseURL: 'localhost:8080/api'
})

export async function fetchBeers(filter) {
    const { data } = await api.get('/beers', {
        params: { food: filter }
    })
    return data
}

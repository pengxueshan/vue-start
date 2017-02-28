import ApiClient from '../utils/api-client'
const client = new ApiClient();
const mock = false;

export function fetchData(params) {
    if (mock) return Promise.resolve()
    return client.get(`/test`, {
        params
    })
}

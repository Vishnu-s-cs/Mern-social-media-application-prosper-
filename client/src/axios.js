import axios from 'axios'


export const makeRequest = axios.create({
    baseURL:"https://www.prosper-api.cf/api/",
    withCredentials:true
})
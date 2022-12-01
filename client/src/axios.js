import axios from 'axios'


export const makeRequest = axios.create({
    baseURL:"http://64.227.136.16:8800/api/",
    withCredentials:true
})
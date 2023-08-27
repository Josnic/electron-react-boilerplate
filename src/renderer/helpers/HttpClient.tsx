import axios from 'axios';
import AuthStore from '../redux/stores';
import { userApi, tokenApi } from '../constants';

const errorHandler = (error) => {
    if (error.response){
        return {
            type: "response",
            error: error.response
        }
    }else if (error.request){
        return {
            type: "request",
            error: error.request
        }
    }else{
        return {
            type: "unknown",
            error: error.message
        }
    }
}

export default () =>{

    const API = axios.create({
        //baseURL: "http://locahost",
        timeout: 4000,
        headers: {
            'accept': 'application/json', 
            'user': userApi,
            'token': tokenApi
        }
    })
    /*API.interceptors.request.use(function (request) {
        const authState = AuthStore.getState().auth;
        if (authState.isAuthenticated && authState.token !== ""){
            request.headers.common.Authorization = `Bearer ${authState.token}`;
        }
        return request;
    });*/

    return {
        post: async (path, payload) => {
            try{
                return await API.post(path, payload);
            }catch(e){
                return {
                    data: errorHandler(e),
                    error: true
                }
            }
            
        },
        get: async (path) => {
            try{
                return await API.get(path);
            }catch(e){
                return {
                    data: errorHandler(e),
                    error: true
                }
            }
        }
    }
}

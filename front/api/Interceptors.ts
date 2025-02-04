import axios from 'axios';
import { storeTokens, getTokens } from './Auth';

// http://192.168.1.161:8000 //https://resq18.fr:8000
const baseURL = 'https://resq18.fr:8000'

const customAxiosInstance = (value: string) => {
    const instance = axios.create({
        baseURL: baseURL,
        headers: { 'Content-Type': value, Accept: value }
    });

    // Add a request interceptor
    instance.interceptors.request.use(async function (config) {

            const { accessToken } = await getTokens() || { accessToken: null };

            if (accessToken) config.headers.Authorization = 'Bearer ' + accessToken;

            return config;

        }, function (error) {

            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    instance.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;

    }, async function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && originalRequest._retry === false) {
            originalRequest._retry = true;

            try {
                const response = await refreshAccessToken ();
                originalRequest.headers.Authorization = 'Bearer ' + response.accessToken;
                return instance(originalRequest);  // Relance la requête avec le nouveau token
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }); 

    return instance;
}


export const refreshAccessToken = async () => {
    const { refreshToken }  = await getTokens () || { refreshToken: null };

    try {
        const response = await axios.post(baseURL + '/api/v1/refreshToken', { 'refreshToken': refreshToken });

        if (response.data.accessToken) {
            const { accessToken, refreshToken } = response.data;
            await storeTokens(accessToken, refreshToken);
            return response.data;
        }
        else {
            console.log(response.data)
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default customAxiosInstance;
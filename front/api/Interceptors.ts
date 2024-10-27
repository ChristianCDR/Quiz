import axios from 'axios';
import { storeTokens, getTokens } from './Auth';

const instance = axios.create({
        baseURL: 'http://192.168.1.161:8000',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    }
);

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
            const newAccessToken = await refreshAccessToken ();
            originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
            return instance(originalRequest);  // Relance la requête avec le nouveau token
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    return Promise.reject(error);
  }
); 

export const refreshAccessToken = async () => {
    const { refreshToken }  = await getTokens () || { refreshToken: null };

    try {
        const response = await instance.post('/api/refreshToken', { token: refreshToken });

        if (response.data.token) {
            const { accessToken, refreshToken } = response.data;
            await storeTokens(accessToken, refreshToken);
            return accessToken;
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default instance;
import * as SecureStore from 'expo-secure-store';
import customAxiosInstance from '@/api/Interceptors';
import { getTokens } from '@/api/Auth';

const handleLogout = async () => {
    const {accessToken, refreshToken } = await getTokens() || { refreshToken: null };

    try {
        // revoke refreshToken
        const jsonAxiosInstance = customAxiosInstance('application/json');
        await jsonAxiosInstance.post('/api/v1/logout', { 'refreshToken': refreshToken });
        //suppression du secureStore
        await SecureStore.deleteItemAsync ('accessToken');
        await SecureStore.deleteItemAsync ('refreshToken');
    }
    catch (error) {
        console.log(error);
    }
}

export default handleLogout;
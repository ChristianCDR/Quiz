import * as SecureStore from 'expo-secure-store';
import instance from '@/api/Interceptors';
import { getTokens } from '@/api/Auth';

const handleLogout = async () => {
    const {accessToken, refreshToken } = await getTokens() || { refreshToken: null };

    try {
        // revoke refreshToken
        await instance.post('/api/logout', { 'refreshToken': refreshToken });
        //suppression du secureStore
        await SecureStore.deleteItemAsync ('accessToken');
        await SecureStore.deleteItemAsync ('refreshToken');
    }
    catch (error) {
        console.log(error);
    }
}

export default handleLogout;
import * as SecureStore from 'expo-secure-store';
import instance from './interceptors';

export const storeTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }
  catch (error) {
    console.log(error);
  }
}

export const getTokens = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    return {accessToken, refreshToken};
  }
  catch (error) {
    console.log(error);
  }
}

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
import * as SecureStore from 'expo-secure-store';

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
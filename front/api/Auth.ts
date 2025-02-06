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

export const storeUserInfos = async (userId: number, username: string, email: string, profilePhoto: string) => {
  try {
    await SecureStore.setItemAsync('userId', userId.toString());
    await SecureStore.setItemAsync('username', username);
    await SecureStore.setItemAsync('email', email);
    await SecureStore.setItemAsync('profilePhoto', profilePhoto);
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

export const getUserInfos = async () => {
  try {
    const userId = await SecureStore.getItemAsync('userId');
    const username = await SecureStore.getItemAsync('username');
    const email = await SecureStore.getItemAsync('email');
    const profilePhoto = await SecureStore.getItemAsync('profilePhoto');

    return {userId, username, email, profilePhoto };
  }
  catch (error) {
    console.log(error);
  }
}

export const removeTokens = async () => {
  try {
    await SecureStore.deleteItemAsync ('accessToken');
    await SecureStore.deleteItemAsync ('refreshToken');
  }
  catch (error) {
    console.log(error);
  }
}
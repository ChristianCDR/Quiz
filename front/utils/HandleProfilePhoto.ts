import * as ImagePicker from 'expo-image-picker';
import customAxiosInstance from '@/api/Interceptors';
import { Alert } from 'react-native';
import { ContextType } from '@/utils/Types';

export const pickImageFromGallery = async (context: ContextType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
    });

    if (!result.canceled && result.assets[0].fileName) {
        const filename = result.assets[0].fileName;
        const fileType = filename.split('.').pop();
        const uri = result.assets[0].uri;
        
        if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
            uploadProfilePhoto(uri, fileType, filename, context);
        } else {
          Alert.alert('Format non pris en charge', 'Veuillez sélectionner une image au format JPG ou PNG.');
        }
    }
}

const uploadProfilePhoto = async (imageUri: string, fileType: string, fileName: string, context: ContextType) => {

    const multipartAxiosInstance = customAxiosInstance('multipart/form-data');

    const formData = new FormData();
    
    const file = {
        uri: imageUri,
        type: `image/${fileType}`,
        name: fileName
    }    

    formData.append('profile_photo', file as any);
    
    try {
        const response = await multipartAxiosInstance.post('/api/v1/set_profile_photo', formData);   
        
        if (response.status === 200) {
            const { setProfilePhoto }  = context;
            setProfilePhoto(response.data.filename);
        }
    } catch (error: any) {
        if (error.response) console.log(error);
    }
}

export const deleteProfilePhoto = async (context: ContextType) => {
    const { setProfilePhoto, userId }  = context;

    const jsonAxiosInstance = customAxiosInstance('application/json');

    try {
        const response =  await jsonAxiosInstance.delete(`/api/v1/delete_profile_photo/${userId}`);

        if (response.status === 204) setProfilePhoto('default.png');
    }
    catch (error: any) {
        if (error.response) console.log(error);
    }
}
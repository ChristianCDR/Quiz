import { launchImageLibrary } from 'react-native-image-picker';
import customAxiosInstance from '@/api/Interceptors';

const pickImageFromGallery = () => {
    launchImageLibrary({mediaType: 'photo'}, (response) => {
        if(!response.didCancel && !response.errorMessage) {
            if (response?.assets) {
                const image = response.assets[0];
                image?.uri ? uploadProfilePhoto(image.uri) : ''; 
            }
        }
    })
}

const uploadProfilePhoto = async (imageUri: string) => {
    const multipartAxiosInstance = customAxiosInstance('multipart/form-data');
    const formData = new FormData();

    formData.append('profile_photo', JSON.stringify({
        uri: imageUri,
        type: 'image/jpeg, image/png',
        name: 'profile.jpg',
    }));

    try {
        const response = await multipartAxiosInstance.post('/api/user_profile_photo', formData);   
        if (response) {
            console.log(response.data);
        } 
    } catch (error) {
        console.log(error);
    }
}

export default pickImageFromGallery;
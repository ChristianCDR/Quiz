import { useState, useContext, useEffect } from 'react';
import { Context } from '@/utils/Context';
import * as SecureStore from 'expo-secure-store';
import customAxiosInstance from '@/api/Interceptors';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/utils/Types';
import { emailValidator, usernameValidator }  from '@/utils/Validators';
import { pickImageFromGallery, deleteProfilePhoto } from '@/utils/HandleProfilePhoto';
import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import handleLogout from '@/utils/HandleLogout';
import { Buffer } from 'buffer';

export default function Informations () {
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [emptyUsername, setEmptyUsername] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const [error, setError] = useState<string>();
    const [disabled, setDisabled] = useState<boolean>(true);   

    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');
      
    const { username, setUsername, email, setEmail, profilePhoto }  = context;

    const navigation = useNavigation<RootStackNavigationProp>();

    const baseUrl = 'http://192.168.197.43:8000/uploads/images/';

    const [imageUri, setImageUri] = useState<string>(baseUrl + 'default.png');

    const jsonAxiosInstance = customAxiosInstance('application/json');

    const handleChange = (field: string, value: string) => {
        if (field === 'email') setEmail(value);
        else if (field === 'username') setUsername(value);
        setDisabled(false);
    }

    const handleSave = async () => {
        setError('');

        switch ('') {
            case email: 
                setEmptyEmail(true);
                setError('Veuillez remplir ce champ.');
                break;
            case username: 
                setEmptyUsername(true);
                setError('Veuillez remplir ce champ.');
                break;   
            default:
                break; 
        }

        if (email && username && emailValidator(email) && usernameValidator(username.trim())) {
            const body = {
              "email": email,
              "username": username.trim()
            }
          
            try {   
                
                const response = await jsonAxiosInstance.put('/api/v1/reset/user_infos', body)     

                if (response.data) {
                    console.log(response)
                    setMessage(response.data.message);
                    setDisabled(true);

                    const token = await SecureStore.getItemAsync ('accessToken');
                    // on decode le jwt accessToken
                    const parts = token?.split('.').map((part) => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'),'base64').toString());

                    if (parts) {
                        const payload = JSON.parse(parts[1]);
                        payload?.email !== response.data.email ? setTimeout(() => {
                            handleLogout()
                            .then(() => {
                                navigation.navigate('Login', {message: 'Veuillez confirmer votre nouvelle adresse mail'+ '\n' +'et vous reconnecter'})
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name : 'Login' }]
                                });
                            })          
                            .catch(error => console.error("Erreur lors de la déconnexion :", error));
                        }, 3000) : ''
                    }
                }
            }
            catch(error: any) {
                if (error.response) {
                  setError(error.response.data.error);
                } else {
                console.log(error);
                  setError('Une erreur est survenue. Veuillez réessayer.');
                }
            }  
        } 
    }

    const handleAccountRemoval = () => {
        
        Alert.alert(
            'Confirmation',
            'Souhaitez-vous vraiment supprimer votre compte ?',
            [
                {
                    text: "Non",
                    style: "cancel",
                },
                {
                    text: "Oui",
                    onPress: async () => { 
                        handleLogout();
                        await jsonAxiosInstance.delete('/api/v1/user/delete')
                        .then(async() => {
                            navigation.navigate('Register');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Register' }]
                            });
                        })
                        .catch(error => console.error("Erreur lors de la suppression du compte :", error));
                    }
                    ,
                    style: "destructive",
                }
            ]
        );   
    }

    useEffect(() => {
        setImageUri(baseUrl + profilePhoto);
    }, [profilePhoto])

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}> Cheeeeeeese ! 😁🧀</Text>
            <View style = {styles.profilePhoto}>   
                <Image
                    source={{uri: imageUri}}
                    style={styles.circularImgView}
                />
                <View>      
                    <TouchableOpacity style = {styles.button} onPress={() => pickImageFromGallery(context)}> 
                        <Text style = {styles.buttonText}>Modifier</Text>
                    </TouchableOpacity>
                    { profilePhoto !== 'default.png' &&
                    
                        <TouchableOpacity style = {styles.button} onPress={() => deleteProfilePhoto(context)}> 
                            <Text style = {styles.buttonText}>Supprimer</Text>
                        </TouchableOpacity>                    
                    }            
                </View>
            </View>
            
            <View style = {styles.infos}>
                <Text style = {styles.title}> À propos de vous 🫵</Text>
                {error? 
                    <View>
                        <Text style={styles.errorText}>{error}</Text>
                    </View> : message &&
                    <View>
                        <Text style={[styles.errorText, {color: '#008000'}]}>{message}</Text>
                    </View>
                }
                <TextInput
                    style={[styles.input, emptyEmail && styles.errorBox]}
                    placeholder="Email"
                    value={email ?? ''}
                    onChangeText={(value) => handleChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, emptyUsername && styles.errorBox]}
                    placeholder="Nom d'utilisateur"
                    value={username ?? ''}
                    onChangeText={(value) => handleChange('username', value)}
                    keyboardType="default"
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity style = {[styles.button, disabled && {backgroundColor: '#8e8989'}]} onPress={handleSave} disabled={disabled}>
                <Text style = {styles.buttonText}> Enregistrer </Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.deleteButton} onPress={handleAccountRemoval}>
                <Text style = {[styles.buttonText,  {color: '#000'}]}> Supprimer mon compte </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        marginHorizontal: 'auto'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    profilePhoto: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    circularImgView: {
        width: 120,
        height: 120,
        borderRadius: 75,
        borderColor: '#1E3C58',
        borderWidth: 1.5
    },
    infos: {
        marginVertical: 20
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 15,
      marginVertical: 20,
      backgroundColor: '#fff',
    },
    errorText: {
        color: '#F15743',
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 16
    },
    errorBox: {
      borderColor: 'red'
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#1E3C58',
        height: 40,
        width: 150,
        marginBottom: 10
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 10
    },
    deleteButton: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1E3C58',
        height: 40,
        width: '90%',
        backgroundColor: '#e0e0e0',
        marginHorizontal: 'auto',
        marginVertical: 100
    }
})
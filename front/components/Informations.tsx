import { useState, useContext } from 'react';
import { Context } from '@/utils/Context';
import { Buffer } from 'buffer';
import * as SecureStore from 'expo-secure-store';
import customAxiosInstance from '@/api/Interceptors';
import { useNavigation } from '@react-navigation/native';
import { AccountScreenNavigationProp } from '@/utils/Types';
import { emailValidator, usernameValidator }  from '@/utils/Validators';
import pickImageFromGallery from '@/utils/HandleProfilePhoto';
import {View, StyleSheet, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import handleLogout from '@/utils/HandleLogout';

export default function Informations () {
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [emptyUsername, setEmptyUsername] = useState<boolean>(false);
    const [photoExists, setPhotoExists] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const [error, setError] = useState<string>();
    const [disabled, setDisabled] = useState<boolean>(true);

    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');
      
    const { username, setUsername, email, setEmail }  = context;

    const navigation = useNavigation<AccountScreenNavigationProp>();

    const handleChange = (field: string, value: string) => {
        if (field === 'email') setEmail(value);
        else if (field === 'username') setUsername(value);
        setDisabled(false);
    }

    const handlePress = async () => {
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

        if (emailValidator(email) && usernameValidator(username.trim())) {
            const body = {
              "email": email,
              "username": username.trim()
            }
          
            try {   
                const jsonAxiosInstance = customAxiosInstance('application/json');
                const response = await jsonAxiosInstance.put('/api/user/change/userInfos', body)       
                if (response.data) {
                    setMessage(response.data.message);
                    setDisabled(true);

                    const token = await SecureStore.getItemAsync ('accessToken');
                    const parts = token?.split('.').map((part) => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'),'base64').toString());

                    if (parts) {
                        const payload = JSON.parse(parts[1]);
                        payload?.email !== response.data.email ? setTimeout(() => {
                            handleLogout()
                            .then(() => navigation.navigate('Login', {message: 'Veuillez confirmer votre nouvelle adresse mail'+ '\n' +'et vous reconnecter'}))
                            .catch(error => console.error("Erreur lors de la déconnexion :", error));
                        }, 3000) : ''
                    }
                }
            }
            catch(error: any) {
                if (error.response) {
                  setError(error.response.data.error);
                } else {
                  setError('Une erreur est survenue. Veuillez réessayer.');
                }
            }  
        } 
    }

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}> Dites Cheeeeeeese ! 😁🧀</Text>
            <View style = {styles.profilePhoto}>   
                <Image
                    source={require('../assets/images/myAvatar.png')}
                    style={styles.circularImgView}
                />
                <View>
                    { photoExists ? 
                        <View style= {styles.doubleButtons}>
                            <TouchableOpacity style = {styles.button} onPress={() => {}}> 
                                <Text style = {styles.buttonText}>Modifier</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.button} onPress={() => {}}> 
                                <Text style = {styles.buttonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    
                    :
                        <TouchableOpacity style = {styles.button} onPress={() => {}}> 
                            <Text style = {styles.buttonText}>Ajouter</Text>
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
                    value={email}
                    onChangeText={(value) => handleChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, emptyUsername && styles.errorBox]}
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={(value) => handleChange('username', value)}
                    keyboardType="default"
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity style = {[styles.button, disabled && {backgroundColor: '#8e8989'}]} onPress={handlePress} disabled={disabled}>
                <Text style = {styles.buttonText}> Enregistrer </Text>
            </TouchableOpacity>

            <TouchableOpacity style = {styles.deleteButton}>
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
        borderColor: 'orange',
        borderWidth: 1
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
        width: 150
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 10
    },
    deleteButton: {
        borderRadius: 10,
        height: 40,
        width: '90%',
        backgroundColor: '#e0e0e0',
        marginHorizontal: 'auto',
        marginVertical: 100
    },
    doubleButtons: {
        height: 90,
        justifyContent: 'space-between'
    }
})
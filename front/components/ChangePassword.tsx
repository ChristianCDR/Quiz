import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {View, StyleSheet, Text, TextInput, Pressable} from 'react-native';
import { passwordValidator }  from '@/utils/Validators';

export default function ChangePassword () {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [emptyOldPassword, setEmptyOldPassword] = useState<boolean>(false);
    const [emptyNewPassword, setEmptyNewPassword] = useState<boolean>(false);
    const [emptyConfirmPassword, setEmptyConfirmPassword] = useState<boolean>(false);
    const [oldPasswordSecureText, setOldPasswordSecureText] = useState<boolean>(true);
    const [newPasswordSecureText, setNewPasswordSecureText] = useState<boolean>(true);
    const [confirmPasswordecureText, setConfirmPasswordSecureText] = useState<boolean>(true);
    const [error, setError] = useState<string>();

    const toggleSecureText = (value: number) => {
        switch (value) {
            case 1: 
                setOldPasswordSecureText(!oldPasswordSecureText);
                break;
            case 2: 
                setNewPasswordSecureText(!newPasswordSecureText);
                break;
            case 3: 
                setConfirmPasswordSecureText(!confirmPasswordecureText);
                break;
        }
    }

    const handlePress = () => {
        switch ('') {
            case oldPassword: 
                setEmptyOldPassword(true);
                break;
            case newPassword: 
                setEmptyNewPassword(true);
                break;
            case confirmPassword:
                setEmptyConfirmPassword(true);
                break;
            default:
                break;
        }

        // appel api pour verifier le mot de passe actuel
        if (newPassword === confirmPassword) {
            if (!passwordValidator(newPassword)) {
                setError("Le mot de passe doit contenir au minimum: " + '\n' 
                + "1 chiffre" + '\n' 
                + "8 caractères" + '\n' 
                + "1 lettre miniscule" + '\n' 
                + "1 lettre majuscule"  + '\n' 
                + "1 caractère spécial: @ $ ! % * ? & ")
            }
            else {
                //call api pour update le mdp
            }
        }
    }    

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>
                Vous souhaitez changer votre mot de passe ? {"\n"}
                Vous êtes au bon endroit 👍 ! 
            </Text>
            <View>
                <TextInput
                    style={[styles.input, emptyOldPassword && styles.errorBox]}
                    placeholder="Mot de passe actuel"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry={oldPasswordSecureText}
                />
                <Pressable  style={styles.eye} onPress={() => toggleSecureText(1)}>
                    <FontAwesome name={oldPasswordSecureText? "eye" : "eye-slash"} size={24} color="black" />
                </Pressable>
            </View>
            <View>
                <TextInput
                    style={[styles.input, emptyNewPassword && styles.errorBox]}
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={newPasswordSecureText}
                />
                <Pressable  style={styles.eye} onPress={() => toggleSecureText(2)}>
                    <FontAwesome name={newPasswordSecureText? "eye" : "eye-slash"} size={24} color="black" />
                </Pressable>
            </View>  
            <View>
                <TextInput
                    style={[styles.input, emptyConfirmPassword && styles.errorBox]}
                    placeholder="Confirmez votre mot de passe"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={confirmPasswordecureText}
                />
                <Pressable  style={styles.eye} onPress={() => toggleSecureText(3)}>
                    <FontAwesome name={confirmPasswordecureText? "eye" : "eye-slash"} size={24} color="black" />
                </Pressable>
            </View>
            {error? 
              <View>
                <Text style={styles.errorText}>{error}</Text>
              </View>: ''
            }
            <Pressable style = {styles.button} onPress = {handlePress}>
                <Text style = {styles.buttonText}> Enregistrer </Text>
            </Pressable>
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
        fontSize: 17,
        fontWeight: 'bold',
        width: '95%',
        marginVertical: 20,
        marginHorizontal: 'auto'
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        marginVertical: 20
    },
    errorBox: {
        borderColor: 'red'
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#1E3C58',
        height: 40,
        width: 150,
        marginTop: 20
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 10
    },
    eye: {
        position: 'absolute',
        right: 15,
        top: 30
    },
    errorText: {
        color: '#F15743',
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 16
    },
})
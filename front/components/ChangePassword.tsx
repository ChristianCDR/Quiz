import { useState } from 'react';
import {View, StyleSheet, Text, TextInput, Pressable} from 'react-native';

export default function ChangePassword () {
    const [password, setPassword] = useState<string>('');
    const [emptyPassword, setEmptyPassword] = useState<boolean>(false);
    const [secureText, setSecureText] = useState<boolean>(true);

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>
                Vous souhaitez changer votre mot de passe ? {"\n"}
                Vous êtes au bon endroit 👍 ! 
            </Text>
            <TextInput
                style={[styles.input, emptyPassword && styles.errorBox]}
                placeholder="Mot de passe actuel"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
            />
            <TextInput
                style={[styles.input, emptyPassword && styles.errorBox]}
                placeholder="Nouveau mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
            />
            <TextInput
                style={[styles.input, emptyPassword && styles.errorBox]}
                placeholder="Confirmez votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
            />
            <Pressable style = {styles.button}>
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
    }
})
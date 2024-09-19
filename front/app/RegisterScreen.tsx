import React, { useState } from 'react'
import { RegisterScreenNavigationProp } from '../constants/types'
import { useNavigation } from '@react-navigation/native'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'

export default function RegisterScreen () {

    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [error, setError] = useState<string>()
    const navigation = useNavigation<RegisterScreenNavigationProp>()
    
    const handleRegister = () => {
        // Exemple simple de validation
        if (email === '' || password === '') {
        setError('Veuillez entrer vos identifiants')
        } else {
        setError('')
        // Traitement de la connexion ici (Appel API par exemple)
        console.log('Email:', email)
        console.log('Password:', password)

        // Redirection vers une autre page après connexion réussie
        // navigation.navigate('Home')
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <Text style={styles.title}>Inscription</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
    
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.linkText}>Déjà inscrit ? Connectez-vous</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#ECE6D6',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
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
    button: {
      backgroundColor: '#2A2B31',
      paddingVertical: 15,
      borderRadius: 5,
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linkText: {
      color: '#2A2B31',
      textAlign: 'center',
      marginTop: 10,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
    },
  })

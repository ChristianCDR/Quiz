import React, { useState } from 'react'
import axios from 'axios'
import { RegisterScreenNavigationProp } from '../constants/types'
import { useNavigation } from '@react-navigation/native'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native'

export default function RegisterScreen () {

    const [email, setEmail] = useState<string>()
    const [userName, setUserName] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [error, setError] = useState<string>()
    const navigation = useNavigation<RegisterScreenNavigationProp>()
    
    const handleRegister = async () => {
      //gerer la validation des identifiants
      
      const apiUrl = 'http://192.168.1.161:8000/api/user/new'
      const body = {
        "email": email,
        "userName": userName,
        "password": password
      }
      try {
        const response = await axios.post(apiUrl, body, {
            headers: {
              'Content-Type': 'application/json', 
              Accept: 'application/json'
            }
        })
        if (response.status == 201) navigation.navigate('Home')
      }
      catch(error) {
        const errMessage = (error as Error).message
        console.log(errMessage)
      }      
    }

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <View>
              <Image style={styles.logo} source={require('../assets/images/resq18.png')}/>
            </View>
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
                placeholder="Nom d'utilsateur"
                value={userName}
                onChangeText={setUserName}
                keyboardType="default"
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
    
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
      backgroundColor: '#1E3C58',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#fff'
    },
    logo: {
      width: '100%',
      margin: 'auto',
      resizeMode: 'contain'
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
      color: '#fff',
      textAlign: 'center',
      marginTop: 10,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
    },
  })

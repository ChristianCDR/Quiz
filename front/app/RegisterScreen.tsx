import React, { useState } from 'react'
import axios from 'axios'
import { emailValidator, passwordValidator, userNameValidator }  from '@/components/utils'
import { RegisterScreenNavigationProp } from '../constants/types'
import { useNavigation } from '@react-navigation/native'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native'


export default function RegisterScreen () {

  const [email, setEmail] = useState<string>('')
  const [confirmEmail, setConfirmEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>()
  const navigation = useNavigation<RegisterScreenNavigationProp>()
  
  const handleRegister = async () => {

    if (emailValidator(email, confirmEmail) === 'mail_mismatch') {
      setError("Les e-mails ne correspondent pas.")
    }
    else if (!passwordValidator(password)) {
      setError("Le mot de passe doit contenir au minimum: " + '\n' + "1 chiffre" + '\n' + "8 caractères" + '\n' + "1 lettre miniscule" + '\n' + "1 lettre majuscule"  + '\n' + "1 caractère spécial: @ $ ! % * ? & " )
    } 

    else if (emailValidator(email, confirmEmail) && userNameValidator(userName.trim()) && passwordValidator(password)) {
      const apiUrl = 'http://192.168.5.43:8000/api/user/new'
      const body = {
        "email": email,
        "userName": userName.trim(),
        "password": password
      }
      try {   
        const response = await axios.post(apiUrl, body, {
            headers: {
              'Content-Type': 'application/json', 
              Accept: 'application/json'
            }
        })        
        if (response.status == 201) navigation.navigate('Home', {userName : response.data.userName})
      }
      catch(error) {
        const errMessage = (error as Error).message
        setError("L'inscription a échoué.. Veuillez réessayer..")
        console.log(errMessage)
      }  
    }    
  }

  return (
      <View style={styles.container}>
          <StatusBar
              backgroundColor="#1E3C58"
              barStyle="light-content"   
          />
          <View style={styles.logoView}>
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
              placeholder="Confirmez votre email"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
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
          {error? 
            <View>
              <Text style={styles.errorText}>{error}</Text>
            </View>: ''
          }
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
    logoView: {
      marginTop: -150
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
      color: '#F15743',
      marginVertical: 10,
      textAlign: 'center',
      fontSize: 16
    }
  })

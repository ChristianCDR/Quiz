import React, { useState, useContext } from 'react';
import { storeTokens } from '@/api/Auth';
import instance from '@/api/Interceptors';
import { Context } from '@/utils/Context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp, LoginScreenRouteProp } from '@/utils/Types';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';

// Page Mon compte
// permettre l'upload de photo de profil

// Notifications
// Aide  & contact => creer un mail gmail pour l'instant
// mentionner  l'origine des pics de l'appli
// info legales
// icone de l'appli

// Bruteforce
// Oauth2

type Props = {
  route: LoginScreenRouteProp
}

export default function LoginScreen ({route}: Props) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>();
    const [secureText, setSecureText] = useState<boolean>(true);
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [emptyPassword, setEmptyPassword] = useState<boolean>(false);

    const navigation = useNavigation<LoginScreenNavigationProp>();
    const {message} = route.params;
    
    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');
      
    const { setUserId }  = context;

    const handleLogin = async () => {
      if (email === '') setEmptyEmail(true);
      if (password === '') setEmptyPassword(true);

      const body = {
          "email": email,
          "password": password
      }

      try {
          const response = await instance.post('/api/login', body);
          if (response.status === 200) {
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const userId = response.data.userId;

            await storeTokens(accessToken, refreshToken);
            setUserId(userId);
            navigation.navigate('Home', {username: response.data.username});
          }
      }
      catch (error: any) {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          setError('La connexion a échoué.. Veuillez réessayer..');
        }
      }
    }

    const toggleSecureText = () => {
      setSecureText(!secureText);
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
          { error? 
            <View>
              <Text style={styles.errorText}>{error}</Text>
            </View>: ''
          }
          
          <View>
            <Text style={styles.linkText}>{message}</Text>
          </View>
  
          <Text style={styles.title}>Connexion</Text>
          <TextInput
              style={[styles.input, emptyEmail && styles.errorBox]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
          />
          <View>
            <TextInput
                style={[styles.input, emptyPassword && styles.errorBox]}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
            />
            <TouchableOpacity  style={styles.eye} onPress={toggleSecureText}>
              <FontAwesome name={secureText? "eye" : "eye-slash"} size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Pas encore inscrit ? Inscrivez-vous</Text>
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
    eye: {
      position: 'absolute',
      right: 15,
      top: 12
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
    },
    errorBox: {
      borderColor: 'red'
    }
})
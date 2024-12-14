import React, { useState, useContext } from 'react';
import { storeTokens } from '@/api/Auth';
import customAxiosInstance from '@/api/Interceptors';
import { Context } from '@/utils/Context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp, LoginScreenRouteProp } from '@/utils/Types';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// Crud photo de profile
// Lien de confirmation expiré ou invalide

// Boucles de loading 
// Audio jeu

// Notifications push
// Publicités

// mentionner  l'origine des pics de l'appli
// info legales
// icone de l'appli
// Aide  & contact => creer un mail gmail pour l'instant
// Captureref

// Bruteforce
// Oauth2

type Props = {
  route: LoginScreenRouteProp
}

export default function LoginScreen ({route}: Props) {
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState<string>();
    const [secureText, setSecureText] = useState<boolean>(true);
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [emptyPassword, setEmptyPassword] = useState<boolean>(false);

    const navigation = useNavigation<RootStackNavigationProp>();
    const {message} = route.params;
    
    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');
      
    const { setUserId, setUsername, email, setEmail}  = context;

    const jsonAxiosInstance = customAxiosInstance('application/json');

    const handleLogin = async () => {
      if (email === null) setEmptyEmail(true);
      if (password === null) setEmptyPassword(true);

      const body = {
          "email": email,
          "password": password
      }

      try {
          const response = await jsonAxiosInstance.post('/api/v1/login', body);
          if (response.status === 200) {
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const userId = response.data.userId;

            await storeTokens(accessToken, refreshToken);
            setUserId(userId);
            setUsername(response.data.username);
            setEmail(response.data.email);
            navigation.navigate('Tabs', { screen: 'Home'});
          }
      }
      catch (error: any) {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          setError('La connexion a échoué.. Veuillez réessayer..');
          console.log(error)
        }
      }
    }

    const toggleSecureText = () => {
      setSecureText(!secureText);
    }

    const handleForgotPassword = () => {
      navigation.navigate('ForgotPassword');
    }

    return (
      <View style={styles.container}>
          <View>
            <Image style={styles.logo} source={require('../assets/images/resq18.png')}/>
          </View>
          { error? 
            <View>
              <Text style={styles.errorText}>{error}</Text>
            </View>: ''
          }
          
          <View>
            <Text style={[styles.linkText, {color: 'yellow'}]}>{message}</Text>
          </View>
  
          <Text style={styles.title}>Connexion</Text>
          <TextInput
              style={[styles.input, emptyEmail && styles.errorBox]} 
              placeholder="Email"
              value={email ?? ''}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
          />
          <View>
            <TextInput
                style={[styles.input, emptyPassword && styles.errorBox]}
                placeholder="Mot de passe"
                value={password ?? ''}
                onChangeText={setPassword}
                secureTextEntry={secureText}
            />
            <TouchableOpacity  style={styles.eye} onPress={toggleSecureText}>
              <FontAwesome name={secureText? "eye" : "eye-slash"} size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.linkText, styles.forgotPassword]}>Mot de passe oublié ?</Text>
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
      paddingHorizontal: 20,
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
    },
    forgotPassword: {
      textAlign: 'right', 
      marginTop: -3,
      marginBottom: 20 
    }
})
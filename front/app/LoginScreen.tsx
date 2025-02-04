import React, { useState, useContext, useEffect } from 'react';
import { storeTokens } from '@/api/Auth';
import customAxiosInstance from '@/api/Interceptors';
import { Context } from '@/utils/Context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp, LoginScreenRouteProp } from '@/utils/Types';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getTokens } from '@/api/Auth';
import { Buffer } from 'buffer';
import { refreshAccessToken } from '@/api/Interceptors';

type Props = {
  route: LoginScreenRouteProp
}

type Token = {
  accessToken: string | null
}

export default function LoginScreen ({route}: Props) {
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState<string>();
    const [secureText, setSecureText] = useState<boolean>(true);
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [emptyPassword, setEmptyPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>();

    const navigation = useNavigation<RootStackNavigationProp>();
    const {message} = route.params;
    
    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');
      
    const { setUserId, setUsername, email, setEmail, setProfilePhoto }  = context;

    const jsonAxiosInstance = customAxiosInstance('application/json');

    const handleLogin = async () => {
      setError('');
      setLoading(true);

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

            await storeTokens(accessToken, refreshToken);
            setUserId(response.data.userId);
            setUsername(response.data.username);
            setEmail(response.data.email);
            setProfilePhoto(response.data.profilePhoto);

            navigation.replace('Tabs', { screen: 'Home'});
          }
      }
      catch (error: any) {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          setError('La connexion a échoué. Veuillez réessayer.');
          console.log(error)
        }
      }
      finally {
        setLoading(false);
      } 
    }

    const toggleSecureText = () => {
      setSecureText(!secureText);
    }

    const handleForgotPassword = () => {
      navigation.navigate('ForgotPassword');
    }

    useEffect(() => {
      const onAppLaunch = async () => {
        const tokens = await getTokens();

        if (!tokens) {
          throw new Error("Impossible de récupérer les tokens");
        }

        const { accessToken }: Token =  tokens;

        const parts = accessToken?.split('.').map((part) => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());

        if (parts) {
          const payload = JSON.parse(parts[1]);
          const timestampInSeconds = Math.floor(Date.now() / 1000);

          if (timestampInSeconds > payload.exp ) {

            try {
              const newAccessToken = await refreshAccessToken();
              // console.log(newAccessToken);
            }
            catch (error) {
              console.log(error);
            }
          }
          else {
            console.log('Token still valid.');
            navigation.navigate('Tabs', { screen: 'Home'});
          }
        }
      }

      onAppLaunch();
    })

    return (
      <View style={styles.container}>
          <View>
            <Image style={styles.logo} source={require('@/assets/images/resq18.png')}/>
          </View>
          { error? 
            <View>
              <Text style={styles.errorText}>{error}</Text>
            </View>: ''
          }
          
          { loading && <ActivityIndicator size="large" color="white" /> }
          
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

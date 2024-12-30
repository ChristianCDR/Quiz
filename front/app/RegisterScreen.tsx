import React, { useState } from 'react';
import { emailValidator, passwordValidator, usernameValidator }  from '@/utils/Validators';
import { RootStackNavigationProp } from '@/utils/Types';
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import customAxiosInstance from '@/api/Interceptors';

export default function RegisterScreen () {

    const [email, setEmail] = useState<string>('');
    const [confirmEmail, setConfirmEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [secureText, setSecureText] = useState<boolean>(true);
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [emptyUsername, setEmptyUsername] = useState<boolean>(false);
    const [emptyConfirm, setEmptyConfirm] = useState<boolean>(false);
    const [emptyPassword, setEmptyPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>();
    const navigation = useNavigation<RootStackNavigationProp>();
  
    const handleRegister = async () => {
      setError('');

      switch ('') {
        case email: 
            setEmptyEmail(true);
            break;
        case confirmEmail: 
            setEmptyConfirm(true);
            break;
        case username: 
            setEmptyUsername(true);
            break;
        case password: 
            setEmptyPassword(true);
            break;         
      }

      switch (false) {
        case email === confirmEmail: 
          setError("Les e-mails ne correspondent pas.");
          break;
        case emailValidator(email):
          setError('Veuillez saisir un e-mail valide.');
          break;
        case usernameValidator(username.trim()):
          setError('Veuillez saisir un nom d\'utilisateur valide.');
          break;
        case passwordValidator(password):
          setError("Le mot de passe doit contenir au minimum: " + '\n' 
            + "1 chiffre  " 
            + "8 caractères" + '\n' 
            + "1 lettre miniscule  "   
            + "1 lettre majuscule"  + '\n'  
            + "1 caractère spécial: @ $ ! % * ? & "
          );
          break;
      }
 
      if (emailValidator(email) && usernameValidator(username.trim()) && passwordValidator(password)) {
        setLoading(true);

        const body = {
          "email": email,
          "username": username.trim(),
          "password": password
        }
      
        try {
          const jsonAxiosInstance = customAxiosInstance('application/json');   
          const response = await jsonAxiosInstance.post('/api/v1/register', body)       
          if (response.status === 201) {
            navigation.navigate('Login', { message: 'Inscription réussie.' + '\n' + 'Confirmez votre adresse mail avant de vous connecter.' })
          }
        }
        catch(error: any) {
          if (error.response) {
            // console.log(error.response)
            setError(error.response.data.error);
          } else {
            setError('Une erreur est survenue. Veuillez réessayer.');
          }
        }  
        finally {
        setLoading(false);
        }
      }   
    }

    const toggleSecureText = () => {
      setSecureText(!secureText)
    }

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <View style={styles.logoView}>
              <Image style={styles.logo} source={require('@/assets/images/resq18.png')}/>
            </View>
            {error &&
              <View>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            }

            { loading && <ActivityIndicator size="large" color="white" /> }

            <Text style={styles.title}>Inscription</Text>
            <TextInput
                style={[styles.input, emptyEmail && styles.errorBox]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={[styles.input, emptyConfirm && styles.errorBox]}
                placeholder="Confirmez votre email"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={[styles.input, emptyUsername && styles.errorBox]}
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
                keyboardType="default"
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
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
    
            <TouchableOpacity onPress={() => navigation.navigate('Login', {message: null})}>
                <Text style={styles.linkText}>Déjà inscrit(e)? Connectez-vous</Text>
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

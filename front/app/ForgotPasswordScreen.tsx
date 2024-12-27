import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import BackButton from '@/components/BackButton';
import { Context } from '@/utils/Context';
import { RootStackNavigationProp } from '@/utils/Types';
import customAxiosInstance from '@/api/Interceptors';

export default function ForgotPassword () {
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [info, setInfo] = useState<string>();
    const [loading, setLoading] = useState<boolean>();

    const navigation = useNavigation<RootStackNavigationProp>();

    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');
      
    const { email, setEmail}  = context;

    const jsonAxiosInstance = customAxiosInstance('application/json');

    const handleForgotPassword = async () => {
        setError('');

        setLoading(true);

        if (email === null) setEmptyEmail(true);
        
        const body = {
            'email': email
        }
        
        try {
            const response = await jsonAxiosInstance.post('/api/v1/reset/send_password_email', body);
            if (response.status === 200) {
                setInfo('Un e-mail vous a été envoyé.');
                
                setTimeout(() => {
                    navigation.navigate('Login', { message: null });
                }, 3000);
            }
        }
        catch (error: any) {
            if (error.response) {
              setError(error.response.data.error);
            } else {
              setError("L'opération a échoué. Veuillez réessayer...");
              console.log(error);
            }
        }
        finally {
            setLoading(false);
        }
    }

    return(
        <View style={styles.container}>
            <BackButton navigation={navigation}/>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text  style={styles.message}>
                Merci de bien vouloir 
                <Text style={{ fontWeight: 'bold' }}> indiquer l'adresse e-mail </Text> 
                associée à votre compte. Un lien vous sera envoyé pour vous permettre de 
                <Text style={{ fontWeight: 'bold' }}> réinitialiser votre mot de passe. </Text> 
            </Text>
            { loading && <ActivityIndicator size="large" color="white" /> }
            <TextInput
                style={[styles.input, emptyEmail && styles.errorBox]} 
                placeholder="Email"
                value={email ?? ''}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
              <Text style={styles.buttonText}>Réinitialiser mon mot de passe</Text>
          </TouchableOpacity>
          <View>
            <Text>{info}</Text>
          </View>
          { error &&
            <View>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#ECE6D6",
    },
    input: {
        height: 50,
        width: '90%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginVertical: 20,
        backgroundColor: '#fff',
    },
    errorBox: {
        borderColor: 'red'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    message: {
        marginTop: 10,
        marginHorizontal: 'auto',
        width: '90%',
        fontSize: 16,
        
    },
    button: {
        backgroundColor: '#2A2B31',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16
    },
    errorText: {
        color: '#F15743',
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    }
})
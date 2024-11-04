import { useState } from 'react';
import {View, StyleSheet, Text, TextInput, Pressable, Image} from 'react-native';

export default function Informations () {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
    const [emptyUsername, setEmptyUsername] = useState<boolean>(false);
    const [photoExists, setPhotoExists] = useState<boolean>(false);

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}> Dites Cheeeeeeese ! 😁🧀</Text>
            <View style = {styles.profilePhoto}>   
                <Image
                    source={require('../assets/images/myAvatar.png')}
                    style={styles.circularImgView}
                />
                <View>
                    { photoExists ? 
                        <View style= {styles.doubleButtons}>
                            <Pressable style = {styles.button} onPress={() => {}}> 
                                <Text style = {styles.buttonText}>Modifier</Text>
                            </Pressable>
                            <Pressable style = {styles.button} onPress={() => {}}> 
                                <Text style = {styles.buttonText}>Supprimer</Text>
                            </Pressable>
                        </View>
                    
                    :
                        <Pressable style = {styles.button} onPress={() => {}}> 
                            <Text style = {styles.buttonText}>Ajouter</Text>
                        </Pressable>
                    }  
                </View>
            </View>
            
            <View style = {styles.infos}>
                <Text style = {styles.title}> À propos de vous 🫵</Text>
                <TextInput
                    style={[styles.input, emptyEmail && styles.errorBox]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
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
            </View>
            <Pressable style = {styles.button}>
                <Text style = {styles.buttonText}> Enregistrer </Text>
            </Pressable>

            <Pressable style = {styles.deleteButton}>
                <Text style = {[styles.buttonText,  {color: '#000'}]}> Supprimer mon compte </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        marginHorizontal: 'auto',
        justifyContent: 'space-around'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    profilePhoto: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    circularImgView: {
        width: 120,
        height: 120,
        borderRadius: 75,
        borderColor: 'orange',
        borderWidth: 1
    },
    infos: {
        marginVertical: 20
    },
    input: {
      height: 50,
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
    },
    deleteButton: {
        borderRadius: 10,
        height: 40,
        width: '90%',
        backgroundColor: '#e0e0e0',
        marginHorizontal: 'auto',
        marginVertical: 100
    },
    doubleButtons: {
        height: 90,
        justifyContent: 'space-between'
    }
})
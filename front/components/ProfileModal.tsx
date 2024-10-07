import React, { useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ModalContext } from '../utils/ModalContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import instance from '@/api/Interceptors';
import { getTokens } from '@/api/Auth';
import { ProfileScreenNavigationProp } from '@/utils/Types';

export default function ProfileModal () {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    
    const modalContext = useContext(ModalContext);

    if (!modalContext) throw new Error ('Modal Provider returned null');

    const { isModalVisible, hideModal } = modalContext;

    const handleAlert = () => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: "Annuler",
                    style: "cancel", // Style du bouton "Annuler"
                },
                {
                    text: "Déconnexion",
                    onPress: handleLogout,
                    style: "destructive",
                }
            ]
        )
    }

    const handleLogout = async () => {
        const {accessToken, refreshToken } = await getTokens() || { refreshToken: null }

        try {
            // revoke refreshToken
            await instance.post('/api/logout', { 'refreshToken': refreshToken })
            //suppression du secureStore
            await SecureStore.deleteItemAsync ('accessToken')
            await SecureStore.deleteItemAsync ('refreshToken')

            navigation.navigate('Login', {message: ''});     
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal 
          visible={isModalVisible} 
          transparent={true} 
          animationType="slide"
        >
            <TouchableWithoutFeedback onPress={hideModal}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <Pressable style = {styles.pressable}>
                                <FontAwesome6 name="circle-user" size={24} color="black" />
                                <Text style={styles.modalText}>Mon compte</Text>
                            </Pressable>
                            <Pressable style = {styles.pressable}>
                                <Ionicons name="notifications-outline" size={28} color="black" />
                                <Text style={styles.modalText}>Notifications</Text>
                            </Pressable>
                            <Pressable style = {styles.pressable}>
                                <Feather name="help-circle" size={24} color="black" />
                                <Text style={styles.modalText}>Aide & contact</Text>
                            </Pressable>
                            <Pressable style = {styles.pressable}>
                                <Feather name="list" size={24} color="black" />
                                <Text style={styles.modalText}>Informations légales</Text>
                            </Pressable>
                            <Pressable onPress={handleAlert} style = {styles.pressable}>
                                <Feather name="log-out" size={22} color="black" />
                                <Text style={styles.modalText}>Se déconnecter</Text>
                            </Pressable>
                            <Pressable onPress={hideModal} style = {[styles.pressable, styles.closeModalButton]}>
                                <AntDesign name="closecircleo" size={40} color="black" />
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>          
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modalView: { 
        width: '100%', 
        height: '44%',
        padding: 20, 
        paddingTop: 30,
        backgroundColor: 'white', 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-around'
    },
    modalText: {
        fontSize: 18,
        marginLeft: 15
    },
    pressable: {
        height: 50,
        flexDirection: 'row',
    },
    closeModalButton: {
        margin: 'auto'
    }
});

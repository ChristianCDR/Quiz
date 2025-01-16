import React, { useContext } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, Pressable, Alert, Linking } from 'react-native';
import { Context } from '@/utils/Context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import handleLogout from '@/utils/HandleLogout';

export default function SettingsModal () {

    const modalContext = useContext(Context);

    if (!modalContext) throw new Error ('Modal Provider returned null');

    const { isModalVisible, hideModal, setScreenToReach } = modalContext;

    const handleAlert = () => {
        Alert.alert(
            'Confirmation',
            'Souhaitez-vous vraiment vous déconnecter ?',
            [
                {
                    text: "Non",
                    style: "cancel", // Style du bouton "Annuler"
                },
                {
                    text: "Oui",
                    onPress: () => { 
                        handleLogout()
                        .then(() => {
                            goToLogin();
                        })
                        .catch(error => console.error("Erreur lors de la déconnexion :", error));
                    }
                    ,
                    style: "destructive",
                }
            ]
        )
    }

    const openEmailApps = () => {
        const email = 'contact@resq18.fr';
        const subject = 'Sujet du message';
        const mailToUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

        Linking.openURL(mailToUrl)
        .catch (
           () => Alert.alert('Erreur', "Impossible d'ouvrir l'application e-mail.")
        )
    }

    const openNotificationSettings = () => {
        Linking.openSettings()
        .catch (
            () => Alert.alert('Erreur', "Impossible d'ouvrir les paramètres.")
        )
    };

    const goToAccount = () => {
        setScreenToReach('Account');
        hideModal();
    }

    const goToLegal = () => {
        const url = "https://resq18.fr/mentions-legales";
        Linking.openURL(url)
        .catch((err) => console.error('An error occurred', err));
    }

    const goToLogin = () => {
        setScreenToReach('Login');
        hideModal();       
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
                            <Pressable style = {styles.pressable} onPress={goToAccount}>
                                <FontAwesome6 name="circle-user" size={24} color="white" />
                                <Text style={styles.modalText}>Mon compte</Text>
                            </Pressable>
                            <Pressable style = {styles.pressable} onPress = {openNotificationSettings}>
                                <Ionicons name="notifications-outline" size={25} color="white" />
                                <Text style={styles.modalText}>Notifications</Text>
                            </Pressable>
                            <Pressable style = {styles.pressable} onPress={openEmailApps}>
                                <Feather name="mail" size={24} color="white" />
                                <Text style={styles.modalText}>Nous contacter</Text>
                            </Pressable>
                            <Pressable style = {styles.pressable} onPress={goToLegal}>
                                <Feather name="list" size={24} color="white" />
                                <Text style={styles.modalText}>Informations légales</Text>
                            </Pressable>
                            <Pressable onPress={handleAlert} style = {styles.pressable}>
                                <Feather name="log-out" size={22} color="white" />
                                <Text style={styles.modalText}>Se déconnecter</Text>
                            </Pressable>
                            <Pressable onPress={hideModal} style = {[styles.pressable, styles.closeModalButton]}>
                                <AntDesign name="closecircleo" size={40} color="white" />
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
        backgroundColor: '#1E3C58', 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-around'
    },
    modalText: {
        fontSize: 18,
        marginLeft: 15,
        color: 'white'
    },
    pressable: {
        height: 50,
        flexDirection: 'row',
    },
    closeModalButton: {
        margin: 'auto'
    }
});

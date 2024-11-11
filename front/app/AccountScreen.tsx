import { useState, useContext, useEffect } from 'react';
import Footer from '@/components/Footer';
import { Context } from '@/utils/Context';
import Informations from '@/components/Informations';
import ChangePassword from '@/components/ChangePassword';
import { useNavigation } from '@react-navigation/native';
import { AccountScreenNavigationProp } from '@/utils/Types';
import {View, StyleSheet, Text, Pressable} from 'react-native';

export default function AccountScreen () {
    const [informationsPressed, setInformationsPressed] = useState<boolean>(true);
    const [passwordPressed, setPasswordPressed] = useState<boolean>(false);

    const navigation = useNavigation<AccountScreenNavigationProp>();

    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');

    const { hideModal } = context;

    useEffect (() => {
        hideModal();
    }, [])

    const handlePress = (screen : string) => {

        if (screen === 'password') {
            setPasswordPressed(true);
            setInformationsPressed(false);
        }
        else {
            setInformationsPressed(true);
            setPasswordPressed(false);
        }
    }

    return (
        <View style = {styles.container}>
            <View style = {styles.navBar}>
                <Pressable onPress={() => handlePress('informations')}> 
                    <Text style = {[styles.text, informationsPressed && styles.pressed]}> Informations </Text>    
                </Pressable>
                <Pressable onPress={() => handlePress('password')}> 
                    <Text style = {[styles.text, passwordPressed && styles.pressed]}> Mot de passe </Text> 
                </Pressable>
            </View>
            
            {passwordPressed ? <ChangePassword/> : <Informations/>}

            {/* <Footer/> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navBar: {
        borderColor: '#E2E2E2',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 70
    },
    text: {
        fontSize: 16,
        paddingBottom: 10
    },
    pressed: {
        fontSize: 18,
        fontWeight: 'bold',
        borderColor: '#000',
        borderBottomWidth: 2,
    },
    
})
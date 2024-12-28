import { useState, useContext } from 'react';
import { Context } from '@/utils/Context';
import Informations from '@/components/Informations';
import ChangePassword from '@/components/ChangePassword';
import BackButton from '@/components/BackButton';
import { RootStackNavigationProp } from '@/utils/Types';
import {View, StyleSheet, Text, Pressable} from 'react-native';

type Props = {
    navigation: RootStackNavigationProp
}

export default function AccountScreen ({navigation}: Props) {
    const [informationsPressed, setInformationsPressed] = useState<boolean>(true);
    const [passwordPressed, setPasswordPressed] = useState<boolean>(false);

    const context = useContext(Context);

    if (!context) throw new Error ('Context returned null');

    const { hideModal } = context;

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
            <BackButton navigation={navigation} />
            <View style = {styles.navBar}>
                <Pressable onPress={() => handlePress('informations')}> 
                    <Text style = {[styles.text, informationsPressed && styles.pressed]}> Informations </Text>    
                </Pressable>
                <Pressable onPress={() => handlePress('password')}> 
                    <Text style = {[styles.text, passwordPressed && styles.pressed]}> Mot de passe </Text> 
                </Pressable>
            </View>
            
            {passwordPressed ? <ChangePassword/> : <Informations/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ECE6D6",
    },
    navBar: {
        borderColor: '#E2E2E2',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 50
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
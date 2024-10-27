import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScoreScreenNavigationProp } from '@/utils/Types';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { Context } from '../utils/Context';
import ProfileModal from '@/components/ProfileModal';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';

export default function Footer () {

    const [activeButton, setAtiveButton] = useState<number>();
    const navigation = useNavigation<ScoreScreenNavigationProp>();

    const handlePress = (id: number) => {
        setAtiveButton(id);
        id === 3 ? alert('Coming soon !') :  '';
        id === 2 ? navigation.navigate('Score'): '';
    }

    const context = useContext(Context);

    if(!context) throw new Error ('Context returned null. Context must be used within a ModalProvider');

    const { showModal } = context;

    return (
        <View style={styles.footer}>
            <ProfileModal />
            <TouchableOpacity 
                onPress={()=>{handlePress(1)}} 
                style={[styles.button, activeButton === 1 && styles.pressedButton]}
            >
                <AntDesign name="home" size={24} color="black" />
                <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={()=>{handlePress(2)}} 
                style={[styles.button, activeButton === 2 && styles.pressedButton]}
            >
                <Ionicons name="stats-chart-outline" size={24} color="black" />
                <Text>Scores</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={()=>{handlePress(3)}} 
                style={[styles.button, activeButton === 3 && styles.pressedButton]}
            >
                <FontAwesome name="book" size={24} color="black" />
                <Text>Cours</Text>
            </TouchableOpacity>  
            <TouchableOpacity 
                onPress={showModal} 
                style={[styles.button, activeButton === 4 && styles.pressedButton]}
            >
                <Entypo name="dots-three-vertical" size={24} color="black" />
                <Text>Plus</Text>
            </TouchableOpacity>   
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        paddingTop: 5,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    button: {
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    pressedButton: {
        backgroundColor: '#ECE6D6',
        paddingHorizontal: 20,
        borderRadius: 30
    }
})
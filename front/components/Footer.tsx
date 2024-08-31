import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Footer () {
    const [activeButton, setAtiveButton] = useState<number>();

    const handlePress = (id: number) => {
        setAtiveButton(id)
        id === 3 ? alert('Coming soon !') :  ''
    }

    return (
        <View style={styles.footer}>
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
        backgroundColor: '#1E3C58',
        paddingHorizontal: 10,
        borderRadius: 30
    }
})
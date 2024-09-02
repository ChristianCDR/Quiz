import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function BackButton ({ navigation, color="#2A2B31" } : any) {
    return (
        <View style={styles.buttonView}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-circle" size={32} color={color} />
            </TouchableOpacity>
        </View>     
    );
}

const styles = StyleSheet.create({
    buttonView: {
        width: '90%',
        marginHorizontal: 'auto'
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
        backgroundColor: 'transparent'
    }
});
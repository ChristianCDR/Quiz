import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function BackButton ({ navigation } : any) {
    return (
        <View style={styles.b}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-circle" size={32} color="#2A2B31" />
            </TouchableOpacity>
        </View>     
    );
}

const styles = StyleSheet.create({
    b: {
        width: '95%'
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 10,
      backgroundColor: 'transparent',
    }
});
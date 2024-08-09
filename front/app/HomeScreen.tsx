import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Result: undefined;
  };
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    return (
        <View style={styles.container}>
            <Text>Welcome to the Home Screen</Text>
            <Button
                title="Go to Quiz Screen"
                onPress={() => navigation.navigate("Quiz")}
            />
            <View style={styles.pp}>
                <Button
                    title="Go to Result Screen"
                    onPress={() => navigation.navigate("Result")}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    pp: {
        marginTop: 20
    }
});

import { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Context } from "@/utils/Context";
import BackButton from "@/components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/utils/Types";


export default function LessonScreen () {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const context = useContext(Context);

    if(!context) throw new Error ('Context returned null');

    const { screenToReach, setScreenToReach } = context;

    useEffect(() => {
        switch (screenToReach) {
            case 'Account': navigation.navigate('Account');
                break;
            case 'Login':     
                navigation.navigate('Login', {message: null});
                setScreenToReach(null);
                navigation.reset({
                    index: 0, // On commence une nouvelle pile de navigation
                    routes: [{ name: 'Login' }], // Remplacez 'Login' par le nom de votre écran de connexion
                });
                break;
            case 'Legal': navigation.navigate('Legal');
                break;
        }
    },[screenToReach])

    return(
        <View style = {styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Cours</Text>
            <Text style = {styles.text}> Coming soon... </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 'auto'
    },
    title: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        width: '90%',
        textAlign: 'left',
        marginHorizontal: 'auto',
        marginBottom: 20
    }

})
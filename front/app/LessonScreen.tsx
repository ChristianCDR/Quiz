import { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Context } from "@/utils/Context";
import BackButton from "@/components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/utils/Types";
import settingsNavigation from '@/utils/HandleSettingsNavigation';


export default function LessonScreen () {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const context = useContext(Context);

    if(!context) throw new Error ('Context returned null');

    const { screenToReach } = context;

    useEffect(() => {
        if (screenToReach) settingsNavigation(screenToReach, navigation);
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
        flex: 1,
        backgroundColor: "#ECE6D6",
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
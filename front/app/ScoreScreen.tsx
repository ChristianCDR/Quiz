import { useContext, useEffect } from "react";
import { Context } from "@/utils/Context";
import BackButton from "@/components/BackButton";
import { RootStackNavigationProp } from "@/utils/Types";
import DisplayScores from '@/components/DisplayScores';
import { useNavigation } from "@react-navigation/native";
import settingsNavigation from '@/utils/HandleSettingsNavigation';
import { View, StyleSheet, Text, ScrollView } from "react-native";

export default function ScoreScreen () {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const context = useContext(Context);

    if(!context) throw new Error ('Context returned null');

    const { scores, screenToReach } = context;

    useEffect(() => {
        if (screenToReach) settingsNavigation(screenToReach, navigation);
    },[screenToReach])

    return (
        <View style = {styles.container}>
            <ScrollView>
                <BackButton navigation={navigation} />
                <Text style={styles.title}>Scores</Text>
                <DisplayScores scores = {scores}/>
            </ScrollView>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ECE6D6"
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
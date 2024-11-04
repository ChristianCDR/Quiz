import { useContext } from "react";
import Footer from '@/components/Footer';
import { Context } from "@/utils/Context";
import BackButton from "@/components/BackButton";
import { ScoreScreenRouteProp } from "@/utils/Types";
import DisplayScores from '@/components/DisplayScores';
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, ScrollView } from "react-native";

export default function ScoreScreen () {
    const navigation = useNavigation<ScoreScreenRouteProp>();
    
    const context = useContext(Context);

    if(!context) throw new Error ('Context returned null');

    const { scores } = context;

    return (
        <View style = {styles.container}>
            <ScrollView>
                <BackButton navigation={navigation} />
                <Text style={styles.title}>Scores</Text>
                <DisplayScores scores = {scores}/>
            </ScrollView>
            <Footer/>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#ECE6D6"
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
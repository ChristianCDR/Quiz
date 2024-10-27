import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import * as Progress from 'react-native-progress';

export default function ScoreScreen () {
    const screenWidth = Dimensions.get('window').width;

    const recentQuiz = [
        { id: 1, name: 'Quiz 1', scoreRate: 100 },
        { id: 2, name: 'Quiz 2', scoreRate: 30 },
        { id: 3, name: 'Quiz 3', scoreRate: 70 },
        { id: 4, name: 'Quiz 4', scoreRate: 50 },
        { id: 5, name: 'Quiz 5', scoreRate: 90 }
    ];

    return (
        <View style = {styles.container}>
            <Text style={[styles.title, styles.recentTitle]}>Scores</Text>

            <View style={styles.recentScrollContainer}>
                {recentQuiz.map(recentQuiz => (
                <TouchableOpacity key={recentQuiz.id} style={styles.recentQuiz}>
                    <Text style={styles.recentText}>{recentQuiz.name}</Text>
                    <Text style={{color: '#fff'}}>Taux de réussite: {recentQuiz.scoreRate}%</Text>
                    <Progress.Bar progress={recentQuiz.scoreRate/100}
                        width={screenWidth * 0.85}
                        color="#fff"
                    />
                </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#ECE6D6"
    },
    recentTitle: {
        marginHorizontal: 'auto',
        marginTop: 20,
        marginBottom: 20
    },
    title: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        width: '90%',
        textAlign: 'left'
    },
    recentText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    recentQuiz: {
        backgroundColor: '#1E3C58',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 70,
        marginBottom: 15
    },
    recentScrollContainer: {
        paddingHorizontal: 10,
        width: '100%',
        paddingBottom: 100
    }
})
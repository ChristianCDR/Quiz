import React from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { Score, QuizzesByCategoryNavigationProp } from "@/utils/Types";
import {View, StyleSheet, TouchableOpacity, Dimensions, Text} from 'react-native';
import { fetchQuizzesByCategoryId } from '@/utils/HandleQuizzes';

export default function DisplayScores ({scores}: {scores: Score[]}) {
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation<QuizzesByCategoryNavigationProp>();

    const handlePress = async (index: number, categoryName: string, categoryId: number) => {
        
        if (!categoryId) {
            throw new Error ('CategoryId est null');
        } 

        const quizzes =  await fetchQuizzesByCategoryId(categoryId);

        if (quizzes) navigation.navigate('Quiz', {quizData: quizzes[index-1], 'categoryName': categoryName });
    }

    return (
        <View style={styles.scoresContainer}>
            {scores.map(score => (
                <TouchableOpacity key={score.id} style={styles.scores} onPress={() => handlePress(score.quiz_id, score.category_name, score.category_id)}>
                    <Text style={styles.scoresText}>Quiz {score.quiz_id}</Text>
                    <Text style={{color: '#fff'}}>Taux de réussite: {score.score_rate}%</Text>
                    <Progress.Bar progress={score.score_rate/100}
                        width={screenWidth * 0.85}
                        color="#fff" 
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    scoresContainer: {
        paddingHorizontal: 10,
        width: '100%',
        paddingBottom: 100
    },
    scoresText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    scores: {
        backgroundColor: '#1E3C58',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 80,
        marginBottom: 10,
        justifyContent: 'space-between'
    }
});
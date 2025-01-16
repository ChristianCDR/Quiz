import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { QuizzesByCategoryScreenRouteProp, RootStackNavigationProp, Question } from "@/utils/Types";
import BackButton from "@/components/BackButton";
import { Context } from '@/utils/Context';
import { fetchQuizzesByCategoryId } from '@/utils/HandleQuizzes';

type Props = {
    route: QuizzesByCategoryScreenRouteProp
}

export default function QuizzesByCategoryScreen ({route} : Props) {
    const [quizzes, setQuizzes] = useState<Question[][]>();
    const [loading, setLoading] = useState<boolean>(true);

    const navigation = useNavigation<RootStackNavigationProp>();

    const context = useContext(Context);

    if (!context) throw new Error('QuizContext returned null');

    const { setQuizNumber, categoryName, categoryId } = context;
    
    useEffect(()=> {
        const setQuizzesArray = async () => {
            const quizzes = await fetchQuizzesByCategoryId(categoryId); 
            if (quizzes) setLoading (false);
            setQuizzes(quizzes);
        }
        setQuizzesArray();
    }, [categoryId])
    
    const handlePress = (index: number) => {
        
        setQuizNumber(index +1);     
        if (quizzes && categoryName) navigation.navigate('Quiz', {quizData: quizzes[index], 'categoryName': categoryName});
    }
    
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <BackButton navigation={navigation} />
            <ScrollView style={styles.scrollView}>
                {quizzes && quizzes.length > 0 ? (
                    quizzes.map((_, index) => (
                        <View key={index}>
                        <TouchableOpacity style={styles.quiz} onPress={() => handlePress(index)}>
                            <Text style={styles.quizText}>Quiz {index + 1}</Text>
                        </TouchableOpacity>
                        </View>
                    ))
                ) : (
                <Text style = {styles.noQuizText} >Pas de quiz disponible pour l'instant.</Text>
                )}

            { loading && <ActivityIndicator size="large" color="white" /> }
            </ScrollView>       
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ECE6D6"
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    scrollView: {
        width: '100%'
    },
    quiz: {
        width: '90%',
        marginHorizontal: 'auto',
        marginVertical: 10,
        backgroundColor: '#1E3C58',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 70,
        marginBottom: 15
    },
    quizText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    noQuizText: {
        color: 'black',
        fontSize: 18,
        textAlign: 'center'
    }
})
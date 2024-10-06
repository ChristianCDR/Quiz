import { useState, useEffect } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { Question, QuizzesByCategoryScreenRouteProp, QuizzesByCategoryNavigationProp, ErrorType } from "@/utils/Types";
import BackButton from "@/components/BackButton";
import instance from "@/api/Interceptors";

type Props = {
    route: QuizzesByCategoryScreenRouteProp
}

export default function QuizzesByCategoryScreen ({route} : Props) {

    const {categoryId, categoryName} = route.params
    const [data, setData] = useState<Question[]>([]);
    const [error, setError] = useState<ErrorType>();
    const [loading, setLoading] = useState<boolean>(true);
    const [quizzes, setQuizzes] = useState<Question[][]>([])

    const navigation = useNavigation<QuizzesByCategoryNavigationProp>()

    useEffect(() => {
        const fetchByCategoryId = async () => {
           try {
                const response = await instance.get(`/api/questions/category/${categoryId}`);
                setData(response.data)
           }
           catch (error: unknown) {
                const errMessage = (error as Error).message
                setError(errMessage)
           }
           finally {
            setLoading(false)
           }   
        }
        fetchByCategoryId()
    },[categoryId])

    // if (loading) {
    //     return (
    //       <View style={styles.container}>
    //         <ActivityIndicator size="large" color="#0000ff" />
    //       </View>
    //     );
    // }

    const chunkData = (data: Question [], questionsPerQuiz: number) => {
        
        const result: Question[][] = []
        const size = Math.ceil(data.length/questionsPerQuiz)
        for (let i = 0; i < size; i++) {
            const startIndex = i * questionsPerQuiz
            const endIndex = startIndex + questionsPerQuiz
            result.push(data.slice(startIndex, endIndex))
        }
        return result
    }

    useEffect(() => {
        if (data.length > 0) {
            const result = chunkData (data, 10)
            setQuizzes(result)
        }
    }, [data])
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <BackButton navigation={navigation} />
            <ScrollView style={styles.scrollView}>
                {quizzes.length > 0 ? (
                    quizzes.map((_, index) => (
                        <View key={index}>
                        <TouchableOpacity style={styles.quiz} onPress={()=> navigation.navigate('Quiz', {quizData: quizzes[index], 'categoryName': categoryName})}>
                            <Text style={styles.quizText}>Quiz {index + 1}</Text>
                        </TouchableOpacity>
                        </View>
                    ))
                ) : (
                <Text style = {{textAlign: 'center'}} >No quizzes available</Text>
                )}
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
    }
})
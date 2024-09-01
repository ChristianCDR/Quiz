import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { HomeScreenNavigationProp, ErrorType, Category } from "../constants/types";
import Footer from '@/components/Footer';

export default function HomeScreen() {
    const [data, setData] = useState<Category[]>([]);
    const [error, setError] = useState<ErrorType>();
    const [loading, setLoading] = useState<boolean>(true);

    let images: { [key: string]: any } = {
        'fire.png': require('../assets/images/fire.png'),
        'fender-bender.png': require('../assets/images/fender-bender.png'),
        'chainsaw.png': require('../assets/images/chainsaw.png'),
        'rescue.png': require('../assets/images/rescue.png')
    }

    const navigation = useNavigation<HomeScreenNavigationProp>();

    useEffect(() => {
        const fetchCategories = async () => {
           try {
                const apiUrl= 'http://192.168.1.161:8000/api/categories/'
                const response = await axios.get(apiUrl);
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
        fetchCategories();
    },[])

    if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }
    
    const recentQuiz = [
        { id: 1, name: 'Quiz 1' },
        { id: 2, name: 'Quiz 2' },
        { id: 3, name: 'Quiz 3' },
        { id: 4, name: 'Quiz 4' },
        { id: 5, name: 'Quiz 5' }
    ];

    const handleNavigation = (id: number, name: string) => {
        navigation.navigate('QuizzesByCategory', {categoryId: id, categoryName: name})
    }
 
    return (
        <View  style={styles.container}>
            <StatusBar
                    backgroundColor="#1E3C58"
                    barStyle="light-content"
            />
            <ScrollView style={styles.verticalScroll}>
                <View style={styles.user}>
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/images/myAvatar.png')}
                            style={styles.circularImgView}
                        />
                    </TouchableOpacity>
                    <Text style={styles.userName}>Christian CDR</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardImageView}>
                        <Image  style={styles.cardImage} source ={require('../assets/images/brain_v3.png')}/>
                    </View>
                    
                    <View style={styles.cardText}>
                        <Text style={styles.cardText1}> Joue & {"\n"} Gagne !</Text>
                        <Text style={styles.cardText2}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </Text>
                    </View>
                </View>

                <Text style={[styles.title, styles.categoryTitle]}>Catégories</Text>
                
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.categoryScrollContainer}
                >
                    {data.length > 0 ? (
                        data.map((category) => ( 
                            <TouchableOpacity key={category.id} style={styles.category} onPress={()=> handleNavigation(category.id, category.categoryName)}>
                                <Image style={styles.categoryImage} source ={images[category.categoryImage]}/>
                                <Text style={styles.categoryText}>{category.categoryName}</Text>
                            </TouchableOpacity>
                            ))
                        ) : <Text style={styles.errorText}>{error}</Text>
                    }
                </ScrollView>
                <Text style={[styles.title, styles.recentTitle]}>Récents</Text>

                <View style={styles.recentScrollContainer}>
                    {recentQuiz.map(recentQuiz => (
                    <TouchableOpacity key={recentQuiz.id} style={styles.recentQuiz}>
                        <Text style={styles.recentText}>{recentQuiz.name}</Text>
                    </TouchableOpacity>
                    ))}
                </View>

                <Footer/>
                
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
    verticalScroll: {
        width: '100%',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    user: {
        flexDirection: 'row',
        width: '100%',
        height: 200,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#1E3C58'
    },
    userName: {
        color: 'white',
        fontWeight: 'bold', 
        paddingTop: 45
    },
    circularImgView: {
        width: 50,
        height: 50,
        marginTop:30,
        marginLeft:10,
        marginRight: 10,
        borderRadius: 75
    },
    card: {
        width: '90%',
        height: 200,
        borderRadius: 15,
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        backgroundColor: '#1E2644',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    cardImageView: {
        width: '40%',
        aspectRatio: 1, // Maintient le ratio pour garder la View carrée
        overflow: 'hidden',   
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    cardText: {
        justifyContent: 'center',
        width: '55%'
    },
    cardText1: {
        color: 'white',
        fontSize: 26,
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    cardText2: {
        color: 'white'
    },
    categoryImage: {
        width: '80%',
        height: '80%',
        margin: 'auto',
        resizeMode: 'contain'
    },
    categoryScrollContainer: {
        paddingHorizontal: 10,
        height: 120,
        marginTop: 10,
    },
    recentScrollContainer: {
        paddingHorizontal: 10,
        width: '100%',
        paddingBottom: 100
    },
    category: {
        backgroundColor: '#1E3C58',
        height: '100%',
        borderRadius: 20,
        paddingVertical: 10,
        marginRight: 10,
        justifyContent: 'space-around',
    },
    recentQuiz: {
        backgroundColor: '#1E3C58',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 70,
        marginBottom: 15
    },
    categoryTitle: {
        marginHorizontal: 'auto',
        marginTop: 120,
        marginBottom: 10
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
    categoryText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 15
    },
    recentText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

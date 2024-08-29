import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Result: undefined;
    QuizzesByCategory: {categoryId: number};

};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type ErrorType = string | null;

interface Category {
    id: number,
    categoryName: string,
    categoryImage: string
}

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

    const handlePress = () => {
        alert('top!')
    }

    const handleNavigation = (id: number) => {
        navigation.navigate('QuizzesByCategory', {categoryId: id})
    }
 
    return (
        <View  style={styles.container}>
            <StatusBar
                    backgroundColor="#2A2B31"
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
                    <Image  style={styles.cardImage} source ={require('../assets/images/question.jpg')}/>
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
                            <TouchableOpacity key={category.id} style={styles.category} onPress={()=> handleNavigation(category.id)}>
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
                
            </ScrollView>
            <View style={styles.footer}>
                    <TouchableOpacity onPress={()=>{handlePress()}}>
                        <Svg width="34" height="34" viewBox="0 0 24 24">
                            <Path fill="#2A2B31" d="M5 20V9.5l7-5.288L19 9.5V20h-5.192v-6.384h-3.616V20z"/>
                        </Svg> 
                        <Text>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{handlePress()}}>
                        <Svg width="28" height="28" viewBox="0 0 32 32">
                            <Path fill="#2A2B31" d="M14 23h8v2h-8zm-4 0h2v2h-2zm4-5h8v2h-8zm-4 0h2v2h-2zm4-5h8v2h-8zm-4 0h2v2h-2z"/>
                            <Path fill="#2A2B31" d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z"/>
                        </Svg>
                        <Text>Scores</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{handlePress()}}>
                        <Svg width="32" height="32" viewBox="0 0 24 24">
                            <Path fill="#2A2B31" stroke="#2A2B31" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"/>
                        </Svg>
                        <Text>Cours</Text>
                    </TouchableOpacity>    
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
        backgroundColor: '#2A2B31'
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
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    cardImage: {
        width: '40%',
        height: '90%'
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
        width: 60,
        height: 60,
        margin: 'auto'
    },
    footer: {
        width: '100%',
        paddingTop: 5,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
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
        backgroundColor: '#fff',
        height: '100%',
        width: 140,
        borderRadius: 20,
        paddingVertical: 10,
        marginRight: 10,
        justifyContent: 'space-around',
    },
    recentQuiz: {
        backgroundColor: '#fff',
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
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    recentText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

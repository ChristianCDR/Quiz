import React, { useState, useEffect, useContext } from 'react';
import Footer from '@/components/Footer';
import instance from '@/api/Interceptors';
import { Context } from "@/utils/Context";
import DisplayScores from '@/components/DisplayScores';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp, HomeScreenRouteProp, ErrorType, Category } from "@/utils/Types";
import { StyleSheet, View, SafeAreaView, Text, StatusBar, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';


type Props = {
    route: HomeScreenRouteProp
}

export default function HomeScreen({route}: Props) {
    const [data, setCategory] = useState<Category[]>([]);
    const [error, setError] = useState<ErrorType>();
    const [loading, setLoading] = useState<boolean>(true);

    let images: { [key: string]: any } = {
        'inc': require('../assets/images/fire_v2.png'),
        'vsr': require('../assets/images/car_accident.png'),
        'opd': require('../assets/images/chainsaw.png'),
        'sap': require('../assets/images/sap.png')
    }

    const navigation = useNavigation<HomeScreenNavigationProp>();

    const context = useContext(Context);

    if(!context) throw new Error ('Context returned null');

    const { username, setCategoryId, setCategoryName, scores, setScores } = context;

    const scoresChunckedArray = scores.slice(0,5);

    useEffect(() => {
        const fetchCategories = async () => {
           try {
                const response = await instance.get('/api/categories/');
                setCategory(response.data);
           }
           catch (error) {
                const errMessage = (error as Error).message;
                setError(errMessage);
           }
           finally {
            setLoading(false);
           }   
        }

        fetchCategories();
    },[]);

    useEffect(()=>{
        const fetchScores = async () => {
            try {
                const response = await instance.get('/api/showScore/1');
                setScores(response.data.scores);
            }
            catch (error) {
                const errMessage = (error as Error).message;
                setError(errMessage);
            }
        }

        fetchScores();
    },[]);

    const handleNavigation = (id: number, name: string) => {
        setCategoryId(id);
        setCategoryName(name);
        navigation.navigate('QuizzesByCategory');
    }

    if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    }

    return (
        <SafeAreaView  style={styles.container}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <ScrollView style={styles.verticalScroll}>
                <View style={styles.user}>              
                    <Image
                        source={require('../assets/images/myAvatar.png')}
                        style={styles.circularImgView}
                    />
                    <Text style={styles.username}>{username}</Text>
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

                <DisplayScores scores = {scoresChunckedArray}/>
  
            </ScrollView>  
            
            <Footer/> 

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ECE6D6",
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
    username: {
        color: 'white',
        fontWeight: 'bold', 
        paddingTop: 45,
        textTransform: 'capitalize'
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
        width: '100%',
        height: '60%',
        marginHorizontal: 'auto',
        resizeMode: 'contain'
    },
    categoryScrollContainer: {
        paddingHorizontal: 10,
        height: 120,
        marginTop: 10,
    },
    category: {
        backgroundColor: '#1E3C58',
        height: '100%',
        borderRadius: 20,
        paddingVertical: 10,
        marginRight: 10,
        justifyContent: 'space-around',
    },
    categoryTitle: {
        marginHorizontal: 'auto',
        marginTop: 120,
        marginBottom: 10
    },
    title: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        width: '90%',
        textAlign: 'left'
    },
    recentTitle: {
        marginHorizontal: 'auto',
        marginTop: 20,
        marginBottom: 20
    },
    categoryText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 15
    }
});

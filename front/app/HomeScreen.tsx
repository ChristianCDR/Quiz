import React, { useState, useEffect, useContext } from 'react';
import customAxiosInstance from '@/api/Interceptors';
import { Context } from "@/utils/Context";
import DisplayScores from '@/components/DisplayScores';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp, HomeScreenRouteProp, ErrorType, Category } from "@/utils/Types";
import { StyleSheet, View, SafeAreaView, Text, StatusBar, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import settingsNavigation from '@/utils/HandleSettingsNavigation';

type Props = {
    route: HomeScreenRouteProp
}

export default function HomeScreen({route}: Props) {
    const [data, setCategory] = useState<Category[]>([]);
    const [error, setError] = useState<ErrorType>();
    const [loading, setLoading] = useState<boolean>(true);

    let images: { [key: string]: any } = {
        'Incendie': require('@/assets/images/fire_v2.png'),
        'Secours routier': require('@/assets/images/car_accident.png'),
        'Opérations diverses': require('@/assets/images/chainsaw.png'),
        'Secourisme': require('@/assets/images/sap.png')
    }

    const navigation = useNavigation<RootStackNavigationProp>();

    const context = useContext(Context);

    if(!context) throw new Error ('Context returned null');

    const { 
        username, 
        userId, 
        setCategoryName, 
        setCategoryId,  
        scores, 
        setScores, 
        updateScores,
        setUpdateScores,
        screenToReach,
        setScreenToReach,
        profilePhoto 
    } = context;

    const scoresChunckedArray = scores.slice(0,3);

    const jsonAxiosInstance = customAxiosInstance('application/json');

    const baseUrl = 'https://resq18.fr:8000/uploads/images/';

    const [imageUri, setImageUri] = useState<string>(baseUrl + 'default.png');

    useEffect(() => {
        const fetchCategories = async () => {
           try {
                const response = await jsonAxiosInstance.get('/api/v1/categories/');
                setCategory(response.data);
           }
           catch (error) {
                // const errMessage = (error as Error).message;
                setError('Le chargement a échoué :(');
           }
           finally {
            setLoading(false);
           }   
        }

        fetchCategories();     
    },[]);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await jsonAxiosInstance.get(`/api/v1/score/show/${userId}`);
                setScores(response.data.scores); 
            }
            catch (error) {
                // const errMessage = (error as Error).message;
                setError('Le chargement a échoué :(');
            }
            finally {
                setLoading(false);
            }
        }

        fetchScores();
        setUpdateScores(false);
    },[updateScores]);

    useEffect(() => {
        if (screenToReach) {
            settingsNavigation(screenToReach, navigation); 
            setScreenToReach(null)
        };
    },[screenToReach])

    useEffect(() => {
        setImageUri(baseUrl + profilePhoto);
    }, [profilePhoto])

    const handleNavigation = (id: number, name: string) => {
        setCategoryId(id);
        setCategoryName(name);
        navigation.navigate('QuizzesByCategory');
    }

    return (
        <SafeAreaView  style={styles.container}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <ScrollView style={styles.verticalScroll}>
                <View style={styles.user}>    
                    <TouchableOpacity onPress={() => navigation.navigate('Account')}>          
                        <Image
                            source={{uri: imageUri}}
                            style={styles.circularImgView}
                        />
                    </TouchableOpacity>
                    <Text style={styles.username}>{username}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardImageView}>
                        <Image  style={styles.cardImage} source ={require('@/assets/images/brain_v3.png')}/>
                    </View>
                    
                    <View style={styles.cardText}>
                        <Text style={styles.cardText1}> Joue & {"\n"} Révise !</Text>
                        <Text style={styles.cardText2}>
                        Chaque question est une nouvelle occasion de briller. N'attends plus, challenge-toi et montre tes compétences !
                        </Text>
                    </View>
                </View>

                <Text style={[styles.title, styles.categoryTitle]}>Catégories</Text>
                
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.categoryScrollContainer}
                >
                    { loading && <ActivityIndicator size="large" color="white" /> }
                    { data.length > 0 ? (
                        data.map((category) => ( 
                            <TouchableOpacity key={category.id} style={styles.category} onPress={()=> handleNavigation(category.id, category.categoryName)}>
                                <Image style={styles.categoryImage} source ={images[category.categoryName]}/>
                                <Text style={styles.categoryText}>{category.categoryName}</Text>
                            </TouchableOpacity>
                            ))
                        ) : <Text style={styles.errorText}>{error}</Text>
                    }
                </ScrollView>

                <Text style={[styles.title, styles.recentTitle]}>Récents</Text>
                { loading && <ActivityIndicator size="large" color="white" /> }
                <DisplayScores scores = {scoresChunckedArray} />
  
            </ScrollView>  

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
        paddingLeft: 10
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
        maxWidth: '30%',
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

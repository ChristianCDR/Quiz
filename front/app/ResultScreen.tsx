import { StyleSheet, View, Text, Image, TouchableOpacity, Share, Animated, Easing, StatusBar } from 'react-native';
import { RootStackNavigationProp, ResultScreenRouteProp } from "../utils/Types";
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import customAxiosInstance from '@/api/Interceptors';
import { Context } from '@/utils/Context';
import { captureRef } from 'react-native-view-shot';
import BackButton from '@/components/BackButton';
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
    route: ResultScreenRouteProp
};

export default function ResultScreen ({route}: Props) {
    const [comment, setComment] = useState<string>()
    const [scoreColor, setScoreColor] = useState<string>()
    const [fruitImage, setFruitImage] = useState()
    const navigation = useNavigation<RootStackNavigationProp>()
    const { score, quizLength } = route.params
    const formattedScore = (score) < 10 ? `0${score}` : score.toString()
    const viewRef = useRef(null)
    const scaleValue = useRef(new Animated.Value(0.1)).current 
    const context = useContext(Context);

    const fruitImages = {
        strawberry : require('@/assets/images/strawberry.png'),
        thumb: require('@/assets/images/thumb.png'),
        medal: require('@/assets/images/medal.png')
    }

    const startAnimation: any = () => {
        Animated.timing (scaleValue, {
            toValue: 1.5,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()
    }

    useEffect(() => {

        if (!context) throw new Error ('Context returned null')

        const { quizNumber, categoryId, setUpdateScores }  = context;

        const scoreRate = (score*100) / quizLength;   
        
        const body = {        
            "quiz_id": quizNumber,
            "score_rate": scoreRate,
            "category_id": categoryId
        }

        const storeScore = async () => {
            const jsonAxiosInstance = customAxiosInstance('application/json');
            
            try {
                const response = await jsonAxiosInstance.post('/api/v1/score/new', body);
                if (response.status === 201) setUpdateScores(true);
           } 
           catch (error: any) {
                if (error.response.status === 400 ) {
                    const response = await jsonAxiosInstance.put('/api/v1/score/edit', body);
                    if (response.status === 200) setUpdateScores(true);
                }
           }
        }

        storeScore();
    }, [])

    useEffect(() =>  {
        if (score < 5) {
            setComment('Fruitos !');
            setScoreColor('#ff0000');
            setFruitImage(fruitImages.strawberry);
            
        }  
        else if (score >= 5 && score < 9) {
            setComment('Pas mal...');
            setFruitImage(fruitImages.thumb);
        }  
        else {
            setComment('Sarce !'); 
            setScoreColor('#5ce65c');
            setFruitImage(fruitImages.medal);
        }
        startAnimation();
    }, [])

    const handleShare = async () => {
        try {
            if(viewRef.current) {
                const uri = await captureRef(viewRef, {
                    format: 'png',
                    quality: 1,
                });

                console.log('Image capturée : ', uri)

                await Share.share({
                    url: uri,
                    title: 'Mon résultat de Quiz',
                    message: `J'ai obtenu un score de ${score} sur RESQ18 !`,
                });
            }     
        } catch (error) {
            console.error('Erreur lors du partage', error);
            // alert("Une erreur s'est produite lors du partage de l'image.");
        }
    }

    return (
        <View style={styles.container} ref={viewRef} collapsable={false}>
            <StatusBar
                backgroundColor="#1E3C58"
                barStyle="light-content"   
            />
            <BackButton navigation={navigation} color= '#fff'/>
            <Text style={styles.pageName}>Résultats</Text>
            <Text style={styles.comment}>{comment}</Text>
            <Animated.Image 
                source = {fruitImage}
                style = {[styles.fruitImage, {transform: [{scale: scaleValue}]} ]}
            />
            {/* <Text style={styles.comment}>conseil</Text>  */}
            <View style={styles.details}>
                <Image
                    source={require('@/assets/images/myAvatar.png')}
                    style={styles.circularImgView}
                />
                <Text style={styles.username}> Christian CDR </Text>
                <Text style={styles.yourScore}>Votre score</Text>
                <Text style={styles.score}> <Text style={{color: scoreColor}}>{formattedScore}</Text> / {quizLength}</Text> 
                <View style={styles.detailsButtons}>
                    <TouchableOpacity onPress = {handleShare} style={[styles.button, styles.detailsFirstButton]}>
                        <Entypo name="share" size={24} color="black" /> 
                        <Text style={[styles.buttonText]}>Partager</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => navigation.goBack()} style={[styles.button, styles.detailsSecondButton]}>
                        <Text style={[styles.buttonText, styles.detailsSecondButtonsText]}>Nouveau Quiz</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#1E3C58',
    },
    pageName: {
        textAlign: 'center',
        fontSize: 22,
        color: 'white'
    },
    comment: {
        textAlign: 'center',
        fontSize: 52,
        color: 'white'
    },
    details: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: 'white',
        height: '50%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    circularImgView: {
        width: 100,
        height: 100,
        borderRadius: 75,
        borderColor: 'orange',
        borderWidth: 1
    },
    username: {
        fontSize: 22,
    },
    yourScore: {
        fontSize: 16,
        textTransform: 'uppercase'
    },
    score: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    detailsButtons: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        width: 110,
        height: 50,
        paddingHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    detailsFirstButton: {
        flexDirection: 'row',
        borderColor: '#000',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    detailsSecondButton: {
        backgroundColor: '#1E3C58',     
    },
    detailsSecondButtonsText: {
        color: 'white',   
    },
    fruitImage: {
        width: 140,
        height: 250, 
        resizeMode: 'contain',
        marginHorizontal: 'auto'
    }
})
import { StyleSheet, View, Text, Image, TouchableOpacity, Share } from 'react-native'
import { ResultScreenNavigationProp, ResultScreenRouteProp } from "../constants/types"
import { Platform, PermissionsAndroid } from 'react-native';
import { useEffect, useState, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { captureRef } from 'react-native-view-shot'
import BackButton from '@/components/BackButton'
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
    route: ResultScreenRouteProp
};

export default function ResultScreen ({route}: Props) {
    const [comment, setComment] = useState<string>()
    const [scoreColor, setScoreColor] = useState<string>()
    const navigation = useNavigation<ResultScreenNavigationProp>()
    const { score, quizLength} = route.params
    const formattedScore = (score) < 10 ? `0${score}` : score.toString()
    const viewRef = useRef<View>(null)

    useEffect(() =>  {
        if (score < 5) {
            setComment('Fruitos !')
            setScoreColor('#ff0000')
        }  
        else if (score >= 5 && score < 9) setComment('Pas mal..')  
        else {
            setComment('Sarce !') 
            setScoreColor('#5ce65c')
        }
    }, [])

    const handleShare = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
 
            PermissionsAndroid.request(
           
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
           
              {
           
                title: "Permission d'enregistrer une capture d'écran",
           
                message: "Vous devez autoriser l'application à enregister une capture d'écran",
           
                buttonNeutral: 'Plus tard',
           
                buttonNegative: 'Non',
           
                buttonPositive: 'OK',
           
              }
           
            ).then((result) => {
           
              if (result !== PermissionsAndroid.RESULTS.GRANTED) {
           
                console.log('Storage permission denied.');
           
              }
           
            });
           
        }

        try {
            if(viewRef.current) {
                const uri = await captureRef(viewRef, {
                    format: 'png',
                    quality: 0.8,
                });

            await Share.share({
                url: uri,
                title: 'Mon résultat de Quiz',
                message: `J'ai obtenu un score de ${score} !`,
            });
            }     
        } catch (error) {
            console.error('Erreur lors du partage', error);
        }
    }

    return (
        <View style={styles.container} ref={viewRef}>
            <BackButton navigation={navigation} color= '#fff'/>
            <Text style={styles.pageName}>Résultats</Text>
            <Text style={styles.comment}>{comment}</Text>
            {/* <Text style={styles.comment}>Image</Text>
            <Text style={styles.comment}>conseil</Text> */}
            <View style={styles.details}>
                <Image
                    source={require('../assets/images/myAvatar.png')}
                    style={styles.circularImgView}
                />
                <Text style={styles.userName}> Christian CDR </Text>
                <Text style={styles.yourScore}>Votre score</Text>
                <Text style={styles.score}> <Text style={{color: scoreColor}}>{formattedScore}</Text> / {quizLength}</Text> 
                <View style={styles.detailsButtons}>
                    <TouchableOpacity onPress = {() => handleShare()} style={[styles.button, styles.detailsFirstButton]}>
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
    userName: {
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
    }
})
import { StyleSheet, View, Text, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Result: {score: number};
};

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

type Props = {
    route: ResultScreenRouteProp;
};

export default function ResultScreen ({route}: Props) {
    const { score } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.pageName}>Result</Text>
            <Text style={styles.comment}>Sarce</Text>
            <View style={styles.details}>
                <Image
                    source={require('../assets/images/myAvatar.png')}
                    style={styles.circularImgView}
                />
                <Text>{score}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'orange',
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
        alignItems: 'center',
    },
    circularImgView: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderColor: 'orange',
        borderWidth: 1
    }
})
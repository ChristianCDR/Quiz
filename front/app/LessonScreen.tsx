import { View, Text, StyleSheet } from "react-native";
import BackButton from "@/components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { LessonScreenNavigationProp } from "@/utils/Types";
import Footer from '@/components/Footer';


export default function LessonScreen () {
    const navigation = useNavigation<LessonScreenNavigationProp>();

    return(
        <View style = {styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Cours</Text>
            <Text style = {styles.text}> Coming soon... </Text>
            <Footer/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 'auto'
    },
    title: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        width: '90%',
        textAlign: 'left',
        marginHorizontal: 'auto',
        marginBottom: 20
    }

})
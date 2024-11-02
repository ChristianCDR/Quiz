import { View, Text, StyleSheet } from "react-native";
import BackButton from "@/components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { LessonScreenNavigationProp } from "@/utils/Types";


export default function LessonScreen () {
    const navigation = useNavigation<LessonScreenNavigationProp>();

    return(
        <View style = {styles.container}>
            <BackButton navigation={navigation} />
            <Text style = {styles.text}> Coming soon... </Text>
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
    }

})
import { View, Text, StyleSheet } from "react-native";

export default function LessonScreen () {
    return(
        <View style = {styles.container}>
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
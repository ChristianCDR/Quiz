import { View, Text, StyleSheet } from "react-native";
import BackButton from '@/components/BackButton';
import { RootStackNavigationProp } from "@/utils/Types";

type Props = {
    navigation: RootStackNavigationProp
}

export default function LegalScreen ({navigation}: Props) {
    return(
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Infos légales</Text>
            <Text style={styles.text}>Infos légales</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#ECE6D6",
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
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import BackButton from '@/components/BackButton';
import { RootStackNavigationProp } from '@/utils/Types';


export default function Legal () {
    const navigation = useNavigation<RootStackNavigationProp>();
    return(
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <Text>Infos légales</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ECE6D6",
    },
})
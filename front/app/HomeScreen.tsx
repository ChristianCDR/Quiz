import React from 'react';
import { StyleSheet, View, Text, Button, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Result: undefined;
  };
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const categories = [
        { id: 1, name: 'Science' },
        { id: 2, name: 'Mathématiques' },
        { id: 3, name: 'Histoire' },
        { id: 4, name: 'Géographie' },
        { id: 5, name: 'Informatique' }
      ];

      const recentQuiz = [
        { id: 1, name: 'Quiz 1' },
        { id: 2, name: 'Quiz 2' },
        { id: 3, name: 'Quiz 3' },
        { id: 4, name: 'Quiz 4' },
        { id: 5, name: 'Quiz 5' }
      ];

    const handlePress = () => {
        alert('top!')
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor="#2A2B31"
                barStyle="light-content"
            />

            <View style={styles.user}>
                <Image
                    source={require('../assets/images/myAvatar.png')}
                    style={styles.circularImgView}
                />
                <Text style={styles.userName}>John Doe</Text>
            </View>

            <View style={styles.card}>
                <Image  style={styles.cardImage} source ={require('../assets/images/question.jpg')}/>
                <View style={styles.cardText}>
                    <Text style={styles.cardText1}> Joue & {"\n"} Gagne</Text>
                    <Text style={styles.cardText2}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Text>
                </View>
            </View>

            <Text style={[styles.title, styles.categoryTitle]}>Categories</Text>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoryScrollContainer}
            >
                {categories.map(category => (
                <TouchableOpacity key={category.id} style={styles.category}>
                    <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={[styles.title, styles.recentTitle]}>Récents</Text>

            <ScrollView style={styles.recentScrollContainer}>
                {recentQuiz.map(recentQuiz => (
                <TouchableOpacity key={recentQuiz.id} style={styles.recentQuiz}>
                    <Text style={styles.categoryText}>{recentQuiz.name}</Text>
                </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.homeButton} onPress={()=>{handlePress()}}>
                    <Svg width="34" height="34" viewBox="0 0 24 24">
                        <Path fill="#2A2B31" d="M5 20V9.5l7-5.288L19 9.5V20h-5.192v-6.384h-3.616V20z"/>
                    </Svg> 
                    <Text style={styles.homeButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{handlePress()}}>
                    <Svg width="28" height="28" viewBox="0 0 32 32">
                        <Path fill="#2A2B31" d="M14 23h8v2h-8zm-4 0h2v2h-2zm4-5h8v2h-8zm-4 0h2v2h-2zm4-5h8v2h-8zm-4 0h2v2h-2z"/>
                        <Path fill="#2A2B31" d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z"/>
                    </Svg>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{handlePress()}}>
                    <Svg width="32" height="32" viewBox="0 0 24 24">
                        <Path fill="#2A2B31" stroke="#2A2B31" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"/>
                    </Svg>
                </TouchableOpacity>    
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    user: {
        flexDirection: 'row',
        position: 'absolute',
        top:0,
        left:0,
        width: '100%',
        height: 200,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#2A2B31'
    },
    userName: {
        color: 'white',
        fontWeight: 'bold',
        paddingTop: 45
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
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    cardImage: {
        width: '40%',
        height: '70%'
    },
    cardText: {
        justifyContent: 'center',
        width: '55%'
    },
    cardText1: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
    },
    cardText2: {
        color: 'white'
    },
    footer: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeButtonText: {
        paddingTop: 4
    },
    categoryScrollContainer: {
      paddingHorizontal: 10,
      height: 100,
      marginTop: 10,
    },
    recentScrollContainer: {
        flex:1,
        paddingHorizontal: 10,
        width: '100%',
        paddingBottom: 100
    },
    category: {
      backgroundColor: '#000',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginRight: 10, 
    },
    recentQuiz: {
        backgroundColor: '#000',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 70,
        marginBottom: 15
    },
    categoryTitle: {
        marginTop: 300,
        marginBottom: 10
    },
    recentTitle: {
        marginTop: -200,
        marginBottom: 10
    },
    title: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
      width: '90%',
      textAlign: 'left'
    },
    categoryText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    }
});

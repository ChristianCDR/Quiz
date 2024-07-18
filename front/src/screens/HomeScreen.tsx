import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

const HomeScreen: React.FC = () => {
    const handlePress = () => {
        console.log('Button pressed!');
    };
    return (
        <View style={styles.container}>
            <View>

            </View>
            <View style={styles.card}>
                <View style={styles.left}>
                    <Text style={styles.title}>Un petit quiz?</Text>
                    <Pressable style={styles.button} onPress={handlePress}>
                        <Text style={styles.buttonText} >Jouer</Text>
                    </Pressable>
                </View>
                <Image source={{ uri: "https://img.freepik.com/vecteurs-libre/trophee-style-plat_78370-3222.jpg" }} style={styles.image} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    margin: 20,
    marginTop: 30,
    height: 170,
    borderRadius: 10,
    backgroundColor: '#B05BF7',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,
    elevation: 19,
  },
  left: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "red",
    width: '50%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Quicksand-Light' 
  },
  image: {
    ///
  },
  button: {
    width: '70%',
    height: 40,
    backgroundColor: '#fff',  
    borderRadius: 30
  },
  buttonText: {
    color: '#B05BF7',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'

  }

});

export default HomeScreen;

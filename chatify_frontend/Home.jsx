import React, {useEffect} from 'react';
import {View, Text, StyleSheet , Image, ImageBackground, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = () => {
  const navigation = useNavigation();

  useEffect(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        // console.log('Token retrieved successfully:', token);
        const timeout = setTimeout(() => {
          navigation.navigate('Main');
        }, 3000);
        return () => clearTimeout(timeout);
      } else {
        console.log('Token not found.');
        const timeout = setTimeout(() => {
          navigation.navigate('Login');
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.error('Error occurred while retrieving token:', error);
      // Handle error gracefully, for now, just navigate to Login
      const timeout = setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, []);


  return (
    <>
    <StatusBar backgroundColor="black"/>
    <ImageBackground
          source={require('./frontbackground.jpg')}
          style={styles.background}
        >
        <View style={styles.container}>
              <Image source={require('./chatsymbol.png')} style={styles.image}/>
              <Text style={styles.containerText}>Chatify</Text>
              <Text style={styles.containerSubText}>Let's Talk Together!!!!</Text>
        </View>
    </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  image:{
    width: 200,    
    height: 200,
    resizeMode: 'contain',
  },
  containerText: {
    fontFamily: 'Lemon-Regular',
    fontSize: 50,
    color: 'white',
    textShadowColor: 'white',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 10,
  },
  containerSubText: {
    fontFamily: 'Lemon-Regular',
    fontSize: 20,
    color: 'white',
    textShadowColor: 'white',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 10,
  },
});

export default Home;

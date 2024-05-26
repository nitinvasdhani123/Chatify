import React, {useState} from 'react';
import {View, Text, StyleSheet , ImageBackground, StatusBar , TextInput , TouchableHighlight,} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const Login = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [data, setData] = useState({});
  const [email, setEmail] = useState({});
  const navigation = useNavigation();

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleChange = (name, value) => {
    if (name === 'email') {
      setEmail(value);
    }
    setData({ ...data, [name]: value });
  };

  const handleForgetOTPPress = async() => {
    try {
      const response = await axios.post("http://192.168.196.213:8080/forget-password", data);
      if (response.status === 201) {
        const message = response.data;
        navigation.navigate('ForgetOTP', { successMessage: message, email: email });
      }
    } catch (error) {
      if (error.response && error.response.status === 500 || error.response.status === 400) {
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      }
    }
  };
  
  

  return (
    <>
    <StatusBar backgroundColor="black"/>
    <ImageBackground
          source={require('./frontbackground.jpg')}
          style={styles.background}
        >
        <View style={styles.container}>
          <Text style={styles.containerText}>Forget Password</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="white"
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>
          <TouchableHighlight
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleForgetOTPPress}
            underlayColor="transparent"
          >
          <Text style={[styles.buttontext, isPressed && styles.buttontextPressed]}>Send OTP</Text>
          </TouchableHighlight>
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
  containerText: {
    fontFamily: 'Lemon-Regular',
    fontSize: 50,
    color: 'white',
    textShadowColor: 'white',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 10,
  },
  form:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'white',
    borderWidth: 1,
    marginTop:20
  },
  input:{
    width: '90%',
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    width: '80%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop:40,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  buttontext:{
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  buttontextPressed: {
    color: 'white',
  },
  buttonPressed: {
    borderColor: 'white',
    borderWidth: 1,
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
    }),
  },
});

export default Login;

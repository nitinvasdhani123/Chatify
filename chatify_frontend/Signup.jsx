import React, {useState} from 'react';
import {View, Text, StyleSheet , ImageBackground, StatusBar , TextInput , TouchableHighlight,} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import axios from 'axios';
import { Alert } from 'react-native';



const Signup = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [iconPassword,setIconPassword] = useState('eye-slash')
  const [iconConfirmPassword,setIconConfirmPassword] = useState('eye-slash')
  const [data, setData] = useState({});
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const [email,setEmail] = useState('')
  const [isPressed, setIsPressed] = useState(false);
  const [isLinkPressed, setIsLinkPressed] = useState(false);
  const navigation = useNavigation();
  
  const togglePassword =()=>{
    if(hidePassword){
      setHidePassword(false)
      setIconPassword('eye')
    }else{
      setHidePassword(true)
      setIconPassword('eye-slash')
    }
  }
  const toggleConfrimPassword =()=>{
    if(hideConfirmPassword){
      setHideConfirmPassword(false)
      setIconConfirmPassword('eye')
    }else{
      setHideConfirmPassword(true)
      setIconConfirmPassword('eye-slash')
    }
  }
  
  const handleLoginPress = () => {
    navigation.navigate('Login'); 
  };

  const handleOTPPress = async() => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Password and confirm password are not matched');
        return;
      }
      const response = await axios.post("http://192.168.196.213:8080/", data);
      if (response.status === 201) {
        const message = response.data;
        navigation.navigate('OTP', { successMessage: message, email: email });
      }
    } catch (error) {
      if (error.response && error.response.status === 500 || error.response.status === 400) {
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const handlePressIn = () => {
    setIsPressed(true); 
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePressInLink = () => {
    setIsLinkPressed(true);
  };

  const handlePressOutLink = () => {
    setIsLinkPressed(false);
  };

  
  const handleChange = (name, value) => {
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    setData({ ...data, [name]: value });
  };
  


  return (
    <>
    <StatusBar backgroundColor="black"/>
    <ImageBackground
          source={require('./frontbackground.jpg')}
          style={styles.background}
        >
        <View style={styles.container}>
          <Text style={styles.containerText}>Signup</Text>
          <Text style={styles.containerSubText}>Let's Create A New Account!!!!</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="white"
              onChangeText={(text) => handleChange('name', text)}
            />
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="white"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(text) => handleChange('number', text)}
            />
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="white"
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.inputpassword}
              placeholder="Enter your password"
              secureTextEntry={hidePassword}
              placeholderTextColor="white"
              onChangeText={(text) => handleChange('password', text)}
            /><Icon name={iconPassword} onPress={togglePassword} size={30} color="white" />
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.inputpassword}
              placeholder="Enter your confirm password"
              secureTextEntry={hideConfirmPassword}
              placeholderTextColor="white"
              onChangeText={(text) => setConfirmPassword(text)}
            /><Icon name={iconConfirmPassword} onPress={toggleConfrimPassword} size={30} color="white" />
          </View>
          <TouchableHighlight
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleOTPPress}
            underlayColor="transparent"
          >
          <Text style={[styles.buttontext, isPressed && styles.buttontextPressed]}>Signup</Text>
          </TouchableHighlight>
          <View style={styles.accountview}>
            <Text style={styles.accounttext}>Already have an account? </Text>
            <TouchableHighlight onPressIn={handlePressInLink}
            onPressOut={handlePressOutLink} onPress={handleLoginPress} underlayColor="transparent">
              <Text style={[styles.loginlink, isLinkPressed && styles.linkbuttontextPressed]}>Login Here</Text>
            </TouchableHighlight>
          </View>
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
    paddingTop: 10,
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
  inputpassword:{
    width: '84%',
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
    marginTop:80,
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
  accountview:{
    marginTop:30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accounttext:{
    color:'white',
    fontSize:18,
  },
  loginlink:{
    color:'white',
    fontSize:18,
  },
  linkbuttontextPressed:{
    color:'rgb(128, 0, 128)',
  },
});

export default Signup;

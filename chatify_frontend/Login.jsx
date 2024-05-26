import React, {useState} from 'react';
import {View, Text, StyleSheet , ImageBackground, StatusBar , TextInput , TouchableHighlight,Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const [hide, setHide] = useState(true);
  const [token, setToken] = useState('');
  const [icon,setIcon] = useState('eye-slash')
  const [isPressed, setIsPressed] = useState(false);
  const [isLinkPressed, setIsLinkPressed] = useState(false);
  const [isForgetLinkPressed, setIsForgetLinkPressed] = useState(false);
  const [data, setData] = useState({});
  const navigation = useNavigation();


  const showPassword = () =>{
    if(hide){
      setHide(false)
      setIcon('eye')
    }else{
      setHide(true)
      setIcon('eye-slash')
    }
  }
  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };
  const handleForgetPress = () => {
    navigation.navigate('ForgetPassword');
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
  
  const handlePressInForgetLink = () => {
    setIsForgetLinkPressed(true);
  };
  
  const handlePressOutForgetLink = () => {
    setIsForgetLinkPressed(false);
  };

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
  };


  const handleMainPress = async() => {
    try {
      const response = await axios.post("http://192.168.196.213:8080/login", data);
      const  Token = response.data.userinfo.token;
      const  loginUserID = response.data.userinfo._id;
      await AsyncStorage.setItem('token', Token);
      await AsyncStorage.setItem('loginUserID', loginUserID);
      if (response.status === 201) {
        navigation.navigate('Main');
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
          <Text style={styles.containerText}>Login</Text>
          <Text style={styles.containerSubText}>See Your Account!!!!</Text>
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
              style={styles.inputpassword}
              placeholder="Enter your password"
              secureTextEntry={hide}
              placeholderTextColor="white"
              onChangeText={(text) => handleChange('password', text)}
            /><Icon name={icon} onPress={showPassword} size={30} color="white" />
          </View>
          <View style={styles.accountview}>
            <TouchableHighlight onPressIn={handlePressInForgetLink}
            onPressOut={handlePressOutForgetLink} onPress={handleForgetPress} underlayColor="transparent">
              <Text style={[styles.forgetlink, isForgetLinkPressed && styles.forgetlinkbuttontextPressed]}>Forget Password</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleMainPress}
            underlayColor="transparent"
          >
          <Text style={[styles.buttontext, isPressed && styles.buttontextPressed]}>Login</Text>
          </TouchableHighlight>
          <View style={styles.accountview}>
            <Text style={styles.accounttext}>Create an account? </Text>
            <TouchableHighlight onPressIn={handlePressInLink}
            onPressOut={handlePressOutLink} onPress={handleSignupPress} underlayColor="transparent">
              <Text style={[styles.loginlink, isLinkPressed && styles.linkbuttontextPressed]}>Signup Here</Text>
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
  accountview:{
    marginTop:30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  accounttext:{
    color:'white',
    fontSize:18,
  },
  loginlink:{
    color:'white',
    fontSize:18,
  },
  forgetlink:{
    color:'white',
    fontSize:18,
  },
  forgetlinkbuttontextPressed:{
    color:'rgb(128, 0, 128)',
  },
  linkbuttontextPressed:{
    color:'rgb(128, 0, 128)',
  },
});

export default Login;

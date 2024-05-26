import React, {useState,useEffect} from 'react';
import {View, Text, StyleSheet , ImageBackground, StatusBar , TextInput , TouchableHighlight,} from 'react-native';
import {useNavigation,useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { Alert } from 'react-native';


const Signup = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [iconPassword,setIconPassword] = useState('eye-slash')
  const [iconConfirmPassword,setIconConfirmPassword] = useState('eye-slash');
  const [isPressed, setIsPressed] = useState(false);
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const navigation = useNavigation();
  const route = useRoute();
  const { successMessage, email } = route.params;
  const [data, setData] = useState({
    email: email,            
    password: password,            
  }); 

  const showAlert = () => {
    Alert.alert('Success', JSON.stringify(successMessage));
  };

  useEffect(() => {
    showAlert();
  }, []);

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

  const handlePressIn = () => {
    setIsPressed(true);
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleChange = (name, value) => {
    if (name === 'password') {
      setPassword(value);
      setData(prevData => ({
        ...prevData,
        password: value
      }));
    }
  };

  const handleChangePassword = async() => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Password and confirm password are not matched');
        return;
      }
      const response = await axios.post("http://192.168.196.213:8080/reset-password", data);
      if (response.status === 201) {
        // const message = response.data;
        navigation.navigate('Login');
      }
    } catch (error) {
      if ( error.response && error.response.status === 500 ) {
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
          <Text style={styles.containerText}>Reset Password</Text>
          <Text style={styles.containerSubText}>Enter Your New Password!!!!</Text>
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
            onPress={handleChangePassword}
            underlayColor="transparent"
          >
          <Text style={[styles.buttontext, isPressed && styles.buttontextPressed]}>Submit</Text>
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
});

export default Signup;

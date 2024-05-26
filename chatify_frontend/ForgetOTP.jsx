import React, {useEffect,useState,useRef} from 'react';
import {View, Text, StyleSheet , ImageBackground, StatusBar , TextInput , TouchableHighlight,} from 'react-native';
import {useNavigation,useRoute} from '@react-navigation/native';
import axios from 'axios';
import { Alert } from 'react-native';

const ForgetOTP = () => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);
  const [inputs, setInputs] = useState(['', '', '', '']); 
  const inputRefs = useRef([]);
  const route = useRoute();
  const { successMessage, email } = route.params;
  const [data, setData] = useState({
    email: email, 
    otp: inputs             
  }); 
  
  const handlePressIn = () => {
    setIsPressed(true);
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleInputChange = (index, text, isBackspace) => {
    const newInputs = [...inputs];
    if (!isBackspace) {
      newInputs[index] = text;
    } else {
      newInputs[index] = text.slice(0, -1);
    }
    setInputs(newInputs);
    const otpString = newInputs.join("");
    setData(prevData => ({
      ...prevData,
      otp: otpString
    }));
  
    // Move focus to the previous TextInput if Backspace is pressed
    if (isBackspace && text.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (!isBackspace && text.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };  

  const handleOTPPress = async() => {
    try {
      const response = await axios.post("http://192.168.196.213:8080/verify-forget-password-otp", data);
      if (response.status === 201) {
        const message = response.data;
        navigation.navigate('ResetPassword', { successMessage: message, email: email });
      }
    } catch (error) {
      if (error.response && error.response.status === 500 ) {
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const showAlert = () => {
    Alert.alert('Success', successMessage);
  };

  useEffect(() => {
    showAlert();
  }, []);



  

  return (
    <>
    <StatusBar backgroundColor="black"/>
    <ImageBackground
          source={require('./frontbackground.jpg')}
          style={styles.background}
        >
        <View style={styles.container}>
          <Text style={styles.containerText}>OTP Verification</Text>
          <Text style={styles.containerSubText}>OTP Is Send To Your Email Or Phone Number!!!!</Text>
          <View style={styles.form}>
              {inputs.map((value, index) => (
                <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.input}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleInputChange(index, text, false)} // Pass false for isBackspace
                onKeyPress={({ nativeEvent: { key } }) => {
                  if (key === 'Backspace') {
                    handleInputChange(index, '', true); // Pass true for isBackspace
                  }
                }}
              />            
            ))}
          </View>
          <TouchableHighlight
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleOTPPress}
            underlayColor="transparent"
          >
          <Text style={[styles.buttontext, isPressed && styles.buttontextPressed]}>Verify</Text>
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
    fontSize: 16,
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
    marginTop:20
  },
  input:{
    backgroundColor: 'white',
    fontSize:30,
    width: 80,
    height: 80,
    textAlign:'center',
    borderRadius: 20,
    margin:10
  },
  button: {
    backgroundColor: 'white',
    width: '80%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop:50,
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

export default ForgetOTP;

import React, {useState} from 'react';
import {View, Text, StyleSheet ,Image, ImageBackground, StatusBar,TextInput, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Home = () => {
  const [imageSource, setImageSource] = useState(null);
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);
  const [isBackPressed, setIsBackPressed] = useState(false);
  const [isUploadPressed, setIsUploadPressed] = useState(false);
  const [data, setData] = useState({});
  
  const selectImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true ,
        freeStyleCropEnabled:true
      });
      setImageSource(image.path)
      setData({ ...data, pic: image.path });
    }catch (error) {
      console.error('Error picking/uploading image:', error);
    }
  };






  const handleUploadPressIn = () => {
    setIsUploadPressed(true);
  };

  const handleUploadPressOut = () => {
    setIsUploadPressed(false);
  };

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleBackPressIn = () => {
    setIsBackPressed(true);
  };

  const handleBackPressOut = () => {
    setIsBackPressed(false);
  };
  
  const handleMainPress = () => {
    navigation.navigate('Main');
  };


  const handleProfileUpdate = async() => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        const response = await axios.patch(`http://192.168.196.213:8080/LoginUserDetailUpdate?token=${token}`, data);
        if (response.status === 201) {
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500 ) {
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      }
    }
  };




  const handleChange = (name, value) => {
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
        <Text style={styles.containerText}>Update Your Profile</Text>
        {imageSource === null ? null : (
          <View>
            {imageSource && <Image source={{ uri: imageSource }} style={styles.profilePic} />}
          </View>
        )}
        <TouchableHighlight
            style={[styles.button, isUploadPressed && styles.buttonPressed]}
            onPressIn={handleUploadPressIn}
            onPressOut={handleUploadPressOut}
            onPress={selectImage}
            underlayColor="transparent"
            >
          <Text style={[styles.buttontext, isUploadPressed && styles.buttontextPressed]}>Upload Your Pic</Text>
          </TouchableHighlight>
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
              placeholder="Enter your email"
              placeholderTextColor="white"
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter your Favourate Bio"
              placeholderTextColor="white"
              onChangeText={(text) => handleChange('bio', text)}
            />
          </View>
          <TouchableHighlight
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleProfileUpdate}
            underlayColor="transparent"
          >
          <Text style={[styles.buttontext, isPressed && styles.buttontextPressed]}>Update</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, isBackPressed && styles.buttonPressed]}
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}
            onPress={handleMainPress}
            underlayColor="transparent"
          >
          <Text style={[styles.buttontext, isBackPressed && styles.buttontextPressed]}>Back</Text>
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
    fontSize: 40,
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
    width: '90%',
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
  profilePic:{
    borderColor:'white',
    borderWidth:1,
    width:200,
    height:200,
    borderRadius:100,
    marginTop:15
  }
});

export default Home;

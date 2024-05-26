import React, { useState , useEffect} from 'react';
import {View, Text, StyleSheet , Image, ImageBackground, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const Home = ({ route }) => {
  const [data, setData] = useState({});
  const navigation = useNavigation();
  const { userId } = route.params;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.196.213:8080/getUserDetailsWhichIsClick?_id=${userId}`);
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          Alert.alert('Error', errorMessage);
        }
      }
    };
  
    fetchData();
  }, [userId]);
  const handleBackToMain = () => {
    navigation.navigate('ChatInterface', { userId: userId });
  };
  return (
    <>
    <StatusBar backgroundColor="black"/>
    <ImageBackground
          source={require('./frontbackground.jpg')}
          style={styles.background}
        >
        <View style={styles.imageView}>
        <View style={styles.profile}>
            <IconBack name="keyboard-backspace" size={35} onPress={handleBackToMain} color="white" style={styles.icon}/>
            <Text style={styles.textName}>User Profile</Text>
          </View>
        </View>
        <View style={styles.container}>
          <Image source={{ uri: data.pic }} style={styles.profilepic}/>
          <Text style={styles.userName}>{data.name}</Text>
          <Text style={styles.userBio}>{data.bio}</Text>
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
  profilepic:{
    borderColor:'white',
    borderWidth:2,
    width:250,
    height:250,
    borderRadius:20
  },
  userName:{
    color:"white",
    fontSize:35,
    marginTop:10
  },
  userBio:{
    color: "white",
    marginLeft:15,
    marginRight:15,
    marginTop:15,
    textAlign:"center",
    fontSize:20,
    lineHeight:20,
  },
  imageView:{
    flexDirection:'row',
    borderBottomColor: 'white',
    justifyContent:'space-between',
    borderWidth: 0.5,
    alignItems:'center',
    paddingTop:18,
    paddingBottom:18,
  },
  textName:{
    color: "yellow",
    fontSize:30
  },
  profile:{
    flexDirection:'row',
    alignItems:'center'
  },
  icon:{
    marginLeft:15,
    marginRight:15
  },
});

export default Home;

import React, {useState} from 'react';
import 'react-native-gesture-handler';
import {View, Text, StyleSheet , ImageBackground, StatusBar , Image , TouchableHighlight,TextInput,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';

const Main = () => {
  const [isAddPressed, setIsAddPressed] = useState(false);
  const [data, setData] = useState({});
  const [userInfo, setUserInfo]  = useState(null);
  const [status, setStatus] = useState({});
  const [add, setAdd] = useState("");
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate('Main'); 
  };

  const handleAddPressIn = () => {
    setIsAddPressed(true);
  };

  const handleAddPressOut = () => {
    setIsAddPressed(false);
  };

  
  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const searchAccount = async() => {
    try {
      const response = await axios.post(`http://192.168.196.213:8080/getSearchUserDetail`,data);
      if (response.status === 201) {
          if(response.data.statusFlag === 0){
            setAdd("Add")
          }else if(response.data.statusFlag === 1){
            setAdd("Added")
          }
          setUserInfo(response.data);
        }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const addUser = async(_id) => {
    try {
      if(add === "Add"){
        setStatus({statusFlag : 1 });
      }else if(add === "Added"){
        setStatus({statusFlag : 0 });
      }
      const response = await axios.patch(`http://192.168.196.213:8080/SearchUserStatusUpdate?_id=${_id}`, status);
      if (response.status === 201) {
        console.warn(response.data)
        if(response.data.statusFlag === 1){
          setAdd("Added")
        }else if(response.data.statusFlag === 0){
          setAdd("Add")
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      }
    }
  };







  return (
    <GestureHandlerRootView>
    <>
      <StatusBar backgroundColor="black"/>
      <ImageBackground
            source={require('./frontbackground.jpg')}
            style={styles.background}
            >
          <View style={styles.container}>
            <View  style={styles.drawer}>
                <IconBack name="keyboard-backspace" style={styles.search} onPress={handleBackPress} size={30} color="white" />
                <View style={styles.form}>
                    <TextInput
                    style={styles.input}
                    placeholder="Enter a number to search"
                    placeholderTextColor="white"
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={(text) => handleChange('number', text)}
                    />
                </View>
                <Icon name="search" style={styles.search}  onPress={searchAccount} size={30} color="white" />
            </View>
          </View>
          <View style={styles.user}>
            <ScrollView>
            {userInfo !== null && (
                <View style={styles.imageView}>
                    <View style={styles.profile}>
                      <Image source={{ uri: userInfo.pic }} style={styles.profilePic}/>
                      <View>
                        <Text style={styles.textName}>{userInfo.name}</Text>
                      </View>
                    </View>
                    <View>
                        <TouchableHighlight 
                          style={[styles.addButton, isAddPressed && styles.buttonPressed]}
                          onPressIn={handleAddPressIn}
                          onPressOut={handleAddPressOut}
                          onPress={() => addUser(userInfo._id)}
                          underlayColor="transparent"
                        >
                          <Text style={[styles.add, isAddPressed && styles.buttontextPressed]}>{add}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            )}
            </ScrollView>
          </View>
      </ImageBackground>
    </>
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomColor:"white",
    borderWidth:1
  },
  background: {
    resizeMode: 'cover', 
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  search:{
    margin:12,
  },
  drawer:{
    marginTop:15,
    marginBottom:15,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center'
  },
  user:{
    flex:1,
    justifyContent:"flex-start",
  },
  imageView:{
    flexDirection:'row',
    borderBottomColor: 'white',
    justifyContent:'space-between',
    borderTopColor: 'white',
    borderWidth: 0.5,
    alignItems:'center',
    paddingTop:18,
    paddingBottom:18,
  },
  image:{
    margin:15,
    height:'110%',
    width:'13%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius:50
  },
  textName:{
    color:'white',
    fontSize:20
  },
  textLastMessage:{
    color:'white',
    fontSize:15
  },
  userInfo: {
    marginVertical: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor:'white',
    borderWidth:1
  },
  userName: {
    color: 'white',
    fontSize: 18,
  },
  userEmail: {
    color: 'white',
    fontSize: 14,
  },
  userBio:{
    color: 'white',
    fontSize: 13,
    paddingLeft:4,
    paddingRight:4,
    textAlign:'center'
  },
  form:{
    width: "78%",
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft:22,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius:30
  },
  input:{
    fontSize: 20,
    color: 'white',
  },
  profile:{
    flexDirection:'row',
    alignItems:'center'
  },
  profilePic:{
    borderColor:'white',
    borderWidth:1,
    width:70,
    height:70,
    borderRadius:40,
    marginRight:10,
    marginLeft:10
  },
  add:{
    color:'white',
    fontSize:20,
    textAlign:'center',
    color: 'black',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  buttontextPressed: {
    color: 'white',
  },
  addButton:{
    borderColor:'white',
    backgroundColor: 'white',
    borderWidth:1,
    marginRight:10,
    padding:10,
    width:100,
    borderRadius:30,
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
  }
});

export default Main;
import React, { useState , useEffect} from 'react';
import 'react-native-gesture-handler';
import {View, Text, StyleSheet , ImageBackground,TextInput, StatusBar , Image , TouchableHighlight,Alert, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import IconPhone from 'react-native-vector-icons/MaterialIcons';
import IconVideo from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';




const ChatInterface = ({ route }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [message,setmessage] = useState('')
  const [data, setData] = useState({});
  const [allChats, setAllChats] = useState([]);
  const [senderID, setsenderID] = useState('');
  const [receiverID, setreceiverID] = useState('');
  const [call,setcall] = useState(0)
  const navigation = useNavigation();
  const { userId } = route.params;
  const socket = io('http://192.168.196.213:8080');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.196.213:8080/getUserDetailsWhichIsClick?_id=${userId}`);
        if (response.status === 200) {
          setData(response.data);
          setcall(call+1)
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          Alert.alert('Error', errorMessage);
        }
      }
    };
  
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginUserID = await AsyncStorage.getItem('loginUserID');
        setsenderID(loginUserID);
        setreceiverID(userId);
        const response = await axios.get(`http://192.168.196.213:8080/getallconversations/${senderID}/${receiverID}`);
        if (response.status === 200) {
          // console.log(response.data);
          setAllChats(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          Alert.alert('Error', errorMessage);
        }
      }
    };

    fetchData();
  }, [call]);

  const sendMessage = async() => {
    try {
      const response = await axios.post(`http://192.168.196.213:8080/addconversations`,{
        sender_id:senderID,
        receiver_id:receiverID,
        message : message
      }
    );
      if (response.status === 201) {
        // console.warn('send')
        setmessage('')
        sendMessageToServer()
        setcall(call+1)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      }
    }
  }

  // Function to send a message to the server via Socket.io
  const sendMessageToServer = () => {
    const timestamp = new Date().toISOString();

    socket.emit("message", {
      sender_id: senderID,
      receiver_id: receiverID,
      message: message,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  };

  // Function to update the 'allchats' state with new messages
  const handleIncomingMessage = (messageData) => {
    // Update 'allchats' state with the new message data
    setAllChats((prevChats) => [...prevChats, messageData]);
  };

  // useEffect to handle incoming messages from the server
  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message", handleIncomingMessage);

    // Emit an event to join the room
    socket.emit("joinRoom", receiverID);
    
    // Cleanup the event listener on component unmount
    return () => {
      socket.off("message");
    };
  }, []);
  
  const handleUserProfile = () => {
    navigation.navigate('UserProfile', { userId: userId });
  };
  const handleBackToMain = () => {
    navigation.navigate('Main');
  };
  const handlePressIn = () => {
    setIsPressed(true);
  };
  const handlePressOut = () => {
    setIsPressed(false);
  };
  // Function to open the dial pad with a specific number
  const openDialPad = (phoneNumber) => {
    // Use the tel scheme to open the phone dial pad
    const url = `tel:${phoneNumber}`;
    // Open the dial pad
    Linking.openURL(url)
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <GestureHandlerRootView>
    <>
      <StatusBar backgroundColor="black"/>
      <ImageBackground
        source={require('./frontbackground.jpg')}
        style={styles.background}
        >
        <View style={styles.imageView}>
          <View style={styles.profile}>
            <IconBack name="keyboard-backspace" size={30} onPress={handleBackToMain} color="white" style={styles.icon}/>
            <TouchableHighlight onPress={handleUserProfile}>
              <Image source={{ uri: data.pic }} style={styles.profilePic} />
            </TouchableHighlight>
            <Text style={styles.textName}>{data.name}</Text>
          </View>
            <View style={styles.callingicon}>
              <IconPhone name="call" size={35} onPress={() => {openDialPad(data.number)}} color="white" style={styles.Phonecallingicon}/>
              <IconVideo name="video-call" size={35} color="white" style={styles.Videocallingicon}/>
            </View>
        </View>
        <ScrollView>
          <View style={styles.user}>
          {
            allChats.map((chat,index)=>{
              if (senderID === chat.sender_id) {
                return(
                  <View style={styles.right} key={index}>
                    <Text style={styles.rightMessage}>{chat.message}</Text>
                  </View>
                );
              }
              else{
                return(
                  <View style={styles.left} key={index}>
                    <Text style={styles.leftMessage}>L{chat.message}</Text>
                  </View>
                );
              }
            })
          }
          </View>
        </ScrollView>
        <View style={styles.input}>
            <TextInput 
            style={styles.message}
            placeholder="Enter a message here....." 
            value={message}
            placeholderTextColor="white" onChangeText={(text) => setmessage(text)}></TextInput>
              <TouchableHighlight
              style={[styles.button, isPressed && styles.buttonPressed]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={sendMessage}
              underlayColor="transparent"
            >
            <Icon name="send" size={35} color="white" style={[styles.buttontext, isPressed && styles.buttontextPressed]}/>
            </TouchableHighlight>
        </View>
      </ImageBackground>
    </>
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  containerText: {
    color:'white',
    fontSize:30,
    margin:15,
  },
  profile:{
    flexDirection:'row',
    alignItems:'center'
  },
  profilePic:{
    borderColor:'white',
    borderWidth:1,
    width:60,
    height:60,
    borderRadius:40,
    marginRight:10,
    marginLeft:10
  },
  background: {
    resizeMode: 'cover', 
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  user:{
    flex:1,
    justifyContent:"flex-start",
  },
  right:{
    alignItems: 'flex-end',
  },
  rightMessage:{
    color:'white',
    paddingTop:10,
    paddingBottom:10,
    paddingRight:20,
    paddingLeft:20,
    fontSize:20,
    borderRadius:15,
    marginTop:8,
    marginBottom:8,
    marginRight:12,
    backgroundColor:'#6720BA',
    maxWidth:'70%'
  },
  left:{
    alignItems:'flex-start',
    maxWidth:"70%"
  },
  leftMessage:{
    color:'white',
    paddingTop:10,
    paddingBottom:10,
    paddingRight:20,
    paddingLeft:20,
    fontSize:20,
    borderRadius:15,
    marginTop:5,
    marginBottom:5,
    marginLeft:12,
    backgroundColor:'#6720BA',
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
    color:'white',
    fontSize:20
  },
  input:{
    height:'8%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  message:{
    borderColor: 'white',
    borderWidth: 1,
    width:'80%',
    paddingLeft:20,
    borderRadius:25,
    marginRight:8,
    color:'white',
    fontSize:15
  },
  icon:{
    marginLeft:10
  },
  callingicon:{
    flexDirection:'row'
  },
  Phonecallingicon:{
    marginRight:10
  },
  Videocallingicon:{
    marginRight:10
  },
  button: {
    backgroundColor: 'white',
    width:70,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
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
    fontSize: 20,
    color: 'black',
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

export default ChatInterface;
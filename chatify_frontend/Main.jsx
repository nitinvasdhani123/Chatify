import React,{useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, Text, StyleSheet , ImageBackground, StatusBar , Image , TouchableHighlight,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Drawer = createDrawerNavigator();



const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '', 
    Bio: '', 
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token !== null) {
          const response = await axios.get(`http://192.168.196.213:8080/getLoginUserDetail?token=${token}`);
          if (response.status === 201) {
            const { name, number, email, pic, bio } = response.data;
            setUser({
              ...user,
              name: name,
              phone: number,
              email: email,
              profileImage: pic,
              Bio: bio,
            });
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          Alert.alert('Error', errorMessage);
        }
      }
    };
  
    fetchData(); // Call the async function immediately
  
  }, []);
  

  const handleLogout = async() => {
    try {
      const remove1 = await AsyncStorage.removeItem('token');
      const remove2 = await AsyncStorage.removeItem('loginUserID');
      console.log('Token and loginUserID removal status:', remove1 , ' and' , remove2);
      if(remove1 !== null && remove2 !== null){
        console.log('Token and loginUserID removed successfully.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error removing token and loginUserID:', error);
    }
  };
  
  const handleOwnProfile = () => {
    navigation.navigate('OwnProfile');
  };
  const handleResetPassword = () => {
    navigation.navigate('ForgetPassword');
  };
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.userInfo}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.phone}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userBio}>{user.Bio}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Update Profile"
        onPress={handleOwnProfile}
        labelStyle={{ color: 'white', fontSize: 20 }}
      />
      <DrawerItem
        label="Reset Password"
        onPress={handleResetPassword}
        labelStyle={{ color: 'white', fontSize: 20 }}
      />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        labelStyle={{ color: 'white', fontSize: 20 }}
      />
    </DrawerContentScrollView>
  );
};

const Main = () => {
  return (
    <Drawer.Navigator screenOptions={{
      header: () => <HomeScreen />
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{
      drawerLabel: () => (
        <Text style={{ color: 'white' , fontSize:20}}>Home</Text>
      ),
    }}/>
    </Drawer.Navigator>
  );
};

const HomeScreen = () => {
  const [allUser , setAllUser] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(`http://192.168.196.213:8080/getAllUserDetailOtherThanLoginUser`);
        if (response1.status === 201) {
          setAllUser(response1.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          Alert.alert('Error', errorMessage);
        }
      }
    };
  
    fetchData(); // Call the async function immediately
  
    // No cleanup needed, so return nothing
  }, []);
  


  const handleDrawerToggle = () => {
    navigation.openDrawer();
  };

  const handleOpenChat = (_id) => {
    navigation.navigate('ChatInterface', { userId: _id });
  };

  const handleSearchUser = () => {
    navigation.navigate('SearchUser');
  }
  return (
    <>
      <StatusBar backgroundColor="black"/>
      <ImageBackground
            source={require('./frontbackground.jpg')}
            style={styles.background}
            >
          <View style={styles.container}>
            <View>
              <Text style={styles.containerText}>Chatify</Text>
            </View>
            <View  style={styles.drawer}>
              <Icon name="search" style={styles.search} onPress={handleSearchUser} size={25} color="white" />
              <Icon name="bars" style={styles.search} onPress={handleDrawerToggle} size={30} color="white" />
            </View>
          </View>
          <View style={styles.user}>
            <ScrollView>
            {allUser !== null && allUser.map(user => (
              <TouchableHighlight onPress={() => handleOpenChat(user._id)} underlayColor="transparent" key={user._id}>
                <View style={styles.imageView}>
                  <Image source={{ uri: user.pic }} style={styles.image} />
                  <View>
                    <Text style={styles.textName}>{user.name}</Text>
                    <Text style={styles.textLastMessage}>lastMessage</Text>
                  </View>
                </View>
              </TouchableHighlight>
            ))}
            </ScrollView>
          </View>
      </ImageBackground>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  containerText: {
    color:'white',
    fontSize:30,
    margin:15,
  },
  background: {
    resizeMode: 'cover', 
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  search:{
    margin:15,
  },
  drawer:{
    flexDirection: 'row',
    alignItems:'center'
  },
  user:{
    flex:1,
    justifyContent:"flex-start",
  },
  imageView:{
    flexDirection:'row',
    borderBottomColor: 'white',
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
  drawerContent: {
    backgroundColor: 'black'
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
  }
});

export default Main;
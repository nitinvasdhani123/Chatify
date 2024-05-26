import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import OTP from './OTP'
import Main from './Main'
import ForgetPassword from './ForgetPassword'
import ForgetOTP from './ForgetOTP';
import ResetPassword from './ResetPassword';
import OwnProfile from './OwnProfile';
import ChatInterface from './ChatInterface'
import SearchUser from './SearchUser'
import UserProfile from './UserProfile'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="OTP" component={OTP} options={{ headerShown: false }}/>
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgetOTP" component={ForgetOTP} options={{ headerShown: false }}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }}/>
        <Stack.Screen name="OwnProfile" component={OwnProfile} options={{ headerShown: false }}/>
        <Stack.Screen name="ChatInterface" component={ChatInterface} options={{ headerShown: false }}/>
        <Stack.Screen name="SearchUser" component={SearchUser} options={{ headerShown: false }}/>
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;

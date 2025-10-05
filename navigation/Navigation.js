import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';  
import { auth } from '../src/config/firebaseConfig';  
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import AppTabs from './AppTabs';

const Stack = createStackNavigator();

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={Login} options={{title:'', headerLeft: () => null,headerShadowVisible: false,
            headerStyle: { 
              backgroundColor: 'white', 
              elevation: 0,
            },}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{title:'',headerShadowVisible: false,
            headerStyle: { 
              backgroundColor: 'white', 
              elevation: 0},}}/>
        <Stack.Screen name="Home" component={AppTabs} options={{title:'Inicio', headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;


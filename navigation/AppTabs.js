import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { useToast } from '../componentes/Alert';

// Pantallas
import Home from '../screens/Home';
import Perfil from '../screens/Perfil';

const bottomPadding = Platform.OS === 'ios' ? 22 : 40;
const Tab = createBottomTabNavigator();

export default function AppTabs({ navigation }) {
  const { show: showToast } = useToast();

  return (
    <Tab.Navigator
      initialRouteName="InicioTab"
      screenOptions={{
        tabBarActiveTintColor: '#000000ff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
        tabBarStyle: {
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 5,
        },
      }}
    >
      {/* --- HOME --- */}
      <Tab.Screen
        name="InicioTab"
        component={Home}
        options={({ navigation }) => ({
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" color={color} size={size} />,
          headerTitle: () => (
            <Image
              source={require('../assets/logoTinta.png')}
              style={{ width: 200, height: 80, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerRight: () => {
            const handleLogOut = async () => {
              try {
                await signOut(auth);
                showToast({ type: 'success', text: 'Se cerró sesión correctamente' });
                navigation.replace('Login');
              } catch (error) {
                showToast({ type: 'error', text: 'No se pudo cerrar sesión' });
              }
            };
            return (
              <TouchableOpacity onPress={handleLogOut} style={{ marginRight: 15 }}>
                <FontAwesome name="sign-out" size={24} color="#000000ff" />
              </TouchableOpacity>
            );
          },
        })}
      />

      {/* --- PERFIL --- */}
      <Tab.Screen
        name="PerfilTab"
        component={Perfil}
        options={({ navigation }) => ({
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#f9f9f9',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>    Perfil</Text>
          ),
          headerTitleAlign: 'left',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
}

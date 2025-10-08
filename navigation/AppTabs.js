import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
// Importa tus componentes de pantalla
import Home from '../screens/Home';      // O el nombre de tu componente Home real
import Configuracion from '../screens/Configuracion';

const bottomPadding = Platform.OS === 'ios' ? 22 : 40;
const Tab = createBottomTabNavigator();
export default function AppTabs() {
    return (
        <Tab.Navigator
        initialRouteName="InicioTab"
        screenOptions={{
            tabBarActiveTintColor: '#000000ff', // Color de ícono/texto activo (negro de tu app)
            tabBarInactiveTintColor: 'gray',    // Color inactivo
            tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
            tabBarStyle: {          height: 60 + bottomPadding, 
          paddingBottom: bottomPadding, // Añade el relleno en la parte inferior
          paddingTop: 5, }, // Estilos de la barra
            //headerShown: false, 
            headerTitleAlign: 'center' ,
        }}
        >
        {/* Pestaña: INICIO */}
        <Tab.Screen
            name="InicioTab"
            component={Home}
            options={{
            title: 'Inicio', // Título que se muestra en la pestaña
            tabBarIcon: ({ color, size }) => (
                <FontAwesome name="home" color={color} size={size} />
            ),
            }}
        />

        {/* Pestaña: SETTINGS */}
        <Tab.Screen
            name="SettingsTab"
            component={Configuracion}
            options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
                <FontAwesome name="user" size={size} color={color} />
            ),
            }}
        />
        </Tab.Navigator>
    );
}
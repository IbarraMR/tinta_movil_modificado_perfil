import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Platform, TouchableOpacity} from 'react-native'; // <-- Aseguramos la importación de Alert
import { signOut } from 'firebase/auth'; // Importamos signOut
import { auth } from '../src/config/firebaseConfig'; // Importamos auth
import  { useToast } from '../componentes/Alert';  // Importa el hook useToast
// Importa tus componentes de pantalla
import Home from '../screens/Home';      
import Configuracion from '../screens/Configuracion';

const bottomPadding = Platform.OS === 'ios' ? 22 : 40;
const Tab = createBottomTabNavigator();

// Función useLogOut eliminada de aquí, se moverá la lógica al scope de screenOptions

export default function AppTabs() {
    const { show: showToast } = useToast();
    // 1. AppTabs ya no recibe 'navigation' directamente
    return (
        <Tab.Navigator
        initialRouteName="InicioTab"
        
        // 2. CLAVE: screenOptions debe ser una FUNCIÓN para recibir el objeto 'navigation'
        screenOptions={({ navigation }) => {
            // 3. Define la función de cierre de sesión aquí dentro, donde 'navigation' existe
            const handleLogOut = async () => {
                try {
                    await signOut(auth);  
                    showToast({ type: "success", text: "Se cerro sesión correctamente" });
                    // Navega a la pantalla de Login
                    navigation.replace('Login');  
                } catch (error) {
                    showToast({ type: "error", text: "No se pudo cerrar sesión" });
                }
            };

            return ({
                tabBarActiveTintColor: '#000000ff',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
                tabBarStyle: {          
                    height: 60 + bottomPadding, 
                    paddingBottom: bottomPadding, 
                    paddingTop: 5, 
                },
                headerTitle: () => (
                    <Image
                        // REEMPLAZA esta ruta con la ubicación real de tu archivo de logo (e.g., logo.png)
                        source={require('../assets/logoTinta.png')} 
                        style={{ width: 200, height: 80, resizeMode: 'contain' }}
                    />
                ),
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: { 
                    backgroundColor: 'white', 
                    elevation: 0,
                    shadowOpacity: 0, // Elimina la sombra en iOS
                },

                // 4. Conecta el botón a la función handleLogOut
                headerRight: () => (
                    <TouchableOpacity
                        onPress={handleLogOut} // <-- CORRECTO: Llama a la función asíncrona de logout
                        style={{ marginRight: 15 }}
                    >
                        <FontAwesome 
                            name="sign-out"
                            size={24} 
                            color="#000000ff" 
                        />
                    </TouchableOpacity>
                ),
            });
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
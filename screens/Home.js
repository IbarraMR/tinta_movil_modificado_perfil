import React ,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Modal, Pressable } from 'react-native'; 
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PieChart } from "react-native-chart-kit";

// Get screen width for chart responsiveness
const screenWidth = Dimensions.get("window").width;

// Chart configuration object
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};
const MetaCard = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={neumorphismStyles.cardContainer} onPress={onPress}>
      <Text style={neumorphismStyles.cardTitle}>{icon}</Text>
      <Text style={neumorphismStyles.cardSubtitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function Home({ navigation }) {
      // 1. STATE FOR MODAL
    const [showAboutModal, setShowAboutModal] = useState(false);

    // Function to handle card presses
    const handleCardPress = (screenName) => {
        // IMPORTANT: Replace 'InsumosScreen', 'ProductosScreen', etc. with the actual names
        // defined in your App's navigation stack.
        navigation.navigate(screenName);
  }
  const data = [
    {
      name: "Agenda Simple",
      population: 72,
      color: "#A6A6A6",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Resma A4",
      population: 29,
      color: "#595959",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Papel Fotografico",
      population: 102,
      color: "#BFB8B4",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Vinilos",
      population: 85,
      color: "#3B403F",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Cartuchos de tinta",
      population: 192,
      color: "#00010D",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }
  ];

  return (
        <View style={{ flex: 1, backgroundColor: NEU_COLOR }}>
            {/* --- 1. MODAL COMPONENT --- */}
            <Modal
                animationType="slide" // Slide from bottom
                transparent={true}
                visible={showAboutModal}
                onRequestClose={() => setShowAboutModal(false)}
            >
                <Pressable 
                    style={modalStyles.centeredView} 
                    onPress={() => setShowAboutModal(false)} // Closes modal when tapping outside
                >
                    <View style={modalStyles.modalView}>
                        <Text style={modalStyles.modalTitle}>Sobre Nosotros</Text>
                        <Text style={modalStyles.modalSubtitle}>Misión</Text>
                        <Text style={modalStyles.modalText}>
                            Nuestra misión es proporcionar soluciones de papelería e insumos de impresión de alta calidad, garantizando la satisfacción total del cliente a través de un servicio rápido y personalizado.
                        </Text>
                        <Text style={modalStyles.modalSubtitle}>Visión</Text>
                        <Text style={modalStyles.modalText}>
                            Ser el proveedor líder en la región, reconocido por la innovación y la sostenibilidad de nuestros productos, y por impulsar el crecimiento de nuestros clientes y colaboradores.
                        </Text>
                        <TouchableOpacity
                            style={[neumorphismStyles.aboutButton, { marginTop: 30, width: '80%' }]}
                            onPress={() => setShowAboutModal(false)}
                        >
                            <Text style={neumorphismStyles.aboutButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* --- 2. MAIN CONTENT --- */}
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
                <View>
                    <Text style={styles.title}>Insumos mas utilizados</Text>
                    <PieChart
                        data={data}
                        width={screenWidth}
                        height={180}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        center={[screenWidth / 12, 0]}
                        absolute
                    />
                </View>

                {/* CARDS */}
                <Text style={[styles.title, { marginTop: 30 }]}>Menú Principal</Text>
                <View style={neumorphismStyles.cardsWrapper}>
                    <MetaCard 
                        title="Insumos" 
                        icon="📦" 
                        onPress={() => handleCardPress('InsumosScreen')} // <-- NAVIGATION
                    />
                    <MetaCard 
                        title="Productos" 
                        icon="🏷️" 
                        onPress={() => handleCardPress('ProductosScreen')} // <-- NAVIGATION
                    />
                    <MetaCard 
                        title="Proveedores" 
                        icon="🚚" 
                        onPress={() => handleCardPress('ProveedoresScreen')} // <-- NAVIGATION
                    />
                    <MetaCard 
                        title="Ventas" 
                        icon="💸" 
                        onPress={() => handleCardPress('VentasScreen')} // <-- NAVIGATION
                    />
                </View>

                {/* "SOBRE NOSOTROS" BUTTON */}
                <Text style={[styles.title, { marginTop: 30 }]}>Información</Text>
                <TouchableOpacity 
                    style={neumorphismStyles.aboutButton} 
                    onPress={() => setShowAboutModal(true)} // <-- SHOW MODAL
                > 
                    <Text style={neumorphismStyles.aboutButtonText}>Sobre Nosotros</Text>
                </TouchableOpacity>

                {/* Optional Sign Out Button */}
                {/* <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity> */}
            </KeyboardAwareScrollView>
        </View>
    );
}

const NEU_COLOR = '#ffffffff';
const SHADOW_LIGHT = '#f0f0f0'; // Sombra clara
const SHADOW_DARK = '#050505ff';  // Sombra oscura

const neumorphismStyles = StyleSheet.create({
    cardsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: screenWidth - 40, // Para que las tarjetas se ajusten al padding de 20
        marginTop: 10,
    },
    // --- ESTILO BASE DE LA TARJETA (ELEVADA) ---
    cardContainer: {
        width: (screenWidth - 60) / 2, // 2 tarjetas por fila con espacio entre ellas
        height: 150,
        backgroundColor: NEU_COLOR,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        
        // Estilos para la elevación (Elevated/Outset Neumorphism)
        // iOS Shadows
        shadowColor: SHADOW_DARK, // Sombra inferior/derecha (oscura)
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 5,
        
        // Android Elevation (simula la sombra oscura)
        elevation: 8, 
        
        // Segunda sombra para el lado claro (simulada con un borde ligero o vista superpuesta en producción)
        // En RN, la segunda sombra se logra con otro componente, pero para simplicidad usamos un borde sutil:
        borderColor: SHADOW_LIGHT, 
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 30,
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
    },

    // --- ESTILO PARA BOTÓN "SOBRE NOSOTROS" (ELEVADO) ---
    aboutButton: {
        backgroundColor: NEU_COLOR,
        width: '95%',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        height: 60,
        
        // Mismos estilos de elevación
        shadowColor: SHADOW_DARK,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8, 
        borderColor: SHADOW_LIGHT, 
        borderWidth: 1,
    },
    aboutButtonText: {
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
const styles = StyleSheet.create({
  // ... (container, scrollContainer, logo, title, button, buttonText se mantienen iguales)
  container: {
    flex: 1,
    backgroundColor: NEU_COLOR, // Asegúrate de que el fondo del contenedor principal coincida con NEU_COLOR
  },
  scrollContainer: { 
    padding: 20,
    alignItems: 'center', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#922b21',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 40,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
// --- MODAL SPECIFIC STYLES ---
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns the content to the bottom
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    },
    modalView: {
        width: '100%',
        height: '93%', // Occupies 80% of the screen height
        backgroundColor: NEU_COLOR,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: 'center',
        // Neumorphism style for the modal itself
        shadowColor: "#000000b6",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#555',
        marginTop: 15,
        marginBottom: 8,
    },
    modalText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
});
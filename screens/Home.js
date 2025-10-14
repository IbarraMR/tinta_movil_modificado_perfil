import React ,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Modal, Pressable , Image} from 'react-native'; 
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PieChart } from "react-native-chart-kit";

// Get screen width for chart responsiveness
const screenWidth = Dimensions.get("window").width;

// Chart configuration object
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 2,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};
const MetaCard = ({ title, img, onPress }) => {
  return (
    <TouchableOpacity style={neumorphismStyles.cardContainer} onPress={onPress}>
      <Image source={img} style={neumorphismStyles.cardImage}/>
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
                    pointerEvents="box-none" 
                    //onPress={() => setShowAboutModal(false)} // Closes modal when tapping outside
                >
                    <View style={modalStyles.modalView}>
                        <KeyboardAwareScrollView contentContainerStyle={modalStyles.modalScrollViewContent}>
                            <Text style={modalStyles.modalTitle}>Sobre Nosotros</Text>

                            {/* --- SECCIÓN MISIÓN --- */}
                            <Text style={modalStyles.mainSectionTitle}>Nuestra Misión</Text>
                            <View style={modalStyles.card}>
                              {/* NOTA: Asegúrate de que la ruta de la imagen sea correcta */}
                              <Image
                                source={require('../assets/mision.jpeg')} 
                                style={modalStyles.cardImage}
                              />
                              <Text style={modalStyles.cardText}>
                                Ofrecer productos personalizados con calidad, rapidez y compromiso, ayudando a nuestros clientes a dar vida a sus ideas.
                              </Text>
                            </View>
        
                            {/* --- SECCIÓN VISIÓN --- */}
                            <Text style={modalStyles.mainSectionTitle}>Nuestra Visión</Text>
                            <View style={modalStyles.card}>
                              {/* NOTA: Asegúrate de que la ruta de la imagen sea correcta */}
                              <Image
                                source={require('../assets/vision.jpeg')} 
                                style={modalStyles.cardImage}
                              />
                              <Text style={modalStyles.cardText}>
                                Ser una imprenta referente en Salta por la calidad y creatividad, creciendo junto a la confianza de nuestros clientes.
                              </Text>
                            </View>
                            
                            {/* Espacio para que el contenido no quede pegado al borde */}
                            <View style={{ height: 30 }} /> 

                        </KeyboardAwareScrollView>
                        
                        {/* Botón Cerrar (Sticky al final) */}
                        <TouchableOpacity
                            style={[neumorphismStyles.aboutButton, modalStyles.closeButton]}
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
                    <View style={{
                      borderWidth: 2,
                      borderColor: '#333',
                      borderRadius: 16, // Ajusta según el tamaño del gráfico
                      padding: 0,
                      alignSelf: 'center',
                      justifyContent: 'center',
                              width: screenWidth - 40,
                              paddingRight:12,
                              height:220,
                              backgroundColor: NEU_COLOR,
                              borderRadius: 15,
                              marginTop: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              shadowColor: SHADOW_DARK, // Sombra inferior/derecha (oscura)
                              shadowOffset: { width: 4, height: 4 },
                              shadowOpacity: 1,
                              shadowRadius: 5,
                              
                              elevation: 16, 
                              borderColor: SHADOW_LIGHT, 
                              borderWidth: 1,

                    }}>
                      <PieChart
                        data={data}
                        width={screenWidth - 16}
                        height={180}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        center={[screenWidth / 20, 0]}
                        absolute
                      />
                    </View>
                </View>

                {/* CARDS */}
                <Text style={[styles.title, { marginTop: 30 }]}>Menú Principal</Text>
                <View style={neumorphismStyles.cardsWrapper}>
                    <MetaCard 
                        title="Insumos" 
                        img={require('../assets/Insumos.png')}
                        onPress={() => handleCardPress('Insumos')} // <-- NAVIGATION
                    />
                    <MetaCard 
                        title="Productos" 
                        img={require('../assets/producto.webp')}
                        onPress={() => handleCardPress('ProductosScreen')} // <-- NAVIGATION
                    />
                    <MetaCard 
                        title="Proveedores" 
                        img={require('../assets/proveedor.avif')}
                        onPress={() => handleCardPress('ProveedoresScreen')} // <-- NAVIGATION
                    />
                    <MetaCard 
                        title="Pedidos" 
                        img={require('../assets/pedido.avif')}
                        onPress={() => handleCardPress('VentasScreen')} // <-- NAVIGATION
                    />
                </View>

                {/* "SOBRE NOSOTROS" BUTTON */}
                <Text style={styles.title}>Sobre Nosotros</Text>

                            {/* --- SECCIÓN MISIÓN --- */}
                            <Text style={styles.subtitle}>Nuestra Misión</Text>
                            <View style={modalStyles.card}>
                              {/* NOTA: Asegúrate de que la ruta de la imagen sea correcta */}
                              <Image
                                source={require('../assets/mision.jpeg')} 
                                style={modalStyles.cardImage}
                              />
                              <Text style={modalStyles.cardText}>
                                Ofrecer productos personalizados con calidad, rapidez y compromiso, ayudando a nuestros clientes a dar vida a sus ideas.
                              </Text>
                            </View>
        
                            {/* --- SECCIÓN VISIÓN --- */}
                            <Text style={styles.subtitle}>Nuestra Visión</Text>
                            <View style={modalStyles.card}>
                              {/* NOTA: Asegúrate de que la ruta de la imagen sea correcta */}
                              <Image
                                source={require('../assets/vision.jpeg')} 
                                style={modalStyles.cardImage}
                              />
                              <Text style={modalStyles.cardText}>
                                Ser una imprenta referente en Salta por la calidad y creatividad, creciendo junto a la confianza de nuestros clientes.
                              </Text>
                            </View>

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
        height:170,
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
        padding: 10,
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000ff',
        paddingBottom: 15,
    },
    cardImage : {
        width: '100%',
        height: 136,
        borderRadius: 15,
        marginBottom: 10,
        resizeMode: 'cover',
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
  container: {
    flex: 1,
    backgroundColor: NEU_COLOR, 
    padding: 0,
  },
  scrollContainer: { 
    padding: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 0,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
    color: '#6e6e6eff',
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        width: '100%',
        height: '92%', 
        backgroundColor: NEU_COLOR,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalScrollViewContent: {
        paddingTop: 20,
        paddingBottom: 90,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000ff',
    },
    mainSectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000ff',
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'flex-start',
        width: '100%',
    },
    card: {
        width: '90%',
        backgroundColor: NEU_COLOR,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 0,
        shadowColor: SHADOW_DARK,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    cardImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    cardText: {
        padding: 15,
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
        textAlign: 'justify',
    },
    closeButton: {
        position: 'absolute',
        bottom: 30,
        width: '93%',
        zIndex: 10, 
    },
});

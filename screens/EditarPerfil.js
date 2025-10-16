// screens/EditarPerfil.js
import { auth, db } from '../src/config/firebaseConfig';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function EditarPerfil({ navigation }) {
  const user = auth.currentUser;

  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: user?.email || '',
    direccion: '',
    telefono: '',
    foto: user?.photoURL || null,
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  // Traer datos de Firestore y Auth
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          setUsuario(prev => ({
            ...prev,
            nombre: user.displayName ? user.displayName.split(' ')[0] : '',
            apellido: user.displayName ? user.displayName.split(' ')[1] || '' : ''
          }));

          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsuario(prev => ({
              ...prev,
              direccion: data.direccion || '',
              telefono: data.telefono || ''
            }));
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  const renderCampo = (label, value, key, editable = true, placeholder = '') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        editable={editable}
        onChangeText={(text) => {
          if (key === 'telefono') {
            text = text.replace(/[^0-9]/g, ''); // solo números
          }
          setUsuario({ ...usuario, [key]: text });
        }}
        secureTextEntry={key === 'password' && !showPassword}
        placeholderTextColor="#aaa"
      />
      {key === 'password' && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#555" />
        </TouchableOpacity>
      )}
    </View>
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUsuario({ ...usuario, foto: result.assets[0].uri });
    }
  };

  const handleAceptar = () => {
    Alert.alert(
      "Confirmar cambios",
      "¿Estás seguro de que quieres actualizar tu perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí", onPress: actualizarPerfil }
      ]
    );
  };

  const actualizarPerfil = async () => {
    try {
      if (user) {
        // Actualizar foto y displayName en Auth si cambió la foto
        await updateProfile(user, {
          photoURL: usuario.foto
        });

        // Guardar dirección y teléfono en Firestore
        const userRef = doc(db, 'usuarios', user.uid);
        await setDoc(userRef, {
          direccion: usuario.direccion,
          telefono: usuario.telefono
        }, { merge: true });

        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          {usuario.foto ? (
            <Image source={{ uri: usuario.foto }} style={styles.profileImage} />
          ) : (
            <View style={styles.iconContainer}>
              <FontAwesome name="user-circle" size={90} color="#999" />
              <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 12, color: '#555' }}>
                Tocar para agregar foto
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.username}>{usuario.nombre} {usuario.apellido}</Text>
        <Text style={styles.role}>Empleado</Text>
      </View>

      {/* Campos editables */}
      {renderCampo('Email', usuario.email, 'email', true, 'ejemplo@correo.com')}
      {renderCampo('Dirección', usuario.direccion, 'direccion', true, 'Ejemplo: Calle 123')}
      {renderCampo('Teléfono', usuario.telefono, 'telefono', true, 'Ejemplo: 123456789')}
      {renderCampo('Contraseña', usuario.password, 'password', true, '********')}

      <TouchableOpacity style={styles.acceptButton} onPress={handleAceptar}>
        <Text style={styles.acceptButtonText}>Aceptar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 40, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 25 },
  profileImage: { width: 110, height: 110, borderRadius: 55 },
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  username: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  role: { fontSize: 14, fontWeight: '400', color: '#555' },
  inputContainer: { width: '90%', marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, color: '#333', backgroundColor: '#f9f9f9', paddingRight: 40 },
  eyeIcon: { position: 'absolute', right: 12, top: 38 },
  acceptButton: { backgroundColor: '#000', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 25, width: '90%' },
  acceptButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

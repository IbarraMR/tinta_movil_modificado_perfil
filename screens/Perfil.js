import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Perfil({ navigation }) {
  const usuario = {
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    telefono: '',
    foto: null,
  };

  const renderCampo = (label, value, ejemplo) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value ? value : ejemplo}
        editable={false}
        placeholderTextColor="#aaa"
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {usuario.foto ? (
          <Image source={{ uri: usuario.foto }} style={styles.profileImage} />
        ) : (
          <View style={styles.iconContainer}>
            <FontAwesome name="user-circle" size={90} color="#999" />
          </View>
        )}
        <Text style={styles.nombreUsuario}>
          {usuario.nombre ? usuario.nombre : 'Nombre de usuario'}
        </Text>
        <Text style={styles.subtitulo}>Empleado</Text>
      </View>

      {renderCampo('Nombre', usuario.nombre, 'Rosario')}
      {renderCampo('Apellido', usuario.apellido, 'Ibarra')}
      {renderCampo('Email', usuario.email, 'roibarra9229@gmail.com')}
      {renderCampo('Dirección', usuario.direccion, 'Calle Falsa 123')}
      {renderCampo('Teléfono', usuario.telefono, '3876157160')}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditarPerfil')}
      >
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,          
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,     
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombreUsuario: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  editButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 25,
    width: '90%',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

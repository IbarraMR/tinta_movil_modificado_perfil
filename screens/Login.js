import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { useModal, useToast } from '../componentes/Alert';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { showModal } = useModal();
  const { show: showToast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      await showModal({
        type: "error",
        title: "Error",
        message: "Por favor ingrese ambos campos.",
        confirmText: "Cerrar"
      });
      showToast({ type: "error", text: "Campos incompletos" });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await showModal({
        type: "success",
        title: "Login exitoso",
        message: "Has iniciado sesión correctamente.",
        confirmText: "OK"
      });
      showToast({ type: "success", text: "Bienvenido" });
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      let errorMessage = "Hubo un problema al iniciar sesión.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/wrong-password':
          errorMessage = "La contraseña es incorrecta.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No se encontró un usuario con este correo.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
      }
      await showModal({
        type: "error",
        title: "Error",
        message: errorMessage,
        confirmText: "Cerrar"
      });
      showToast({ type: "error", text: "Error en login" });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >

      <Image source={require('../assets/logoTinta.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <Text style={styles.label}>Correo</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye-slash" : "eye"} style={styles.iconeye} size={20} color="#000000ff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>¿No tienes cuenta aún? Regístrate</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80,
    backgroundColor: '#fff',
    paddingTop:0,
  },
  logo: {
    width: 257,
    height: 257,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color:'#00010D',
    marginTop: 10,
    marginBottom : 10 ,
    marginLeft: 5 ,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#000000ff',
    marginBottom: 20,
    width: '100%',
    borderRadius: 8 ,
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
    color: '#00010d',
  },
  input: {
    flex: 1,
    height: 50,
  },
  iconeye: {
    marginRight: 10 ,
  },
  button: {
    backgroundColor: '#000000ff',
    paddingVertical: 13,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 80,
    marginBottom: 140,
    color: '#007AFF',
  },
});
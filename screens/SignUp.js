import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useModal, useToast } from '../componentes/Alert';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//Ultima version estable
export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [passwordInputFocused, setPasswordInputFocused] = useState(false);
  const [passwordsMatchMessage, setPasswordsMatchMessage] = useState('');
  const [passwordsMatchColor, setPasswordsMatchColor] = useState('gray');
  const { showModal } = useModal();
  const toast = useToast();

  const handleNameChange = (input) => {
    const filteredInput = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); //
    setFirstName(filteredInput);
  };
  const handleApellidoChange = (input) => {
    const filteredInput = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setLastName(filteredInput);
  };
  const handleConfirmPasswordChange = (text) => {
  setConfirmPassword(text);
  if (text === password && text !== '') {
    setPasswordsMatchMessage('Las contraseñas coinciden.');
    setPasswordsMatchColor('green');
  } else if (text !== '' && text.length > 0) {
    setPasswordsMatchMessage('Las contraseñas no coinciden.');
    setPasswordsMatchColor('red');
  } else {
    setPasswordsMatchMessage('');
    setPasswordsMatchColor('gray');
  }
};
const handlePasswordChange = (text) => {
  setPassword(text);
  setHasMinLength(text.length >= 6);
  setHasUppercase(/(?=.*[A-Z])/.test(text));
  setHasLowercase(/(?=.*[a-z])/.test(text));
  setHasNumber(/(?=.*\d)/.test(text));
};
  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.show({ type: "error", text: "Todos los campos son obligatorios" });
      return;
    }

    if (password !== confirmPassword) {
      await showModal({ type: 'error', title: 'Error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      await showModal({
        type: 'error',
        title: 'Error',
        message: 'La contraseña debe tener al menos 6 caracteres, incluyendo una letra mayúscula, una minúscula y un número.',
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await showModal({ type: 'success', title: 'Registro exitoso', message: 'Usuario registrado con éxito.' });
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está en uso.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          errorMessage = "La contraseña es demasiado débil.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
      }
      toast.show({ type: 'error', text: errorMessage });
    }
  };

  return (
    
    <KeyboardAwareScrollView
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      extraScrollHeight={Platform.OS === 'ios' ? 200 : 180} 
      enableOnAndroid={true}
      enableAutomaticScroll={true} 
      keyboardOpeningTime={0} 
    >

        <Image source={require('../assets/logoTinta.png')} style={styles.logo} />
        <Text style={styles.title}>Regístrate</Text>

      <Text style={styles.label}>Nombre</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          value={firstName}
          onChangeText={handleNameChange}
        />
      </View>

      <Text style={styles.label}>Apellido</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su apellido"
          value={lastName}
          onChangeText={handleApellidoChange}
        />
      </View>

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
          onChangeText={handlePasswordChange}
          onFocus={() => setPasswordInputFocused(true)}
          onBlur={() => setPasswordInputFocused(false)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye-slash" : "eye"} style={styles.iconeye} size={20} color="#000000ff" />
        </TouchableOpacity>
      </View>
      {passwordInputFocused && (
        <View style={styles.passwordChecklistContainer}>
          <Text style={styles.passwordChecklistTitle}>La contraseña debe estar compuesta por:</Text>
          <Text style={[styles.passwordChecklistItem, { color: hasMinLength ? 'green' : 'red' }]}>
            <FontAwesome name={hasMinLength ? "check-circle" : "times-circle"} size={14} /> +6 caracteres
          </Text>
          <Text style={[styles.passwordChecklistItem, { color: hasUppercase ? 'green' : 'red' }]}>
            <FontAwesome name={hasUppercase ? "check-circle" : "times-circle"} size={14} /> 1 Mayúscula
          </Text>
          <Text style={[styles.passwordChecklistItem, { color: hasLowercase ? 'green' : 'red' }]}>
            <FontAwesome name={hasLowercase ? "check-circle" : "times-circle"} size={14} /> 1 Minúscula
          </Text>
          <Text style={[styles.passwordChecklistItem, { color: hasNumber ? 'green' : 'red' }]}>
            <FontAwesome name={hasNumber ? "check-circle" : "times-circle"} size={14} /> 1 Número
          </Text>
        </View>
      )}

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirme su contraseña"
          value={confirmPassword}
          
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry={!showConfirmPassword}

        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} style={styles.iconeye} size={20} color="#000000ff" />
        </TouchableOpacity>
      </View>
        <Text style={[styles.passwordMatchMessage, { color: passwordsMatchColor }]}>{passwordsMatchMessage}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signUpText}>¿Ya tenés cuenta? <Text style={styles.iniciarS}>Inicia sesión</Text></Text>
      </TouchableOpacity>
      </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 0 : -20,
  },
    scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    paddingTop: 0,
  },
  logo: {
    width: 256,
    height: 256,
    marginBottom: 0,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
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
    marginBottom: 10,
    width: '100%',
    borderRadius: 8 ,
  },
  passwordChecklistContainer: {
    alignSelf: 'flex-start',
    marginTop: 0,
    marginLeft: 5,
  },
  passwordChecklistTitle: {
    fontSize: 12,
    marginBottom: 5,
    color:'#333333ff'
  },
  passwordChecklistItem: {
    fontSize: 10,
    marginBottom: 0,
  },
  passwordMatchMessage: {
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },

  icon: {
    marginRight: 10,
    marginLeft: 10,
    color: '#00010d',
  },
  iconeye:{
    marginRight: 10 ,
  },
  input: {
    flex: 1,
    height: 50,
  },
  button: {
    backgroundColor: '#000000ff',
    paddingVertical: 13,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    color: '#007AFF',
    marginBottom: 60,
  },
  iniciarS:{
    fontWeight: 'bold',
  },
});

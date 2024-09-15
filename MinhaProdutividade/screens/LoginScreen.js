import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Função de login
    console.log('Login efetuado:', email);
    navigation.navigate('Activity');
  };

  const handleAdminLogin = () => {
    // Navegar para a tela de login do administrador
    navigation.navigate('AdminLogin');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}  // Caminho atualizado para o logo.png
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bem-vindo!</Text>

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text>Senha:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
        style={styles.input}
      />

      <Button title="Entrar" onPress={handleLogin} />

      <Text style={styles.registerText}>
        Não tem uma conta? <Text onPress={() => navigation.navigate('Register')} style={styles.registerLink}>Registre-se</Text>
      </Text>

      <TouchableOpacity onPress={handleAdminLogin} style={styles.adminButton}>
        <Text style={styles.adminButtonText}>Administração</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Centraliza verticalmente
    alignItems: 'center',  // Centraliza horizontalmente
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 200,  // Largura do logo
    height: 200,  // Altura do logo
    marginBottom: 20,  // Espaçamento entre o logo e o título
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 5,
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
  },
  registerLink: {
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  adminButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function AdminLogin({ navigation }) {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = () => {
    // Verifique as credenciais do administrador
    if (adminEmail === 'admin@empresa.com' && adminPassword === 'admin') {
      // Redireciona para a tela de opções do administrador
      navigation.navigate('AdminOptionsScreen');
    } else {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área de Administração</Text>

      <Text>Email de Administrador:</Text>
      <TextInput
        value={adminEmail}
        onChangeText={setAdminEmail}
        placeholder="Digite seu email"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text>Senha:</Text>
      <TextInput
        value={adminPassword}
        onChangeText={setAdminPassword}
        placeholder="Digite sua senha"
        secureTextEntry
        style={styles.input}
      />

      <Button title="Entrar" onPress={handleAdminLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
});

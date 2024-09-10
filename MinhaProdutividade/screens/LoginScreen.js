import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';  // Certifique-se de que o Firebase está corretamente configurado

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate('Activity');  // Redireciona para a tela de atividades após o login
      })
      .catch((error) => {
        Alert.alert('Erro ao fazer login', error.message);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Text>Senha:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Entrar" onPress={handleLogin} />

      <Button
        title="Registrar-se"
        onPress={() => navigation.navigate('Register')}
        style={{ marginTop: 10 }}
      />

      <Button
        title="Administração"
        onPress={() => navigation.navigate('AdminLogin')}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = () => {
    if (email === 'admin' && password === 'admin') {
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Erro', 'Credenciais de administrador incorretas.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email (admin):</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Text>Senha (admin):</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Login como Administrador" onPress={handleAdminLogin} />
    </View>
  );
}

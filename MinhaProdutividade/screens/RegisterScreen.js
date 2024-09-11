import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sector, setSector] = useState('Área técnica');  // Setor selecionado pelo usuário

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar o nome e o setor do funcionário no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        userId: user.uid,
        sector: sector,  // Armazena o setor selecionado
      });

      Alert.alert('Sucesso', 'Registro realizado com sucesso!');
      navigation.navigate('Login');  // Voltar para a tela de login
    } catch (error) {
      Alert.alert('Erro ao registrar', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      {/* Picker para escolher o setor */}
      <Text>Setor:</Text>
      <Picker
        selectedValue={sector}
        onValueChange={(itemValue) => setSector(itemValue)}
      >
        <Picker.Item label="Área técnica" value="Área técnica" />
        <Picker.Item label="Marketing" value="Marketing" />
        <Picker.Item label="Financeiro" value="Financeiro" />
      </Picker>

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Text>Senha:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Text>Confirmar Senha:</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

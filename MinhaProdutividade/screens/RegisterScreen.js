import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Importar do pacote correto
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sector, setSector] = useState('');
  const [sectors, setSectors] = useState([]);

  // Buscar setores dinâmicos do Firestore
  const fetchSectors = async () => {
    const querySnapshot = await getDocs(collection(db, 'sectors'));
    const fetchedSectors = querySnapshot.docs.map(doc => doc.data().name);
    setSectors(fetchedSectors);
    setSector(fetchedSectors[0] || '');  // Define o primeiro setor como padrão
  };

  useEffect(() => {
    fetchSectors();  // Carregar os setores ao montar o componente
  }, []);

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
    <View style={styles.container}>
      <Text>Nome:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Digite seu nome"
      />

      <Text>Setor:</Text>
      <Picker
        selectedValue={sector}
        onValueChange={(itemValue) => setSector(itemValue)}
        style={styles.picker}
      >
        {sectors.map((sector) => (
          <Picker.Item key={sector} label={sector} value={sector} />
        ))}
      </Picker>

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Digite seu email"
        keyboardType="email-address"
      />

      <Text>Senha:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <Text>Confirmar Senha:</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        placeholder="Confirme sua senha"
        secureTextEntry
      />

      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    marginBottom: 15,
  },
});

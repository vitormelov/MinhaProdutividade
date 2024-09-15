import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';  // Certifique-se de importar o Firestore corretamente

export default function SectorCreationScreen() {
  const [newSector, setNewSector] = useState('');
  const [sectors, setSectors] = useState([]);

  // Função para buscar os setores já criados no Firestore
  const fetchSectors = async () => {
    const querySnapshot = await getDocs(collection(db, 'sectors'));
    const fetchedSectors = querySnapshot.docs.map(doc => doc.data().name);
    setSectors(fetchedSectors);
  };

  useEffect(() => {
    fetchSectors();  // Carregar os setores existentes ao abrir a tela
  }, []);

  // Função para criar um novo setor
  const handleCreateSector = async () => {
    if (newSector.trim() === '') {
      Alert.alert('Erro', 'O nome do setor não pode estar vazio.');
      return;
    }

    try {
      await addDoc(collection(db, 'sectors'), { name: newSector.trim() });
      Alert.alert('Sucesso', 'Setor criado com sucesso!');
      setNewSector('');  // Limpar o campo de texto
      fetchSectors();  // Atualizar a lista de setores
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o setor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Setor</Text>

      <TextInput
        value={newSector}
        onChangeText={setNewSector}
        placeholder="Nome do setor"
        style={styles.input}
      />

      <Button title="Criar Setor" onPress={handleCreateSector} />

      <Text style={styles.subtitle}>Setores existentes:</Text>
      <FlatList
        data={sectors}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.sectorItem}>{item}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  sectorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Atualiza a importação para o novo pacote
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function ActivitiesCreationScreen() {
  const [sector, setSector] = useState('');
  const [sectors, setSectors] = useState([]);
  const [activityName, setActivityName] = useState('');
  const [activities, setActivities] = useState([]);

  // Função para buscar setores criados no Firestore
  const fetchSectors = async () => {
    const querySnapshot = await getDocs(collection(db, 'sectors'));
    const fetchedSectors = querySnapshot.docs.map(doc => doc.data().name);
    setSectors(fetchedSectors);
    setSector(fetchedSectors[0] || '');  // Define o primeiro setor como padrão
  };

  // Função para buscar atividades já criadas para o setor selecionado
  const fetchActivities = async () => {
    if (!sector) return;
    
    const q = query(collection(db, 'activities'), where('sector', '==', sector));
    const querySnapshot = await getDocs(q);
    const fetchedActivities = querySnapshot.docs.map(doc => doc.data().name);
    setActivities(fetchedActivities);
  };

  // Carregar setores ao montar o componente
  useEffect(() => {
    fetchSectors();
  }, []);

  // Atualizar atividades ao mudar o setor
  useEffect(() => {
    if (sector) {
      fetchActivities();
    }
  }, [sector]);

  // Função para adicionar uma nova atividade ao setor
  const handleAddActivity = async () => {
    if (!activityName.trim()) {
      Alert.alert('Erro', 'O nome da atividade não pode estar vazio.');
      return;
    }

    try {
      await addDoc(collection(db, 'activities'), {
        name: activityName.trim(),
        sector: sector
      });
      Alert.alert('Sucesso', 'Atividade adicionada com sucesso!');
      setActivityName('');  // Limpar o campo de texto
      fetchActivities();  // Atualizar a lista de atividades
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a atividade.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Atividades por Setor</Text>

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

      <Text>Nome da Atividade:</Text>
      <TextInput
        value={activityName}
        onChangeText={setActivityName}
        placeholder="Digite o nome da atividade"
        style={styles.input}
      />

      <Button title="Adicionar Atividade" onPress={handleAddActivity} />

      <Text style={styles.subtitle}>Atividades do setor {sector}:</Text>
      {activities.map((activity, index) => (
        <Text key={index} style={styles.activityItem}>{activity}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  activityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

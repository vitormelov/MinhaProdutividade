import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';  // Certifique-se de que o Firestore está configurado corretamente
import { Picker } from '@react-native-picker/picker';  // Certifique-se de usar este Picker

export default function ActivityScreen({ navigation }) {
  const [activity, setActivity] = useState('Realização de orçamento');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:30');

  const handleSaveActivity = async () => {
    if (startTime >= endTime) {
      Alert.alert('Erro', 'O horário de término deve ser maior que o horário de início.');
      return;
    }

    const currentTime = new Date().toLocaleString();

    try {
      console.log("Tentando salvar atividade..."); // Log para ver quando tenta salvar
      await addDoc(collection(db, 'activities'), {
        activity,
        description,
        startTime,
        endTime,
        savedAt: currentTime,
      });
      console.log("Atividade salva com sucesso!"); // Log de sucesso
      Alert.alert('Sucesso', 'Atividade registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar atividade:', error); // Log detalhado do erro
      Alert.alert('Erro', `Erro ao salvar atividade: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Atividade realizada:</Text>
      <Picker
        selectedValue={activity}
        onValueChange={(itemValue) => setActivity(itemValue)}
      >
        <Picker.Item label="Realização de orçamento" value="Realização de orçamento" />
        <Picker.Item label="Visita a obra" value="Visita a obra" />
        <Picker.Item label="Reunião" value="Reunião" />
      </Picker>

      <Text>Descrição:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Text>Início da Atividade:</Text>
      <Picker
        selectedValue={startTime}
        onValueChange={(itemValue) => setStartTime(itemValue)}
      >
        {generateTimeOptions()}
      </Picker>

      <Text>Término da Atividade:</Text>
      <Picker
        selectedValue={endTime}
        onValueChange={(itemValue) => setEndTime(itemValue)}
      >
        {generateTimeOptions()}
      </Picker>

      <Button title="Salvar Atividade" onPress={handleSaveActivity} />
      <Button title="Visualizar Atividades" onPress={() => navigation.navigate('ViewActivities')} />
    </ScrollView>
  );
}

// Função para gerar opções de horário de 30 em 30 minutos
const generateTimeOptions = () => {
  const times = [];
  for (let i = 8; i <= 18; i++) {
    times.push(<Picker.Item key={`${i}:00`} label={`${i}:00`} value={`${i}:00`} />);
    times.push(<Picker.Item key={`${i}:30`} label={`${i}:30`} value={`${i}:30`} />);
  }
  return times;
};

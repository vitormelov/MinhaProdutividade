import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';  // Importa o componente DateTimePicker
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';  // Certifique-se de que está configurado corretamente
import { Picker } from '@react-native-picker/picker';  // Importa o Picker para os horários

export default function ActivityScreen({ navigation }) {
  const [activity, setActivity] = useState('Realização de orçamento');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:30');
  const [date, setDate] = useState(new Date());  // Estado para armazenar a data
  const [showDatePicker, setShowDatePicker] = useState(false);  // Controle do DatePicker para mostrar/esconder

  // Função para converter string de horário para objeto Date
  const convertTimeToDate = (time) => {
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return newDate;
  };

  const handleSaveActivity = async () => {
    const startDateTime = convertTimeToDate(startTime);
    const endDateTime = convertTimeToDate(endTime);

    if (endDateTime <= startDateTime) {
      Alert.alert('Erro', 'O horário de término deve ser maior que o horário de início.');
      return;
    }

    const user = auth.currentUser;

    try {
      await addDoc(collection(db, 'activities'), {
        userId: user.uid,
        activity,
        description,
        startTime: startDateTime.toString(),   // Salvando o horário de início como string
        endTime: endDateTime.toString(),       // Salvando o horário de término como string
        savedAt: new Date().toString(),        // Salvando a data/hora atual como string
        date: date.toLocaleDateString(),       // Salvando a data da atividade
      });
      Alert.alert('Sucesso', 'Atividade registrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao salvar atividade', error.message);
    }
  };

  // Função para lidar com a mudança da data no DatePicker
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);  // Esconder o DatePicker após selecionar
    setDate(currentDate);  // Define a nova data
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Data da Atividade:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}>
          {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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

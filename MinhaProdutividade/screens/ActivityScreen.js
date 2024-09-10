import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Picker } from '@react-native-picker/picker';

export default function ActivityScreen({ navigation }) {
  const [activity, setActivity] = useState('Elaboração de orçamento');  // Definimos um valor inicial
  const [description, setDescription] = useState('');  // A descrição será sempre obrigatória
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:15');
  const [date, setDate] = useState(new Date());  
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        activity: activity === 'Outros' ? `Outros ${description}` : activity,  // Se for "Outros", concatenar com a descrição
        description,  // Sempre salvar a descrição
        startTime: startDateTime.toString(),
        endTime: endDateTime.toString(),
        savedAt: new Date().toString(),
        date: date.toLocaleDateString(),
      });
      Alert.alert('Sucesso', 'Atividade registrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao salvar atividade', error.message);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
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
        <Picker.Item label="Elaboração de orçamento" value="Elaboração de orçamento" />
        <Picker.Item label="Elaboração de cronograma" value="Elaboração de cronograma" />
        <Picker.Item label="Elaboração de projetos" value="Elaboração de projetos" />
        <Picker.Item label="Elaboração de relatório semanal" value="Elaboração de relatório semanal" />
        <Picker.Item label="Elaboração de RMR" value="Elaboração de RMR" />
        <Picker.Item label="Implantação de saldo no sistema" value="Implantação de saldo no sistema" />
        <Picker.Item label="Reunião" value="Reunião" />
        <Picker.Item label="Solicitação de insumo no sistema" value="Solicitação de insumo no sistema" />
        <Picker.Item label="Visita em obra" value="Visita em obra" />
        <Picker.Item label="Outros" value="Outros" />
      </Picker>

      <Text>Descrição da Atividade:</Text>
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

// Função para gerar opções de horário de 15 em 15 minutos
const generateTimeOptions = () => {
  const times = [];
  for (let i = 8; i <= 18; i++) {
    times.push(<Picker.Item key={`${i}:00`} label={`${i}:00`} value={`${i}:00`} />);
    times.push(<Picker.Item key={`${i}:15`} label={`${i}:15`} value={`${i}:15`} />);
    times.push(<Picker.Item key={`${i}:30`} label={`${i}:30`} value={`${i}:30`} />);
    times.push(<Picker.Item key={`${i}:45`} label={`${i}:45`} value={`${i}:45`} />);
  }
  return times;
};

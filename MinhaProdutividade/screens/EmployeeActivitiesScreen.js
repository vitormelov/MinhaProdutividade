import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EmployeeActivitiesScreen({ route }) {
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { userId } = route.params || {};  // Recebe o `userId` como parâmetro

  // Função para buscar as atividades do funcionário por data
  const fetchActivities = async (date) => {
    try {
      if (!userId) {
        Alert.alert('Erro', 'ID do funcionário não encontrado.');
        return;
      }

      const formattedDate = date.toLocaleDateString();
      const q = query(collection(db, 'user_activities'), where('userId', '==', userId), where('date', '==', formattedDate));
      const querySnapshot = await getDocs(q);
      const fetchedActivities = querySnapshot.docs.map(doc => doc.data());
      setActivities(fetchedActivities);
    } catch (error) {
      Alert.alert('Erro ao buscar atividades', error.message);
    }
  };

  useEffect(() => {
    fetchActivities(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  // Função para formatar o horário (HH:MM)
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Função para calcular a duração (em horas e minutos) entre início e término
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor((diffMs / 1000) / 60);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}>
          {selectedDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <FlatList
        data={activities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>Atividade: {item.activity}</Text>  
            <Text>Descrição: {item.description}</Text>  
            <Text>Início: {formatTime(item.startTime)}</Text>  
            <Text>Término: {formatTime(item.endTime)}</Text>  
            <Text>Duração: {calculateDuration(item.startTime, item.endTime)}</Text>
            <Text>Registrado em: {new Date(item.savedAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

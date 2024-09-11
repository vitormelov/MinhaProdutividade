import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import DateTimePicker from '@react-native-community/datetimepicker';  // Importar o DateTimePicker

export default function EmployeeActivitiesScreen({ route }) {
  const { userId } = route.params;
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());  // Estado para a data selecionada
  const [showDatePicker, setShowDatePicker] = useState(false);  // Estado para controlar a exibição do DatePicker

  useEffect(() => {
    const fetchActivities = async () => {
      const formattedDate = selectedDate.toLocaleDateString();  // Formatar a data selecionada
      const q = query(
        collection(db, 'activities'),
        where('userId', '==', userId),
        where('date', '==', formattedDate)  // Filtrar pela data selecionada
      );
      const querySnapshot = await getDocs(q);
      const fetchedActivities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(fetchedActivities);
    };

    fetchActivities();
  }, [selectedDate]);  // Refetch as atividades quando a data selecionada mudar

  // Função para formatar a hora
  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Função para calcular a duração entre o horário de início e término
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationInMinutes = (endDate - startDate) / 1000 / 60;  // Duração em minutos

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours > 0 ? `${hours}h` : ''} ${minutes}min`.trim();  // Formato: "xh y min"
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Selecione a Data:</Text>

      {/* Botão para mostrar o DatePicker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}>
          {selectedDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* DatePicker para selecionar a data */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);  // Atualiza a data selecionada
            }
          }}
        />
      )}

      <Text style={{ fontSize: 18, marginBottom: 10 }}>Atividades para {selectedDate.toLocaleDateString()}:</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}>
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

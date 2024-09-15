import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Picker } from '@react-native-picker/picker';

export default function ActivityScreen({ navigation }) {
  const [activity, setActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:15');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sector, setSector] = useState('');

  // Função para converter string de horário para objeto Date
  const convertTimeToDate = (time) => {
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return newDate;
  };

  // Função para buscar atividades associadas ao setor do usuário
  const fetchActivitiesForSector = async (userSector) => {
    try {
      const activitiesQuery = query(collection(db, 'activities'), where('sector', '==', userSector));
      const querySnapshot = await getDocs(activitiesQuery);
      const fetchedActivities = querySnapshot.docs.map(doc => doc.data().name);
      setActivities(fetchedActivities);
      setActivity(fetchedActivities[0] || ''); // Define a primeira atividade como padrão
    } catch (error) {
      Alert.alert('Erro ao buscar atividades', error.message);
    }
  };

  // Verificar autenticação e buscar setor e atividades ao carregar a tela
  useEffect(() => {
    const fetchUserSectorAndActivities = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Usuário não autenticado', 'Por favor, faça o login novamente.');
          navigation.navigate('Login');  // Redireciona o usuário para a tela de login
          return;
        }

        // Supondo que o setor do usuário esteja salvo na coleção 'users'
        const userSnapshot = await getDocs(query(collection(db, 'users'), where('userId', '==', user.uid)));
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const userSector = userData.sector;

          setSector(userSector);
          fetchActivitiesForSector(userSector);  // Busca atividades para o setor do usuário
        } else {
          Alert.alert('Erro', 'Setor do usuário não encontrado.');
        }
      } catch (error) {
        Alert.alert('Erro ao buscar dados do usuário', error.message);
      }
    };

    fetchUserSectorAndActivities();
  }, [navigation]);

  const handleSaveActivity = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
      navigation.navigate('Login');  // Redireciona o usuário para a tela de login
      return;
    }

    const startDateTime = convertTimeToDate(startTime);
    const endDateTime = convertTimeToDate(endTime);

    if (endDateTime <= startDateTime) {
      Alert.alert('Erro', 'O horário de término deve ser maior que o horário de início.');
      return;
    }

    try {
      await addDoc(collection(db, 'user_activities'), {
        userId: user.uid,
        activity: activity === 'Outros' ? `Outros ${description}` : activity,
        description,
        startTime: startDateTime.toString(),
        endTime: endDateTime.toString(),
        savedAt: new Date().toString(),
        date: date.toLocaleDateString(),
        sector: sector,  // Salvar o setor do usuário
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
        {activities.map((activityName) => (
          <Picker.Item key={activityName} label={activityName} value={activityName} />
        ))}
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

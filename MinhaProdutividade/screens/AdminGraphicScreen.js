import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDocs, query, collection, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Certifique-se de que o firebase está configurado corretamente
import DateTimePicker from '@react-native-community/datetimepicker';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function AdminGraphicScreen() {
  const [sectors, setSectors] = useState([]);  // Setores disponíveis
  const [sector, setSector] = useState('');
  const [activities, setActivities] = useState([]);  // Atividades disponíveis
  const [activity, setActivity] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);  // Dados dos funcionários para o gráfico
  const screenWidth = Dimensions.get('window').width;

  // Função para buscar setores
  const fetchSectors = async () => {
    const querySnapshot = await getDocs(collection(db, 'sectors'));
    const fetchedSectors = querySnapshot.docs.map(doc => doc.data().name);
    setSectors(fetchedSectors);
    setSector(fetchedSectors[0]);  // Define o primeiro setor como selecionado
  };

  // Função para buscar atividades do setor
  const fetchActivitiesForSector = async (sector) => {
    const querySnapshot = await getDocs(query(collection(db, 'activities'), where('sector', '==', sector)));
    const fetchedActivities = querySnapshot.docs.map(doc => doc.data().name);
    setActivities(fetchedActivities);
    setActivity(fetchedActivities[0]);  // Define a primeira atividade como selecionada
  };

  useEffect(() => {
    fetchSectors();  // Buscar setores ao carregar a tela
  }, []);

  useEffect(() => {
    if (sector) {
      fetchActivitiesForSector(sector);  // Buscar atividades quando o setor é selecionado
    }
  }, [sector]);

  // Função para buscar e calcular as horas de trabalho por funcionário para a atividade selecionada
  const fetchEmployeeData = async () => {
    try {
      const formattedStartDate = selectedStartDate.toLocaleDateString();
      const formattedEndDate = selectedEndDate.toLocaleDateString();

      const q = query(
        collection(db, 'user_activities'),
        where('sector', '==', sector),
        where('activity', '==', activity),
        where('date', '>=', formattedStartDate),
        where('date', '<=', formattedEndDate)
      );

      const querySnapshot = await getDocs(q);
      const employeeActivities = {};

      // Coletar as atividades e calcular as horas
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        const userId = data.userId;
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        const durationMs = end - start;
        const durationHours = durationMs / 1000 / 60 / 60;

        // Se o funcionário já tem atividades registradas, acumula a duração
        if (employeeActivities[userId]) {
          employeeActivities[userId].totalHours += durationHours;
        } else {
          // Inicializa as horas e busca o nome do funcionário
          const userDoc = await getDoc(doc(db, 'users', userId));
          const userName = userDoc.exists() ? userDoc.data().name : 'Usuário Desconhecido';
          
          employeeActivities[userId] = {
            userId,
            totalHours: durationHours,
            name: userName
          };
        }
      }

      const employeeArray = Object.keys(employeeActivities).map((userId) => ({
        userId,
        name: employeeActivities[userId].name,
        totalHours: employeeActivities[userId].totalHours
      }));

      setEmployeeData(employeeArray);
    } catch (error) {
      Alert.alert('Erro ao buscar atividades', error.message);
    }
  };

  const handleGenerateGraph = () => {
    fetchEmployeeData();  // Busca os dados quando o botão "Gerar Gráfico" for pressionado
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setSelectedStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setSelectedEndDate(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Selecionar Setor:</Text>
      <Picker
        selectedValue={sector}
        onValueChange={(itemValue) => setSector(itemValue)}
      >
        {sectors.map((sectorName) => (
          <Picker.Item key={sectorName} label={sectorName} value={sectorName} />
        ))}
      </Picker>

      <Text>Selecionar Atividade:</Text>
      <Picker
        selectedValue={activity}
        onValueChange={(itemValue) => setActivity(itemValue)}
      >
        {activities.map((activityName) => (
          <Picker.Item key={activityName} label={activityName} value={activityName} />
        ))}
      </Picker>

      <Text>Selecionar Data Inicial:</Text>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text style={{ borderWidth: 1, padding: 10 }}>{selectedStartDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={selectedStartDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      <Text>Selecionar Data Final:</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Text style={{ borderWidth: 1, padding: 10 }}>{selectedEndDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={selectedEndDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <Button title="Gerar Gráfico" onPress={handleGenerateGraph} />

      {employeeData.length > 0 && (
        <BarChart
          data={{
            labels: employeeData.map((item) => item.name),  // Usar o nome em vez de userId
            datasets: [
              {
                data: employeeData.map((item) => item.totalHours),
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          xAxisLabel="h"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // Definir casas decimais
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 20,
            borderRadius: 16,
          }}
        />
      )}
    </ScrollView>
  );
}

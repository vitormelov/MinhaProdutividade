import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDocs, query, collection, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Certifique-se de que o firebase está configurado corretamente
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdminGraphicScreen() {
  const [sectors, setSectors] = useState([]);  // Setores disponíveis
  const [sector, setSector] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);  // Dados dos funcionários para exibição

  // Função para buscar setores
  const fetchSectors = async () => {
    const querySnapshot = await getDocs(collection(db, 'sectors'));
    const fetchedSectors = querySnapshot.docs.map(doc => doc.data().name);
    setSectors(fetchedSectors);
    setSector(fetchedSectors[0]);  // Define o primeiro setor como selecionado
  };

  useEffect(() => {
    fetchSectors();  // Buscar setores ao carregar a tela
  }, []);

  // Função para converter horas decimais em horas e minutos
  const formatHoursAndMinutes = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  // Função para buscar e calcular as horas de trabalho por atividade e por funcionário para o setor selecionado
  const fetchEmployeeData = async () => {
    try {
      const user = auth.currentUser; // Verifique o usuário autenticado
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      const formattedStartDate = selectedStartDate.toLocaleDateString();
      const formattedEndDate = selectedEndDate.toLocaleDateString();

      const q = query(
        collection(db, 'user_activities'),
        where('sector', '==', sector),
        where('date', '>=', formattedStartDate),
        where('date', '<=', formattedEndDate)
      );

      const querySnapshot = await getDocs(q);
      const employeeActivities = {};

      // Coletar as atividades e calcular as horas
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        const userId = data.userId; // Garantir que o userId correto é usado
        const activity = data.activity;
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        const durationMs = end - start;
        const durationHours = durationMs / 1000 / 60 / 60;

        // Se o funcionário e a atividade já têm horas registradas, acumula a duração
        if (employeeActivities[userId]) {
          if (employeeActivities[userId][activity]) {
            employeeActivities[userId][activity].totalHours += durationHours;
          } else {
            employeeActivities[userId][activity] = {
              totalHours: durationHours,
              name: ''
            };
          }
        } else {
          // Inicializa o objeto do funcionário e da atividade
          const userDoc = await getDoc(doc(db, 'users', userId));
          const userName = userDoc.exists() ? userDoc.data().name : 'Usuário Desconhecido';

          employeeActivities[userId] = {
            [activity]: {
              totalHours: durationHours,
              name: userName
            }
          };
        }
      }

      const employeeArray = Object.keys(employeeActivities).map((userId) => {
        const activities = Object.keys(employeeActivities[userId] || {}).map((activity) => ({
          activity,
          name: employeeActivities[userId][activity]?.name || 'Desconhecido',
          totalHours: employeeActivities[userId][activity]?.totalHours || 0
        }));

        return { userId, activities };
      });

      setEmployeeData(employeeArray);
    } catch (error) {
      Alert.alert('Erro ao buscar atividades', error.message);
    }
  };

  const handleGenerateReport = () => {
    fetchEmployeeData();  // Busca os dados quando o botão "Gerar Relatório" for pressionado
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

      <Button title="Gerar Relatório" onPress={handleGenerateReport} />

      {employeeData.length > 0 && (
        <View>
          {employeeData.map((employee) => (
            <View key={employee.userId} style={{ marginVertical: 10 }}>
              <Text>Funcionário: {employee.activities[0]?.name || 'Desconhecido'}</Text>
              {employee.activities.map((activityData) => (
                <View key={activityData.activity} style={{ marginLeft: 10 }}>
                  <Text>Atividade: {activityData.activity}</Text>
                  <Text>Total de Horas: {formatHoursAndMinutes(activityData.totalHours)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

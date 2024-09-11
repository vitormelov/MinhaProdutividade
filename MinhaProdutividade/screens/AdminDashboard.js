import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminDashboard({ navigation }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedEmployees = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(fetchedEmployees);
    };

    fetchEmployees();
  }, []);

  // Função para organizar os funcionários por setor
  const renderSector = (sector) => {
    const sectorEmployees = employees.filter((employee) => employee.sector === sector);

    return (
      <View>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>{sector}:</Text>
        <FlatList
          data={sectorEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('EmployeeActivities', { userId: item.userId })}>
              <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}>
                <Text>Nome: {item.name}</Text>
                <Text>Email: {item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={{ padding: 20 }}>
      {renderSector('Área técnica')}
      {renderSector('Marketing')}
      {renderSector('Financeiro')}
    </View>
  );
}

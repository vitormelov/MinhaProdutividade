import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function EmployeeActivitiesScreen({ route }) {
  const { userId } = route.params;
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const q = query(collection(db, 'activities'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedActivities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(fetchedActivities);
    };

    fetchActivities();
  }, [userId]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Atividades do Funcionário:</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text>Atividade: {item.activity}</Text>
            <Text>Descrição: {item.description}</Text>
            <Text>Início: {item.startTime}</Text>
            <Text>Término: {item.endTime}</Text>
            <Text>Registrado em: {item.savedAt}</Text>
          </View>
        )}
      />
    </View>
  );
}

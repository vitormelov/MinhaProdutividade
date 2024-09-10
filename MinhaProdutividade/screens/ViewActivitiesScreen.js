import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function ViewActivitiesScreen({ navigation }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Função para buscar as atividades do usuário logado
    const fetchActivities = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'activities'),
          where('userId', '==', user.uid)  // Buscar atividades apenas do usuário logado
        );
        const querySnapshot = await getDocs(q);
        const fetchedActivities = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(fetchedActivities);
      }
    };

    fetchActivities();
  }, []);

  // Função para formatar a data e hora, apenas exibindo a hora para início e término
  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Minhas Atividades:</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text>Atividade: {item.activity}</Text>  
            <Text>Descrição: {item.description}</Text>  
            <Text>Data da Atividade: {item.date}</Text> 
            <Text>Início: {formatTime(item.startTime)}</Text>  
            <Text>Término: {formatTime(item.endTime)}</Text>  
            <Text>Registrado em: {new Date(item.savedAt).toLocaleString()}</Text>  
          </View>
        )}
      />
    </View>
  );
}

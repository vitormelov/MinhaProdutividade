import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';  // Certifique-se de que o Firestore está configurado corretamente

export default function ViewActivitiesScreen({ navigation }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Função para buscar todas as atividades do Firestore
    const fetchActivities = async () => {
      const querySnapshot = await getDocs(collection(db, 'activities'));
      const fetchedActivities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(fetchedActivities);
    };

    fetchActivities();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Atividades Registradas:</Text>
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
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
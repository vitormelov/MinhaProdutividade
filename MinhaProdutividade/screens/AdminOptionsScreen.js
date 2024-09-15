import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AdminOptionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opções de Administração</Text>

      <Button
        title="Ir para o Dashboard"
        onPress={() => navigation.navigate('AdminDashboard')}
      />

      <Button
        title="Criar Setores"
        onPress={() => navigation.navigate('SectorCreationScreen')}
        style={styles.button}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

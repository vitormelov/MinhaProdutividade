import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AdminOptionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opções de Administração</Text>

      {/* Opção para ir ao AdminDashboard */}
      <Button
        title="Ir para o Dashboard"
        onPress={() => navigation.navigate('AdminDashboard')}
      />

      {/* Outras opções podem ser adicionadas aqui futuramente */}
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
});

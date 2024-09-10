import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';  // Importando as telas corretamente
import RegisterScreen from './screens/RegisterScreen';
import ActivityScreen from './screens/ActivityScreen';
import ViewActivitiesScreen from './screens/ViewActivitiesScreen';  // Nova tela de visualizar atividades

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Cada rota deve ser declarada usando Stack.Screen */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="ViewActivities" component={ViewActivitiesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
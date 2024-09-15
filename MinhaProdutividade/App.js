import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';  
import RegisterScreen from './screens/RegisterScreen';
import ActivityScreen from './screens/ActivityScreen';
import ViewActivitiesScreen from './screens/ViewActivitiesScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import EmployeeActivitiesScreen from './screens/EmployeeActivitiesScreen';
import AdminOptionsScreen from './screens/AdminOptionsScreen';  // Nova tela de opções
import SectorCreationScreen from './screens/SectorCreationScreen';  // Importar a nova tela

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen name="ViewActivities" component={ViewActivitiesScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminOptionsScreen" component={AdminOptionsScreen} /> 
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="EmployeeActivities" component={EmployeeActivitiesScreen} />
        <Stack.Screen name="SectorCreationScreen" component={SectorCreationScreen} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import APIInputScreen from './APIInputScreen';
import ChatScreen from './ChatScreen';
import { StyleSheet, Text } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }} initialRouteName="APIInputScreen">
        <Stack.Screen name="APIInputScreen" component={APIInputScreen} options={{ title: 'API Input' }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat', headerTintColor: '#ffffff', }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2c2147',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
export default App;

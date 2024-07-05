import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

const APIInputScreen = ({ navigation }) => {
  const [apiInput, setApiInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSubmit = async () => {
    if (apiInput.trim() === '' || systemPrompt.trim() === '' ) {
      Alert.alert('Error', 'Input cannot be empty');
      return;
    } 
    try {
      const url = apiInput.trim();
      console.log('Checking API URL:', url);
      const response = await fetch(url, {
        method: 'GET',
      });
      if (response.ok) {
        console.log('API is valid');
        navigation.navigate('Chat', { apiUrl: url, systemPrompt: systemPrompt});
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error checking API:', error);
      Alert.alert('Error', 'Invalid API URL or server not reachable');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Input Your API"
        value={apiInput}
        onChangeText={setApiInput}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Input System Prompt"
        value={systemPrompt}
        onChangeText={setSystemPrompt}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13101a',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#faf8f7',
  },
  button: {
    backgroundColor: '#120d40',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  buttonText : {
    color: '#faf8f7',
  }
});

export default APIInputScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
const APIInputScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [apiInput, setApiInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedItemsJson = await AsyncStorage.getItem('savedItems');
        if (storedItemsJson) {
          const storedItems = JSON.parse(storedItemsJson);
          setSavedItems(storedItems);
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  const handleSubmit = async () => {
    if (groupName.trim() === '' || apiInput.trim() === '' || systemPrompt.trim() === '') {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const newItem = { groupName, apiUrl: apiInput.trim(), systemPrompt };
    const newItems = [...savedItems, newItem];
    setSavedItems(newItems);
    await AsyncStorage.setItem('savedItems', JSON.stringify(newItems));

    // tai sao no k clear values :(( wtf men
    setGroupName('');
    setApiInput('');
    setSystemPrompt('');
  };

  const deleteItem = async (index) => {
    const newItems = [...savedItems];
    newItems.splice(index, 1);
    setSavedItems(newItems);
    await AsyncStorage.setItem('savedItems', JSON.stringify(newItems));
  };

  const handleItemPress = (item) => {
    navigation.navigate('ChatScreen', { apiUrl: item.apiUrl, systemPrompt: item.systemPrompt });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
      <Text style={styles.itemText}>{item.groupName}</Text>
    </TouchableOpacity>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteItem(data.index)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor="#888"
        />
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
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <SwipeListView
        data={savedItems}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        keyExtractor={(item, index) => index.toString()}
        rightOpenValue={-75}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13101a',
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
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
    alignItems: 'center',
  },
  buttonText: {
    color: '#faf8f7',
  },
  item: {
    backgroundColor: '#29263e',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemText: {
    color: '#faf8f7',
    fontSize: 16,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#1b1824',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#050505',
    marginBottom: 0,
    borderRadius: 10,
    right: 0,
    width: 100,
  },
  backTextWhite: {
    color: '#fcfeff',
    fontWeight: 'bold',
  },
});

export default APIInputScreen;

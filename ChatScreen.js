import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, Alert } from 'react-native';

const ChatScreen = ({ route, navigation }) => {
  const { apiUrl, systemPrompt } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(apiUrl, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error checking API:', error);
        Alert.alert('Error', 'Invalid API URL or server not reachable');
        navigation.goBack();
      }
    };

    checkApi();
  }, [apiUrl, navigation]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const newMessageData = { id: messages.length + 1, text: newMessage, sender: 'user' };
      const newMessageListItem = { role: 'user', content: newMessage };
      
      setMessages([...messages, newMessageData]);
      setMessageList([...messageList, newMessageListItem]);
      setNewMessage('');

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              ...messageList,
              newMessageListItem,
            ],
            "_continue": false,
            "stop_at_newline": false,
            "chat_prompt_size": 2048,
            "chat_generation_attempts": 1,
            "chat-instruct_command": "",
            "max_new_tokens": 100,
            "do_sample": true,
            "temperature": 0.7,
            "top_p": 0.1,
            "typical_p": 1,
            "epsilon_cutoff": 0,
            "eta_cutoff": 0,
            "tfs": 1,
            "top_a": 0,
            "repetition_penalty": 1.18,
            "top_k": 40,
            "min_length": 0,
            "no_repeat_ngram_size": 0,
            "num_beams": 1,
            "penalty_alpha": 0,
            "length_penalty": 1,
            "early_stopping": false,
            "mirostat_mode": 0,
            "mirostat_tau": 5,
            "mirostat_eta": 0.1,
            "seed": -1,
            "add_bos_token": true,
            "truncation_length": 2048,
            "ban_eos_token": false,
            "skip_special_tokens": true,
            "stopping_strings": []
          }),
        });

        if (response.body && typeof response.body.getReader === 'function') {
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let botMessageText = "";
          let readResult;

          while (true) {
            readResult = await reader.read();
            const { done, value } = readResult;
            if (done) break;
            botMessageText += decoder.decode(value, { stream: true });

            if (/\.\s*$/.test(botMessageText) || /\?\s*$/.test(botMessageText) || /\!\s*$/.test(botMessageText)) {
              const botMessageData = { id: messages.length + 2, text: botMessageText, sender: 'bot' };
              setMessages((prevMessages) => [...prevMessages.filter(msg => msg.sender !== 'bot'), botMessageData]);
            }
          }
          botMessageText += decoder.decode();
          if (botMessageText.trim().length > 0) {
            const botMessageData = { id: messages.length + 2, text: botMessageText, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages.filter(msg => msg.sender !== 'bot'), botMessageData]);
          }
        } else {
          const data = await response.json();
          const botMessageText = data.choices[0].message.content.trim();
          const botMessageData = { id: messages.length + 2, text: botMessageText, sender: 'bot' };
          setMessages((prevMessages) => [...prevMessages, botMessageData]);
          setMessageList((prevMessageList) => [
            ...prevMessageList,
            { role: 'assistant', content: botMessageText }
          ]);
        }
      } catch (error) {
        console.error('Error fetching API:', error);
      }
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setMessageList([]);
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleResetChat}>
          <Text style={styles.menuButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13101a',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  menuButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#120d40',
    borderRadius: 10,
  },
  menuButtonText: {
    color: '#faf8f7',
    fontWeight: 'bold',
  },
  messageContainer: {
    paddingVertical: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#13101a',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  botMessage: {
    backgroundColor: '#13101a',
    borderRadius: 15,
    borderColor: '#faf8f7',
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    color: '#faf8f7',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#faf8f7',
  },
  sendButton: {
    backgroundColor: '#120d40',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#faf8f7',
    fontWeight: 'bold',
  },
});

export default ChatScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api/api';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now().toString(), text: input, user: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Envia a pergunta para o novo endpoint do backend
      const response = await api.post('/chat', { question: userMessage.text });
      
      const botMessage = { id: (Date.now() + 1).toString(), text: response.data, user: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { id: (Date.now() + 1).toString(), text: 'Desculpe, não consegui processar sua pergunta.', user: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Erro no chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.user === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={item.user === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
          </View>
        )}
      />
      {loading && <ActivityIndicator style={{padding: 10}}/>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Digite sua pergunta..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Adicione seus estilos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    messageBubble: { padding: 15, borderRadius: 20, marginVertical: 5, maxWidth: '80%' },
    userBubble: { backgroundColor: '#51007d', alignSelf: 'flex-end', marginRight: 10 },
    botBubble: { backgroundColor: '#ecf0f1', alignSelf: 'flex-start', marginLeft: 10 },
    userText: { color: 'white' },
    botText: { color: 'black' },
    inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: 'white' },
    input: { flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingHorizontal: 15 },
    sendButton: { marginLeft: 10, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#51007d', borderRadius: 20 },
    sendButtonText: { color: 'white', fontWeight: 'bold' }
});

export default ChatScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import api from '../api/api';
import listStyles from '../styles/listscreenstyles';
import formStyles from '../styles/formstyles';
import { MaterialIcons } from "@expo/vector-icons";

const LocalizacoesScreen = () => {
  const [localizacoes, setLocalizacoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocalizacao, setCurrentLocalizacao] = useState({ id: null, codigo: '', descricao: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLocalizacoes();
  }, []);

  const fetchLocalizacoes = async () => {
    try {
      const response = await api.get('/localizacoes');
      setLocalizacoes(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as localizações.");
    }
  };

  const handleSave = async () => {
    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `/localizacoes/${currentLocalizacao.id}` : '/localizacoes';
    
    try {
      await api[method](url, currentLocalizacao);
      setModalVisible(false);
      fetchLocalizacoes();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a localização.");
    }
  };

  const openModal = (localizacao = null) => {
    if (localizacao) {
      setCurrentLocalizacao(localizacao);
      setIsEditing(true);
    } else {
      setCurrentLocalizacao({ id: null, codigo: '', descricao: '' });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/localizacoes/${id}`);
      fetchLocalizacoes();
    } catch (error) {
       Alert.alert("Erro", "Não foi possível deletar a localização.");
    }
  };

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Localizações</Text>
      
      <FlatList
        data={localizacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={listStyles.row}>
            <Text style={[listStyles.cell, { flex: 1, textAlign: 'left' }]}>{item.codigo}</Text>
            <Text style={[listStyles.cell, { flex: 2, textAlign: 'left' }]}>{item.descricao}</Text>
            <View style={listStyles.actionsCell}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <MaterialIcons name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={listStyles.fab} onPress={() => openModal()}>
        <Text style={listStyles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={formStyles.modalContainer}>
          <View style={formStyles.modalView}>
            <Text style={formStyles.modalTitle}>{isEditing ? 'Editar Localização' : 'Nova Localização'}</Text>
            <TextInput placeholder="Código (Ex: A01-P01)" style={formStyles.input} value={currentLocalizacao.codigo} onChangeText={(text) => setCurrentLocalizacao({ ...currentLocalizacao, codigo: text })}/>
            <TextInput placeholder="Descrição" style={formStyles.input} value={currentLocalizacao.descricao} onChangeText={(text) => setCurrentLocalizacao({ ...currentLocalizacao, descricao: text })}/>
            <View style={formStyles.buttonContainer}>
              <TouchableOpacity style={[formStyles.button, formStyles.buttonCancel]} onPress={() => setModalVisible(false)}>
                <Text style={formStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[formStyles.button, formStyles.buttonSave]} onPress={handleSave}>
                <Text style={formStyles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LocalizacoesScreen;
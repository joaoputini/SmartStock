import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import api from '../api/api';
import listStyles from '../styles/listscreenstyles';
import formStyles from '../styles/formstyles';
import { MaterialIcons } from "@expo/vector-icons";

const CategoriasScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState({ id: null, nome: '', descricao: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    }
  };

  const handleSave = async () => {
    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `/categorias/${currentCategoria.id}` : '/categorias';
    
    try {
      await api[method](url, currentCategoria);
      setModalVisible(false);
      fetchCategorias();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a categoria.");
    }
  };

  const openModal = (categoria = null) => {
    if (categoria) {
      setCurrentCategoria(categoria);
      setIsEditing(true);
    } else {
      setCurrentCategoria({ id: null, nome: '', descricao: '' });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categorias/${id}`);
      fetchCategorias();
    } catch (error) {
       Alert.alert("Erro", "Não foi possível deletar a categoria.");
    }
  };

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Categorias</Text>
      
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={listStyles.row}>
            <Text style={[listStyles.cell, { flex: 2, textAlign: 'left' }]}>{item.nome}</Text>
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
            <Text style={formStyles.modalTitle}>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</Text>
            
            <TextInput
              placeholder="Nome"
              style={formStyles.input}
              value={currentCategoria.nome}
              onChangeText={(text) => setCurrentCategoria({ ...currentCategoria, nome: text })}
            />
            <TextInput
              placeholder="Descrição"
              style={formStyles.input}
              value={currentCategoria.descricao}
              onChangeText={(text) => setCurrentCategoria({ ...currentCategoria, descricao: text })}
            />
            
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

export default CategoriasScreen;
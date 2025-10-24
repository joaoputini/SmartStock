import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Modal, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import api from "../api/api";
import listStyles from "../styles/listscreenstyles";
import formStyles from '../styles/formstyles';
import { MaterialIcons } from "@expo/vector-icons";

const ProdutosScreen = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados para os pickers
  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  const [currentProduto, setCurrentProduto] = useState({
    id: null, nome: '', sku: '', descricao: '', pontoRessuprimento: '', unidadeMedida: '',
    categoria: { id: null },
    fornecedor: { id: null }
  });

  useEffect(() => {
    fetchProdutos();
    fetchDropdownData();
  }, []);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
      try {
          const [catRes, fornRes] = await Promise.all([
              api.get('/categorias'),
              api.get('/fornecedores')
          ]);
          setCategorias(catRes.data);
          setFornecedores(fornRes.data);
      } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar dados de suporte.");
      }
  };

  const handleSave = async () => {
    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `/produtos/${currentProduto.id}` : '/produtos';
    
    if (!currentProduto.nome || !currentProduto.sku || !currentProduto.categoria.id || !currentProduto.fornecedor.id) {
        Alert.alert("Erro", "Nome, SKU, Categoria e Fornecedor são obrigatórios.");
        return;
    }

    try {
      await api[method](url, currentProduto);
      setModalVisible(false);
      fetchProdutos();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  };

  const openModal = (produto = null) => {
    if (produto) {
      setCurrentProduto({
          ...produto,
          pontoRessuprimento: produto.pontoRessuprimento?.toString() ?? ''
      });
      setIsEditing(true);
    } else {
      setCurrentProduto({
        id: null, nome: '', sku: '', descricao: '', pontoRessuprimento: '', unidadeMedida: '',
        categoria: { id: categorias.length > 0 ? categorias[0].id : null },
        fornecedor: { id: fornecedores.length > 0 ? fornecedores[0].id : null }
      });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/produtos/${id}`);
      fetchProdutos();
    } catch (error) {
       Alert.alert("Erro", "Não foi possível deletar o produto.");
    }
  };

  if (loading) {
    return <ActivityIndicator style={listStyles.loadingContainer} size="large" />;
  }

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={listStyles.row}>
            <Text style={[listStyles.cell, { flex: 2, textAlign: 'left' }]}>{item.nome}</Text>
            <Text style={[listStyles.cell, { flex: 2 }]}>{item.sku}</Text>
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
            <Text style={formStyles.modalTitle}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Text>
            
            <TextInput placeholder="Nome do Produto" style={formStyles.input} value={currentProduto.nome} onChangeText={(text) => setCurrentProduto({ ...currentProduto, nome: text })}/>
            <TextInput placeholder="SKU (Código Único)" style={formStyles.input} value={currentProduto.sku} onChangeText={(text) => setCurrentProduto({ ...currentProduto, sku: text })}/>
            <TextInput placeholder="Descrição" style={formStyles.input} value={currentProduto.descricao} onChangeText={(text) => setCurrentProduto({ ...currentProduto, descricao: text })}/>
            <TextInput placeholder="Ponto de Ressuprimento" style={formStyles.input} keyboardType="numeric" value={currentProduto.pontoRessuprimento} onChangeText={(text) => setCurrentProduto({ ...currentProduto, pontoRessuprimento: text })}/>
            <TextInput placeholder="Unidade (pç, kg, L)" style={formStyles.input} value={currentProduto.unidadeMedida} onChangeText={(text) => setCurrentProduto({ ...currentProduto, unidadeMedida: text })}/>

            <Text>Categoria</Text>
            <Picker
                selectedValue={currentProduto.categoria.id}
                style={formStyles.picker}
                onValueChange={(itemValue) => setCurrentProduto({...currentProduto, categoria: { id: itemValue }})}
            >
                {categorias.map(cat => <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />)}
            </Picker>

             <Text>Fornecedor</Text>
            <Picker
                selectedValue={currentProduto.fornecedor.id}
                style={formStyles.picker}
                onValueChange={(itemValue) => setCurrentProduto({...currentProduto, fornecedor: { id: itemValue }})}
            >
                {fornecedores.map(forn => <Picker.Item key={forn.id} label={forn.nome} value={forn.id} />)}
            </Picker>

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

export default ProdutosScreen;
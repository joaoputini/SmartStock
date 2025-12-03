import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import api from '../api/api';
import listStyles from '../styles/listscreenstyles';
import formStyles from "../styles/formstyles";

const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [papeis, setPapeis] = useState([]); // Lista de papéis para o dropdown
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado do formulário
  const [currentUsuario, setCurrentUsuario] = useState({
    id: null,
    nome: "",
    email: "",
    senhaHash: "", // Usaremos este campo para enviar a senha
    papel: { id: null },
    ativo: true,
  });

  useEffect(() => {
    fetchUsuarios();
    fetchPapeis();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPapeis = async () => {
    try {
      const response = await api.get('/papeis');
      setPapeis(response.data);
    } catch (error) {
      console.error("Erro ao carregar papéis:", error);
    }
  };

  const handleSave = async () => {
    // Validação básica
    if (!currentUsuario.nome || !currentUsuario.email || !currentUsuario.papel.id) {
      Alert.alert("Erro", "Nome, Email e Papel são obrigatórios.");
      return;
    }

    // Se for cadastro novo, senha é obrigatória
    if (!isEditing && !currentUsuario.senhaHash) {
        Alert.alert("Erro", "A senha é obrigatória para novos usuários.");
        return;
    }

    const method = isEditing ? "put" : "post";
    const url = isEditing ? `/usuarios/${currentUsuario.id}` : "/usuarios";

    try {
      await api[method](url, currentUsuario);
      Alert.alert("Sucesso", "Usuário salvo com sucesso!");
      setModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      const msg = error.response?.data?.message || "Não foi possível salvar o usuário.";
      Alert.alert("Erro", msg);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/usuarios/${id}`);
              fetchUsuarios();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o usuário.");
            }
          },
        },
      ]
    );
  };

  const openModal = (usuario = null) => {
    if (usuario) {
      setIsEditing(true);
      setCurrentUsuario({
        ...usuario,
        senhaHash: "", // Limpa a senha para edição (só envia se quiser alterar)
        papel: { id: usuario.papel?.id || (papeis.length > 0 ? papeis[0].id : null) }
      });
    } else {
      setIsEditing(false);
      setCurrentUsuario({
        id: null,
        nome: "",
        email: "",
        senhaHash: "",
        papel: { id: papeis.length > 0 ? papeis[0].id : null },
        ativo: true,
      });
    }
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={listStyles.row}>
      <Text style={[listStyles.cell, { flex: 2, textAlign: 'left' }]}>{item.nome}</Text>
      <Text style={[listStyles.cell, { flex: 3, textAlign: 'left', fontSize: 12 }]}>{item.email}</Text>
      <Text style={[listStyles.cell, { flex: 2, fontSize: 12 }]}>{item.papel?.nome}</Text>
      <Text style={[listStyles.cell, { color: item.ativo ? 'green' : 'red', fontWeight: 'bold' }]}>
        {item.ativo ? 'Ativo' : 'Inativo'}
      </Text>
      
      <View style={listStyles.actionsCell}>
        <TouchableOpacity onPress={() => openModal(item)}>
          <MaterialIcons name="edit" size={24} color="#797070ab" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialIcons name="delete" size={24} color="#c50000d2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={listStyles.loadingContainer} size="large" />;
  }

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Gerenciamento de Usuários</Text>
      
      <View style={listStyles.headerRow}>
        <Text style={[listStyles.headerCell, { flex: 2, textAlign: 'left' }]}>Nome</Text>
        <Text style={[listStyles.headerCell, { flex: 3, textAlign: 'left' }]}>Email</Text>
        <Text style={[listStyles.headerCell, { flex: 2 }]}>Papel</Text>
        <Text style={listStyles.headerCell}>Status</Text>
        <Text style={[listStyles.headerCell, { flex: 1 }]}>Ações</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity
        style={[
          listStyles.fab,
          {
            backgroundColor: "#51007d",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        onPress={() => openModal()}
      >
        <Text style={listStyles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal de Cadastro/Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={formStyles.modalContainer}>
          <View style={formStyles.modalView}>
            <Text style={formStyles.modalTitle}>
              {isEditing ? "Editar Usuário" : "Novo Usuário"}
            </Text>

            <TextInput
              placeholder="Nome Completo"
              style={formStyles.input}
              value={currentUsuario.nome}
              onChangeText={(text) => setCurrentUsuario({ ...currentUsuario, nome: text })}
            />

            <TextInput
              placeholder="E-mail"
              style={formStyles.input}
              value={currentUsuario.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => setCurrentUsuario({ ...currentUsuario, email: text })}
            />

            <TextInput
              placeholder={isEditing ? "Nova Senha (deixe vazio para manter)" : "Senha"}
              style={formStyles.input}
              value={currentUsuario.senhaHash}
              secureTextEntry={true}
              onChangeText={(text) => setCurrentUsuario({ ...currentUsuario, senhaHash: text })}
            />

            <Text style={{alignSelf: 'flex-start', color: '#555', marginTop: 5}}>Função (Papel):</Text>
            <View style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 5, width: '100%', marginBottom: 15}}>
              <Picker
                selectedValue={currentUsuario.papel.id}
                onValueChange={(itemValue) =>
                  setCurrentUsuario({ ...currentUsuario, papel: { id: itemValue } })
                }
                style={{ width: '100%' }}
              >
                {papeis.map((papel) => (
                  <Picker.Item key={papel.id} label={papel.nome} value={papel.id} />
                ))}
              </Picker>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, width: '100%', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 16, color: '#555'}}>Usuário Ativo?</Text>
                <Switch
                    value={currentUsuario.ativo}
                    onValueChange={(val) => setCurrentUsuario({...currentUsuario, ativo: val})}
                    trackColor={{ false: "#767577", true: "#a854ec" }}
                    thumbColor={currentUsuario.ativo ? "#51007d" : "#f4f3f4"}
                />
            </View>

            <View style={formStyles.buttonContainer}>
              <TouchableOpacity
                style={[formStyles.button, formStyles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={formStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[formStyles.button, formStyles.buttonSave]}
                onPress={handleSave}
              >
                <Text style={formStyles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsuariosScreen;
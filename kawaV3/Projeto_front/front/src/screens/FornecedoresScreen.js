import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import api from "../api/api";
import listStyles from "../styles/listscreenstyles";
import formStyles from "../styles/formstyles";
import { MaterialIcons } from "@expo/vector-icons";

const FornecedoresScreen = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFornecedor, setCurrentFornecedor] = useState({
    id: null,
    nome: "",
    cnpj: "",
    contatoEmail: "",
    contatoTelefone: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      const response = await api.get("/fornecedores");
      setFornecedores(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os fornecedores.");
    }
  };

  // --- AQUI ESTÁ A MUDANÇA PRINCIPAL ---
  const handleSave = async () => {
    const method = isEditing ? "put" : "post";
    const url = isEditing
      ? `/fornecedores/${currentFornecedor.id}`
      : "/fornecedores";

    try {
      await api[method](url, currentFornecedor);
      setModalVisible(false);
      fetchFornecedores();
      Alert.alert("Sucesso", "Fornecedor salvo!"); // Feedback visual de sucesso
    } catch (error) {
      // Lógica para pegar a mensagem exata do Java
      let msgErro = "Não foi possível salvar o fornecedor.";

      // Verifica se veio a mensagem personalizada do GlobalExceptionHandler ("mensagem")
      if (
        error.response &&
        error.response.data &&
        error.response.data.mensagem
      ) {
        msgErro = error.response.data.mensagem;
      }
      // Verifica se veio uma mensagem padrão do Spring ("message" ou "error")
      else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        msgErro = error.response.data.message;
      }

      console.error("Erro detalhado:", error.response?.data); // Ajuda a debugar no terminal
      Alert.alert("Atenção", msgErro);
    }
  };
  // -------------------------------------

  const openModal = (fornecedor = null) => {
    if (fornecedor) {
      setCurrentFornecedor(fornecedor);
      setIsEditing(true);
    } else {
      setCurrentFornecedor({
        id: null,
        nome: "",
        cnpj: "",
        contatoEmail: "",
        contatoTelefone: "",
      });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/fornecedores/${id}`);
      fetchFornecedores();
    } catch (error) {
      // Se o backend enviar erro ao deletar (ex: tem produtos vinculados), mostra aqui também
      let msgErro = "Não foi possível deletar.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.mensagem
      ) {
        msgErro = error.response.data.mensagem;
      }
      Alert.alert("Erro", msgErro);
    }
  };

  return (
    <View style={listStyles.container}>
      

      <FlatList
        data={fornecedores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={listStyles.row}>
            <Text style={[listStyles.cell, { flex: 2, textAlign: "left" }]}>
              {item.nome}
            </Text>
            <Text style={[listStyles.cell, { flex: 2 }]}>{item.cnpj}</Text>
            <View style={listStyles.actionsCell}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <MaterialIcons name="edit" size={24} color="#797070ab " />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="#c50000d2" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={formStyles.modalContainer}>
          <View style={formStyles.modalView}>
            <Text style={formStyles.modalTitle}>
              {isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}
            </Text>

            <TextInput
              placeholder="Nome"
              style={formStyles.input}
              value={currentFornecedor.nome}
              onChangeText={(text) =>
                setCurrentFornecedor({ ...currentFornecedor, nome: text })
              }
            />

            {/* Dica: Adicione keyboardType para facilitar a digitação de números */}
            <TextInput
              placeholder="CNPJ"
              style={formStyles.input}
              value={currentFornecedor.cnpj}
              keyboardType="numeric"
              onChangeText={(text) =>
                setCurrentFornecedor({ ...currentFornecedor, cnpj: text })
              }
            />

            <TextInput
              placeholder="Email"
              style={formStyles.input}
              value={currentFornecedor.contatoEmail}
              onChangeText={(text) =>
                setCurrentFornecedor({
                  ...currentFornecedor,
                  contatoEmail: text,
                })
              }
            />

            <TextInput
              placeholder="Telefone"
              style={formStyles.input}
              value={currentFornecedor.contatoTelefone}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setCurrentFornecedor({
                  ...currentFornecedor,
                  contatoTelefone: text,
                })
              }
            />

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

export default FornecedoresScreen;

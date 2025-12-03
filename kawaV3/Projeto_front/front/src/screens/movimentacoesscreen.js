import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons"; // Importação correta dos ícones
import styles from "../styles/movimentacoesstyles.js";
import listStyles from "../styles/listscreenstyles";
import formStyles from "../styles/formstyles";
import api from "../api/api";

export default function MovimentacoesScreen() {
  const [filtro, setFiltro] = useState("");
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [movimentacoesFiltradas, setMovimentacoesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Modal e Listas
  const [modalVisible, setModalVisible] = useState(false);
  const [produtosList, setProdutosList] = useState([]);
  const [usuariosList, setUsuariosList] = useState([]);
  const [localizacoesList, setLocalizacoesList] = useState([]);

  // Estado do Formulário
  const [novaMovimentacao, setNovaMovimentacao] = useState({
    produtoId: null,
    tipo: "ENTRADA",
    quantidade: "",
    usuarioId: null,
    localizacaoId: null,
  });

  useEffect(() => {
    fetchMovimentacoes();
    fetchDadosAuxiliares();
  }, []);

  const fetchMovimentacoes = async () => {
    try {
      const response = await api.get('/movimentacoes');
      setMovimentacoes(response.data);
      setMovimentacoesFiltradas(response.data);
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDadosAuxiliares = async () => {
    try {
      const [prodRes, userRes, locRes] = await Promise.all([
        api.get("/produtos"),
        api.get("/usuarios"),
        api.get("/localizacoes"),
      ]);
      setProdutosList(prodRes.data);
      setUsuariosList(userRes.data);
      setLocalizacoesList(locRes.data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar listas.");
    }
  };

  const filtrarMovimentacoes = (text) => {
    setFiltro(text);
    if (text) {
      const filtradas = movimentacoes.filter((m) =>
        m.produto.nome.toLowerCase().includes(text.toLowerCase())
      );
      setMovimentacoesFiltradas(filtradas);
    } else {
      setMovimentacoesFiltradas(movimentacoes);
    }
  };

  const openModal = () => {
    // Previne erro se as listas estiverem vazias
    setNovaMovimentacao({
      produtoId: produtosList.length > 0 ? produtosList[0].id : null,
      usuarioId: usuariosList.length > 0 ? usuariosList[0].id : null,
      localizacaoId: localizacoesList.length > 0 ? localizacoesList[0].id : null,
      tipo: "ENTRADA",
      quantidade: "",
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    const { produtoId, usuarioId, tipo, quantidade, localizacaoId } = novaMovimentacao;

    if (!produtoId || !usuarioId || !quantidade) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (tipo === "ENTRADA" && !localizacaoId) {
      Alert.alert("Erro", "Selecione uma localização para a entrada.");
      return;
    }

    // Monta o JSON no formato que o Java espera (Entidade pura, sem DTO)
    const body = {
      produto: { id: produtoId },
      usuario: { id: usuarioId },
      tipo: tipo,
      quantidade: parseFloat(quantidade)
    };

    // Se for ENTRADA, manda o ID da localização na URL
    let url = "/movimentacoes";
    if (tipo === "ENTRADA") {
        url += `?localizacaoId=${localizacaoId}`;
    }

    try {
      await api.post(url, body);
      Alert.alert("Sucesso", "Movimentação registrada e estoque atualizado!");
      setModalVisible(false);
      fetchMovimentacoes();
    } catch (error) {
      const msg = error.response?.data || "Erro ao registrar.";
      Alert.alert("Erro", typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  const renderMovimentacao = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.produto?.nome || '---'}</Text>
      <Text style={[styles.cell, { color: item.tipo === 'ENTRADA' ? 'green' : 'red', fontWeight: 'bold' }]}>
        {item.tipo}
      </Text>
      <Text style={styles.cell}>{item.quantidade}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.usuario?.nome || '---'}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#51007d" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movimentações</Text>

      <TextInput
        style={styles.input}
        placeholder="Filtrar por produto..."
        value={filtro}
        onChangeText={filtrarMovimentacoes}
      />

      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>Produto</Text>
        <Text style={styles.cell}>Tipo</Text>
        <Text style={styles.cell}>Qtd.</Text>
        <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>Usuário</Text>
      </View>

      <FlatList
        data={movimentacoesFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovimentacao}
      />

      <TouchableOpacity
        style={[listStyles.fab, { backgroundColor: "#51007d" }]}
        onPress={openModal}
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
            <Text style={formStyles.modalTitle}>Nova Movimentação</Text>

            <Text style={{ alignSelf: 'flex-start', color: '#555' }}>Produto:</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, width: '100%', marginBottom: 10 }}>
              <Picker
                selectedValue={novaMovimentacao.produtoId}
                onValueChange={(val) => setNovaMovimentacao({ ...novaMovimentacao, produtoId: val })}
              >
                {produtosList.map((p) => (
                  <Picker.Item key={p.id} label={p.nome} value={p.id} />
                ))}
              </Picker>
            </View>

            <Text style={{ alignSelf: 'flex-start', color: '#555' }}>Tipo:</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, width: '100%', marginBottom: 10 }}>
              <Picker
                selectedValue={novaMovimentacao.tipo}
                onValueChange={(val) => setNovaMovimentacao({ ...novaMovimentacao, tipo: val })}
              >
                <Picker.Item label="Entrada" value="ENTRADA" />
                <Picker.Item label="Saída" value="SAIDA" />
              </Picker>
            </View>

            {novaMovimentacao.tipo === "ENTRADA" && (
              <>
                <Text style={{ alignSelf: 'flex-start', color: '#555' }}>Localização:</Text>
                <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, width: '100%', marginBottom: 10 }}>
                  <Picker
                    selectedValue={novaMovimentacao.localizacaoId}
                    onValueChange={(val) => setNovaMovimentacao({ ...novaMovimentacao, localizacaoId: val })}
                  >
                    {localizacoesList.map((l) => (
                      <Picker.Item key={l.id} label={`${l.codigo} - ${l.descricao}`} value={l.id} />
                    ))}
                  </Picker>
                </View>
              </>
            )}

            <TextInput
              placeholder="Quantidade"
              style={formStyles.input}
              keyboardType="numeric"
              value={novaMovimentacao.quantidade}
              onChangeText={(text) => setNovaMovimentacao({ ...novaMovimentacao, quantidade: text })}
            />

            <Text style={{ alignSelf: 'flex-start', color: '#555' }}>Usuário:</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, width: '100%', marginBottom: 10 }}>
              <Picker
                selectedValue={novaMovimentacao.usuarioId}
                onValueChange={(val) => setNovaMovimentacao({ ...novaMovimentacao, usuarioId: val })}
              >
                {usuariosList.map((u) => (
                  <Picker.Item key={u.id} label={u.nome} value={u.id} />
                ))}
              </Picker>
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
                <Text style={formStyles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
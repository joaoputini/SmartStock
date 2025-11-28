import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import styles from "../styles/movimentacoesstyles.js";
import api from "../api/api";

export default function MovimentacoesScreen() {
  const [filtro, setFiltro] = useState("");
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [movimentacoesFiltradas, setMovimentacoesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchMovimentacoes();
  }, []);

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

  const renderMovimentacao = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.produto.nome}</Text>
      <Text style={[styles.cell, { color: item.tipo === 'ENTRADA' ? 'green' : 'red' }]}>{item.tipo}</Text>
      <Text style={styles.cell}>{item.quantidade}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.usuario.nome}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" />;
  }

  return (
    <View style={styles.container}>
    

      <TextInput
        style={styles.input}
        placeholder="Filtrar por nome do produto"
        value={filtro}
        onChangeText={filtrarMovimentacoes}
      />

      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 2 }]}>Produto</Text>
        <Text style={styles.cell}>Tipo</Text>
        <Text style={styles.cell}>Qtd.</Text>
        <Text style={[styles.cell, { flex: 2 }]}>Usuário</Text>
      </View>

      <FlatList
        data={movimentacoesFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovimentacao}
      />
    </View>
  );
}
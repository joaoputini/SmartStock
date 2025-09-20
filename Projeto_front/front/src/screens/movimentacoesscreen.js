import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import dashboardstyles from "../styles/dashboardstyles.js";
import styles from "../styles/movimentacoesstyles.js";

// Mock atualizado com funcionários de entrada e saída separados
const produtosMock = [
  {
    id: 1,
    nome: "Produto A",
    entrada: 10,
    saida: 5,
    funcionarioEntrada: "João",
    funcionarioSaida: "Maria",
  },
  {
    id: 2,
    nome: "Produto B",
    entrada: 8,
    saida: 5,
    funcionarioEntrada: "Ana",
    funcionarioSaida: "Carlos",
  },
  {
    id: 3,
    nome: "Produto C",
    entrada: 5,
    saida: 3,
    funcionarioEntrada: "Carlos",
    funcionarioSaida: "Maria",
  },
  {
    id: 4,
    nome: "Produto D",
    entrada: 4,
    saida: 4,
    funcionarioEntrada: "Ana",
    funcionarioSaida: "João",
  },
];

export default function MovimentacoesScreen() {
  const [filtro, setFiltro] = useState("");
  const [produtos, setProdutos] = useState(produtosMock);

  const filtrarProdutos = (text) => {
    setFiltro(text);
    const filtrados = produtosMock.filter((p) =>
      p.nome.toLowerCase().includes(text.toLowerCase())
    );
    setProdutos(filtrados);
  };

  const renderProduto = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nome}</Text>
      <Text style={styles.cell}>{item.entrada}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.funcionarioEntrada}</Text>
      <Text style={styles.cell}>{item.saida}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.funcionarioSaida}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movimentações diárias</Text>

      <TextInput
        style={styles.input}
        placeholder="Filtrar por nome do produto"
        value={filtro}
        onChangeText={filtrarProdutos}
      />

      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 2 }]}>Produto</Text>
        <Text style={styles.cell}>Entrada</Text>
        <Text style={[styles.cell, { flex: 2 }]}>Funcionário Entrada</Text>
        <Text style={styles.cell}>Saída</Text>
        <Text style={[styles.cell, { flex: 2 }]}>Funcionário Saída</Text>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduto}
      />
    </View>
  );
}
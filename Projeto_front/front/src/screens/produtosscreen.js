import React, { useState } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import styles from "../styles/produtosstyles.js"; // CSS importado

// Mock apenas com nome e estoque
const produtosMock = [
  { id: 1, nome: "Produto A", estoque: 5 },
  { id: 2, nome: "Produto B", estoque: 3 },
  { id: 3, nome: "Produto C", estoque: 2 },
  { id: 4, nome: "Produto D", estoque: 0 },
];

export default function ProdutosScreen() {
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
      <Text style={styles.cell}>{item.estoque}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos em estoque</Text>

      <TextInput
        style={styles.input}
        placeholder="Filtrar por nome do produto"
        value={filtro}
        onChangeText={filtrarProdutos}
      />

      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 2 }]}>Produto</Text>
        <Text style={styles.cell}>Estoque</Text>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduto}
      />
    </View>
  );
}

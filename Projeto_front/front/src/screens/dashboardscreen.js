import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/dashboardstyles";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Card total de produtos */}
      <View style={styles.cardPurple}>
        <Text style={styles.cardNumber}>100</Text>
        <Text style={styles.cardLabel}>Total de Produtos</Text>
      </View>

      {/* Card movimentações */}
      <View style={styles.cardWhite}>
        <Text style={styles.cardNumber}>1.263</Text>
        <Text style={styles.cardLabel}>Movimentações</Text>
      </View>

      {/* Exemplo de gráfico/estoque baixo (simplificado por enquanto) */}
      <View style={styles.stockBox}>
        <Text style={styles.subTitle}>Produtos com Estoque Baixo</Text>
        <Text>Produto A - 5</Text>
        <Text>Produto B - 3</Text>
        <Text>Produto C - 2</Text>
      </View>
    </View>
  );
}

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions } from "react-native";
import styles from "../styles/dashboardstyles";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuWidth = 200; // largura do menu lateral
  const slideAnim = new Animated.Value(-menuWidth);

  const toggleMenu = () => {
    if (isMenuOpen) {
      Animated.timing(slideAnim, {
        toValue: -menuWidth,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsMenuOpen(false));
    } else {
      setIsMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Navbar lateral */}
      {isMenuOpen && (
        <Animated.View
          style={{
            position: "absolute",
            left: slideAnim,
            top: 0,
            bottom: 0,
            width: menuWidth,
            backgroundColor: "#4B0082",
            paddingTop: 50,
            paddingHorizontal: 10,
            zIndex: 10,
          }}
        >
          <Text style={{ color: "#fff", marginBottom: 20 }}>Dashboard</Text>
          <Text style={{ color: "#fff", marginBottom: 20 }}>Produtos</Text>
          <Text style={{ color: "#fff", marginBottom: 20 }}>Movimentações</Text>
          <Text style={{ color: "#fff", marginBottom: 20 }}>Configurações</Text>
        </Animated.View>
      )}

      {/* Conteúdo da página */}
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        {/* Card total de produtos */}
        <View style={styles.cardPurple}>
          <Text style={styles.cardNumber}>100</Text>
          <Text style={styles.cardLabel}>Total de Produtos</Text>
        </View>

        {/* Card movimentações */}
        <View style={styles.cardPurple}>
          <Text style={styles.cardNumber}>1.263</Text>
          <Text style={styles.cardLabel}>Movimentações</Text>
        </View>

        {/* Produtos com estoque baixo */}
        <View style={styles.stockBox}>
          <Text style={styles.subTitle}>Produtos em Estoque</Text>
          <Text>Produto A - 5</Text>
          <Text>Produto B - 3</Text>
          <Text>Produto C - 2</Text>
        </View>

        {/* Gráfico de Estoque com filtragem dos produtos */}
        <View style={styles.stockBox}>
          <Text style={styles.subTitle}>Gráfico de Estoque</Text>
          <Text>grafico</Text>
        </View>


      </View>
    </View>
  );
}

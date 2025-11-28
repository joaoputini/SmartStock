import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import styles from "../styles/dashboardstyles";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";

import { LineChart } from "react-native-chart-kit";

const SummaryCard = ({ title, value, color }) => (
  <View style={[styles.cardPurple, { backgroundColor: color }]}>
    <Text style={styles.cardNumber}>{value}</Text>
    <Text style={styles.cardLabel}>{title}</Text>
  </View>
);

export default function DashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalMovimentacoes: 0,
    alertasAtivos: 0,
  });

  const [entradasMes, setEntradasMes] = useState(new Array(12).fill(0));
  const [saidasMes, setSaidasMes] = useState(new Array(12).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produtosRes, movimentacoesRes, alertasRes] = await Promise.all([
          api.get("/produtos"),
          api.get("/movimentacoes"),
          api.get("/alertas"),
        ]);

        setStats({
          totalProdutos: produtosRes.data.length,
          totalMovimentacoes: movimentacoesRes.data.length,
          alertasAtivos: alertasRes.data.filter((a) => a.status === "NOVO")
            .length,
        });

        const entradas = new Array(12).fill(0);
        const saidas = new Array(12).fill(0);

        movimentacoesRes.data.forEach((m) => {
          const data = new Date(m.dataHora);
          if (isNaN(data)) return;

          const mes = data.getMonth();

          if (m.tipo === "ENTRADA") entradas[mes] += Number(m.quantidade);
          if (m.tipo === "SAIDA") saidas[mes] += Number(m.quantidade);
        });

        setEntradasMes(entradas);
        setSaidasMes(saidas);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#8e44ad" />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SummaryCard
        title="Total de Produtos"
        value={stats.totalProdutos}
        color="#51007d"
      />
      <SummaryCard
        title="Movimentações"
        value={stats.totalMovimentacoes}
        color="#51007d"
      />
      <SummaryCard
        title="Alertas Ativos"
        value={stats.alertasAtivos}
        color="#51007d"
      />

      <View style={styles.stockBox}>
        <Text style={styles.subTitle}>Movimentações por Mês</Text>

        <LineChart
          data={{
            labels: [
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez",
            ],
            datasets: [
              {
                data: entradasMes,
                color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                strokeWidth: 3,
              },
              {
                data: saidasMes,
                color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                strokeWidth: 3,
              },
            ],
            legend: ["Entradas", "Saídas"],
          }}
          width={Dimensions.get("window").width - 60}
          height={260}
          bezier
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            propsForDots: {
              r: "4",
            },
            propsForBackgroundLines: {
              strokeDasharray: "",
            },
          }}
          style={{
            marginVertical: 20,
            borderRadius: 15,
            alignSelf: "center",
          }}
        />
      </View>

      <TouchableOpacity
        onPress={logout}
        style={{
          alignSelf: "flex-end",
          backgroundColor: "#51007d",
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginTop: 20,
          marginBottom: 20,
          marginRight: 20,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Sair
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

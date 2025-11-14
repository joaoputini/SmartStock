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

// gráfico
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

  // estados do gráfico
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

        // --- stats ---
        setStats({
          totalProdutos: produtosRes.data.length,
          totalMovimentacoes: movimentacoesRes.data.length,
          alertasAtivos: alertasRes.data.filter((a) => a.status === "NOVO")
            .length,
        });

        // --- gráfico: agrupar por mês ---
        const entradas = new Array(12).fill(0);
        const saidas = new Array(12).fill(0);

        movimentacoesRes.data.forEach((m) => {
          const data = new Date(m.dataHora); // campo vindo do backend H2
          const mes = data.getMonth(); // 0–11

          if (m.tipo === "ENTRADA") {
            entradas[mes] += Number(m.quantidade);
          } else if (m.tipo === "SAIDA") {
            saidas[mes] += Number(m.quantidade);
          }
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
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <SummaryCard
        title="Total de Produtos"
        value={stats.totalProdutos}
        color="#9b59b6"
      />
      <SummaryCard
        title="Movimentações"
        value={stats.totalMovimentacoes}
        color="#3498db"
      />
      <SummaryCard
        title="Alertas Ativos"
        value={stats.alertasAtivos}
        color="#e74c3c"
      />

      {/* === GRÁFICO === */}
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
                color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // verde
                strokeWidth: 3,
              },
              {
                data: saidasMes,
                color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // vermelho
                strokeWidth: 3,
              },
            ],
            legend: ["Entradas", "Saídas"],
          }}
          width={Dimensions.get("window").width - 40}
          height={260}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          bezier
          style={{
            marginVertical: 20,
            borderRadius: 10,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={logout}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "red",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

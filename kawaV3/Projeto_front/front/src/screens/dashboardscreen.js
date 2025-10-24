import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import styles from "../styles/dashboardstyles";
import { AuthContext } from "../contexts/AuthContext";
import api from '../api/api';

const SummaryCard = ({ title, value, color }) => (
  <View style={[styles.cardPurple, { backgroundColor: color }]}>
    <Text style={styles.cardNumber}>{value}</Text>
    <Text style={styles.cardLabel}>{title}</Text>
  </View>
);

export default function DashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProdutos: 0, totalMovimentacoes: 0, alertasAtivos: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produtosRes, movimentacoesRes, alertasRes] = await Promise.all([
          api.get('/produtos'),
          api.get('/movimentacoes'),
          api.get('/alertas')
        ]);
        
        setStats({
          totalProdutos: produtosRes.data.length,
          totalMovimentacoes: movimentacoesRes.data.length,
          alertasAtivos: alertasRes.data.filter(a => a.status === 'NOVO').length
        });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <SummaryCard title="Total de Produtos" value={stats.totalProdutos} color="#9b59b6" />
      <SummaryCard title="Movimentações" value={stats.totalMovimentacoes} color="#3498db" />
      <SummaryCard title="Alertas Ativos" value={stats.alertasAtivos} color="#e74c3c" />

      {/* Adicione seus gráficos e outras informações aqui */}
      <View style={styles.stockBox}>
        <Text style={styles.subTitle}>Gráfico Placeholder</Text>
        <Text>Aqui você pode adicionar um gráfico com os dados da API.</Text>
      </View>
      
      <TouchableOpacity onPress={logout} style={{marginTop: 20, padding: 10, backgroundColor: 'red', borderRadius: 5}}>
          <Text style={{color: 'white', textAlign: 'center'}}>Sair</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import api from '../api/api';
import listStyles from '../styles/listscreenstyles';
import { MaterialIcons } from "@expo/vector-icons";

const AlertasScreen = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      const response = await api.get('/alertas');
      setAlertas(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os alertas.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/alertas/${id}/status`, { status });
      fetchAlertas();
    } catch (error) {
      Alert.alert("Erro", `Não foi possível atualizar o status para ${status}.`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'NOVO':
        return { color: 'red', fontWeight: 'bold' };
      case 'VISUALIZADO':
        return { color: 'orange' };
      default:
        return { color: 'green' };
    }
  };

  const renderItem = ({ item }) => (
    <View style={listStyles.row}>
      <Text style={[listStyles.cell, { flex: 3, textAlign: 'left' }]}>{item.mensagem}</Text>
      <Text style={[listStyles.cell, getStatusStyle(item.status)]}>{item.status}</Text>
      <View style={listStyles.actionsCell}>
        <TouchableOpacity onPress={() => handleUpdateStatus(item.id, 'VISUALIZADO')}>
          <MaterialIcons name="visibility" size={24} color="orange" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpdateStatus(item.id, 'RESOLVIDO')}>
          <MaterialIcons name="check-circle" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={listStyles.loadingContainer} size="large" />;
  }

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Alertas do Sistema</Text>
      
      <FlatList
        data={alertas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AlertasScreen;
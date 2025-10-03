import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from '../api/api';
import listStyles from '../styles/listscreenstyles';

const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os usuários.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const renderItem = ({ item }) => (
    <View style={listStyles.row}>
      <Text style={[listStyles.cell, { flex: 2, textAlign: 'left' }]}>{item.nome}</Text>
      <Text style={[listStyles.cell, { flex: 3, textAlign: 'left' }]}>{item.email}</Text>
      <Text style={[listStyles.cell, { flex: 2 }]}>{item.papel.nome}</Text>
      <Text style={[listStyles.cell, { color: item.ativo ? 'green' : 'red' }]}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={listStyles.loadingContainer} size="large" />;
  }

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Gerenciamento de Usuários</Text>
      
      <View style={listStyles.headerRow}>
        <Text style={[listStyles.headerCell, { flex: 2, textAlign: 'left' }]}>Nome</Text>
        <Text style={[listStyles.headerCell, { flex: 3, textAlign: 'left' }]}>Email</Text>
        <Text style={[listStyles.headerCell, { flex: 2 }]}>Papel</Text>
        <Text style={listStyles.headerCell}>Status</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default UsuariosScreen;
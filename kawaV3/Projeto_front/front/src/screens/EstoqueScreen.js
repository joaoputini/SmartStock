import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Importação necessária para atualização automática
import api from '../api/api';
import listStyles from '../styles/listscreenstyles';

const EstoqueScreen = () => {
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);

  // Substituímos o useEffect pelo useFocusEffect para recarregar os dados ao focar na tela
  useFocusEffect(
    useCallback(() => {
      fetchEstoque();
    }, [])
  );

  const fetchEstoque = async () => {
    try {
      // setLoading(true); // Opcional: descomente se quiser ver o loading a cada navegação
      const response = await api.get('/estoques');
      setEstoque(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados de estoque.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={listStyles.row}>
      <Text style={[listStyles.cell, { flex: 3, textAlign: 'left' }]}>{item.produto.nome}</Text>
      <Text style={[listStyles.cell, { flex: 2 }]}>{item.localizacao.codigo}</Text>
      <Text style={[listStyles.cell, { fontWeight: 'bold' }]}>{item.quantidade}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={listStyles.loadingContainer} size="large" />;
  }

  return (
    <View style={listStyles.container}>
      
      <View style={listStyles.headerRow}>
        <Text style={[listStyles.headerCell, { flex: 3, textAlign: 'left' }]}>Produto</Text>
        <Text style={[listStyles.headerCell, { flex: 2 }]}>Localização</Text>
        <Text style={listStyles.headerCell}>Qtd.</Text>
      </View>

      <FlatList
        data={estoque}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default EstoqueScreen;
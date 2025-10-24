import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";

import DashboardScreen from "../screens/dashboardscreen.js";
import ChatScreen from "../screens/ChatScreen.js"; // 1. IMPORTAÇÃO ADICIONADA
import MovimentacoesScreen from "../screens/movimentacoesscreen.js";
import ProdutosScreen from "../screens/produtosscreen.js";
import CategoriasScreen from "../screens/CategoriasScreen.js";
import FornecedoresScreen from "../screens/FornecedoresScreen.js";
import LocalizacoesScreen from "../screens/LocalizacoesScreen.js";
import EstoqueScreen from "../screens/EstoqueScreen.js";
import AlertasScreen from "../screens/AlertasScreen.js";
import UsuariosScreen from "../screens/UsuariosScreen.js";


const Drawer = createDrawerNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: "#4B0082" },
  headerTintColor: "#fff",
  drawerActiveTintColor: "#4B0082",
  drawerLabelStyle: { fontWeight: "bold" },
};

export default function DashboardDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard" screenOptions={screenOptions}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />
      }} />
      <Drawer.Screen name="Chatbot" component={ChatScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="chat" size={24} color={color} />
      }} />
      <Drawer.Screen name="Produtos" component={ProdutosScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="inventory" size={24} color={color} />
      }} />
       <Drawer.Screen name="Movimentações" component={MovimentacoesScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="sync-alt" size={24} color={color} />
      }} />
      <Drawer.Screen name="Estoque" component={EstoqueScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="store" size={24} color={color} />
      }} />
       <Drawer.Screen name="Categorias" component={CategoriasScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="category" size={24} color={color} />
      }} />
      <Drawer.Screen name="Fornecedores" component={FornecedoresScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="local-shipping" size={24} color={color} />
      }} />
      <Drawer.Screen name="Localizações" component={LocalizacoesScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="location-pin" size={24} color={color} />
      }} />
      <Drawer.Screen name="Alertas" component={AlertasScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="error" size={24} color={color} />
      }} />
      <Drawer.Screen name="Usuários" component={UsuariosScreen} options={{
        drawerIcon: ({ color }) => <MaterialIcons name="people" size={24} color={color} />
      }} />
    </Drawer.Navigator>
  );
}
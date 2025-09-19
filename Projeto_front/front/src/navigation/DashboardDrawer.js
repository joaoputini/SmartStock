import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import DashboardScreen from "../screens/dashboardscreen.js";
import MovimentacoesScreen from "../screens/movimentacoesscreen.js";
import ProdutosScreen from "../screens/produtosscreen.js";

const Drawer = createDrawerNavigator();

export default function DashboardDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: { backgroundColor: "#4B0082" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#4B0082",
        drawerLabelStyle: { fontWeight: "bold" },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Movimentações" component={MovimentacoesScreen} />
      <Drawer.Screen name="Produtos" component={ProdutosScreen} />
    </Drawer.Navigator>
  );
}
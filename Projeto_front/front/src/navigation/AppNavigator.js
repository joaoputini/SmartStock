import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/loginscreens";
import DashboardDrawer from "./DashboardDrawer"; // <-- Drawer aqui

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DashboardDrawer" component={DashboardDrawer} /> 
        {/* use esse nome no navigation */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

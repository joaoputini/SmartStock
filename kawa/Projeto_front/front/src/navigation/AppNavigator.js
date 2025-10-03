import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";

import LoginScreen from "../screens/loginscreens";
import DashboardDrawer from "./DashboardDrawer";
import { AuthContext } from "../contexts/AuthContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          // Se o token existe, vai para o Dashboard
          <Stack.Screen name="DashboardDrawer" component={DashboardDrawer} />
        ) : (
          // Se não, vai para o Login
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
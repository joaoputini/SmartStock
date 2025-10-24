import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  // Envolvemos o AppNavigator com o AuthProvider
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
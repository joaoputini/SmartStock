import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/loginstyles.js";
import { AuthContext } from "../contexts/AuthContext.js";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha o email e a senha.");
      return;
    }
    try {
      await login(email, senha);
      // A navegação ocorrerá automaticamente quando o userToken for definido no AuthContext
    } catch (error) {
      Alert.alert("Erro de Login", "Email ou senha inválidos. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SmartStock</Text>
      <Text style={styles.subTitle}>Fazer login</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#777" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#777" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
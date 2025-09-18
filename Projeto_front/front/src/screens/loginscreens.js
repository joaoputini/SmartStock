import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/loginstyles.js";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    console.log("E-mail:", email);
    console.log("Senha:", senha);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SmartStock</Text>
      <Text style={styles.subTitle}>Fazer login</Text>

      {/* Campo de E-mail */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#777" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Campo de Senha */}
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

      {/* Botão Entrar */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      
    </View>
  );
}
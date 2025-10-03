import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Adicione estes estilos que estavam faltando
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#333',
  },

  // Estilos que você já tinha
  input: {
    height: 40,
    borderColor: "#a854ecff",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#eaddf7ff",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});
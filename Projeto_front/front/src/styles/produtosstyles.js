import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
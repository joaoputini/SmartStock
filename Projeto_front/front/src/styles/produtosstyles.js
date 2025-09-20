import { StyleSheet } from "react-native";

export default StyleSheet.create({
    input: {
    height: 40,
    borderColor: "#777",
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
    backgroundColor: "#eee",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});
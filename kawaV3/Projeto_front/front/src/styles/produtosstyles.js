import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#51007d",
  },

  input: {
    height: 40,
    borderColor: "#a854ecff",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e0c6f5", // linha mais suave
    alignItems: "center",
  },

  header: {
    backgroundColor: "#eaddf7ff",
  },

  cell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
  },

  actionsCell: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#51007d",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -3,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

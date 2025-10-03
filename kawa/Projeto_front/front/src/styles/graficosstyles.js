import { StyleSheet } from "react-native";

export default StyleSheet.create({
  chartStyle: {
    marginVertical: 8,
    borderRadius: 10,
  },
  chartConfig: {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 10,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#4B0082",
    },
  },
  chartHeight: 220, // só valor fixo
});

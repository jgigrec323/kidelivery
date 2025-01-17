import { View, StyleSheet } from "react-native";
import React from "react";
import COLORS from "@/constants/Colors";

const CenteredCircle = () => {
  return (
    <View style={styles.container}>
      <View className="rounded-full" style={styles.circle}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    top: "-8%",
    left: "50%",
    width: 600,
    height: 610,
    backgroundColor: COLORS.orange,

    transform: [
      { translateX: -320 }, // Half of width
      { translateY: -250 }, // Half of height
    ],
  },
});

export default CenteredCircle;

import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import Elevations from "react-native-elevation";
// import ElevatedView from "react-native-elevated-view";

import colors from "../config/colors";

function AppButton({ color = "primary", width, height, borderRadius, style }) {
  return (
    <View
      style={[
        styles.button,
        { backgroundColor: colors[color], width: width, height: height, borderRadius: borderRadius },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    // justifyContent: "center",
    // alignItems: "center",
    // marginVertical: 10,
    // flexDirection: "row",
    // overflow: "visible",
    // ...Elevations[3],
    // elevation: 4,
  },
});

export default AppButton;

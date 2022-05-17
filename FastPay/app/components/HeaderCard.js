import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";

function HeaderCard({ color = "light", width, height, borderRadius = 12 }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors[color],
          width: width,
          height: height,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        },
      ]}
    ></View>
  );
}

const styles = StyleSheet.create({
  card: {
    // justifyContent: "center",
    // alignItems: "center",
    // marginVertical: 10,
    // flexDirection: "row",
    //elevation: 5,
    // position: "absolute",
  },
});

export default HeaderCard;

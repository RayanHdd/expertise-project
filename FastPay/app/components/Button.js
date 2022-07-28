import React from "react";
import { View } from "react-native";

import colors from "../config/colors";

function AppButton({ color = "primary", width, height, borderRadius, style }) {
  return <View style={[{ backgroundColor: colors[color], width: width, height: height, borderRadius: borderRadius }, style]} />;
}

export default AppButton;

import React from "react";
import { View } from "react-native";

import colors from "../config/colors";

function HeaderCard({ color = "light", width, height, borderRadius = 12 }) {
  return <View style={{ backgroundColor: colors[color], width: width, height: height, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }} />;
}

export default HeaderCard;

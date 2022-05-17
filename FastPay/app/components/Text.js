import React from "react";
import { Text } from "react-native";

import useFontLoader from "../hooks/useFontLoader";

function AppText({ text, color = "black", size, style }) {
  const loading = useFontLoader();
  if (loading === null)
    return (
      <Text style={[{ color: color, fontSize: size, fontFamily: "Dirooz", position: "absolute" }, style]}>{text}</Text>
    );
  return loading;
}

export default AppText;

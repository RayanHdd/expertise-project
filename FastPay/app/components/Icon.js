import React from "react";
import {
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Feather,
  SimpleLineIcons,
  Entypo,
  Ionicons,
  Fontisto,
  AntDesign,
} from "@expo/vector-icons";

function AppIcon({ family, name, size, color = "black", style }) {
  switch (family) {
    case "Ionicons":
      return <Ionicons name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "AntDesign":
      return <AntDesign name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "Fontisto":
      return <Fontisto name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "Entypo":
      return <Entypo name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "SimpleLineIcons":
      return <SimpleLineIcons name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "Feather":
      return <Feather name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "MaterialIcons":
      return <MaterialIcons name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "FontAwesome":
      return <FontAwesome name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "FontAwesome5":
      return <FontAwesome5 name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={name} color={color} size={size} style={[{ position: "absolute" }, style]} />;
    default:
      return null;
  }
}

export default AppIcon;

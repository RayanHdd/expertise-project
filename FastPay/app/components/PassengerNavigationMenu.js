import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Button, TouchableOpacity } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

import colors from "../config/colors";
import AppIcon from "./Icon";
import AppText from "./Text";

const PassengerNavigationMenu = ({ color = "light", width, height, borderRadius, active = "home", style }) => {
  // const [active, setActive] = useState("home");
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.navigationMenu,
        { backgroundColor: colors[color], width: width, height: height, borderRadius: borderRadius },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          console.log("salam");
          navigation.navigate("Settings");
        }}
      >
        <AppIcon
          family="MaterialIcons"
          name="settings"
          size={wp("7%")}
          color={active === "settings" ? colors.darkBlue : colors.secondary}
          style={{ left: wp("12%"), top: wp("1%"), position: "relative" }}
        />
        <AppText
          text="تنظیمات"
          size={wp("3%")}
          color={active === "settings" ? colors.darkBlue : colors.secondary}
          style={{ left: wp("10.5%"), top: wp("8%") }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          console.log("salam2");
          navigation.navigate("PassengerHome");
        }}
      >
        <View style={[styles.taxiIcon, { borderColor: active === "home" ? colors.darkBlue : colors.secondary }]}></View>
        <AppText
          text="کرایه"
          size={wp("3%")}
          color={active === "home" ? colors.darkBlue : colors.secondary}
          style={{ left: wp("43.4%"), bottom: "100%" }}
        />
        <Image
          source={require("../assets/images/taxi.png")}
          style={{
            width: wp("7.5%"),
            height: wp("7.5%"),
            left: wp("42.3%"),
            bottom: wp("8.5%"),
            opacity: active !== "home" ? 0.4 : 1.5,
          }}
        />
        <View style={styles.border}></View>
        <AppText
          text="پرداخت"
          size={wp("3%")}
          color={active === "home" ? colors.darkBlue : colors.secondary}
          style={{ left: wp("41.5%"), bottom: "8%" }}
        />
      </TouchableOpacity>

      <AppIcon
        family="FontAwesome5"
        name="money-check"
        size={wp("6%")}
        color={active === "transactions" ? colors.darkBlue : colors.secondary}
        style={{ right: wp("12%"), paddingBottom: wp("6%") }}
      />
      <AppText
        text="تراکنش ها"
        size={wp("2.8%")}
        color={active === "transactions" ? colors.darkBlue : colors.secondary}
        style={{ right: wp("10%"), paddingTop: "7%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    width: wp("22%"),
    height: wp("22%"),
    backgroundColor: null,
    left: wp("35%"),
    borderRadius: wp("11%"),
    borderColor: colors.medium,
    borderWidth: wp("1.8%"),
    bottom: "33%",
    position: "absolute",
  },
  taxiIcon: {
    width: wp("18%"),
    height: wp("18%"),
    backgroundColor: colors.light,
    left: wp("37%"),
    borderRadius: wp("9%"),
    borderWidth: wp("1%"),
    bottom: "42%",
    position: "absolute",
  },
  navigationMenu: {
    justifyContent: "center",
  },
});

export default PassengerNavigationMenu;

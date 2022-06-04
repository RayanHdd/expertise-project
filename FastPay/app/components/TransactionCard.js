import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import colors from "../config/colors";
import AppIcon from "./Icon";
import AppText from "./Text";

function TransactionCard({
  width,
  height,
  borderRadius,
  title,
  date,
  time,
  price,
  type,
  iconType,
  iconUrl = null,
  style,
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.secondary,
          width: width,
          height: height,
          borderRadius: borderRadius,
          shadowColor: colors.darkBlue,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 3,
        },
        style,
      ]}
    >
      {iconType === "rent" || iconType === "fastPay" ? (
        <Image
          style={{ width: wp("9%"), height: wp("10%"), left: wp("73.5%"), borderRadius: wp("6%") }}
          source={{ uri: iconUrl }}
        />
      ) : iconType === "wallet" ? (
        <AppIcon family="Ionicons" name="wallet-outline" size={wp("8%")} style={{ right: wp("4%") }} />
      ) : null}

      <AppText text={title} size={wp("3%")} style={{ right: wp("15%"), bottom: wp("9%") }} />
      <AppText
        text={time + "  -  " + date}
        size={wp("2.8%")}
        color={colors.darkBlue}
        style={{ right: wp("15%"), bottom: wp("4%") }}
      />
      <AppText text={price} size={wp("4%")} style={{ left: wp("15%") }} />
      {type === "plus" ? (
        <AppIcon family="Feather" name="plus" size={wp("3%")} style={{ left: wp("11.5%"), bottom: wp("6.8%") }} />
      ) : type === "minus" ? (
        <AppIcon family="Feather" name="minus" size={wp("3.2%")} style={{ left: wp("11.5%"), bottom: wp("6.8%") }} />
      ) : null}

      <AppText text="تومان" size={wp("2.7%")} color={colors.darkBlue} style={{ left: wp("3.5%") }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    margin: wp("2%"),
  },
});

export default TransactionCard;

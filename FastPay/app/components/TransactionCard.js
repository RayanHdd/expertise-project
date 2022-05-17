import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import colors from "../config/colors";
import AppIcon from "./Icon";
import AppText from "./Text";

function TransactionCard({ width, height, borderRadius, title, date, time, price, type, iconType, iconUrl, style }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.secondary, width: width, height: height, borderRadius: borderRadius },
        style,
      ]}
    >
      {iconType === "rent" || iconType === "fastPay" ? (
        <Image source={iconUrl} width={wp("10%")} height={wp("10%")} />
      ) : iconType === "wallet" ? (
        <AppIcon family="Ionicons" name="wallet-outline" size={wp("8%")} style={{ right: wp("4%") }} />
      ) : null}

      <AppText text={title} size={wp("3%")} style={{ right: wp("15%"), bottom: wp("9%") }} />
      <AppText
        text={time + "  -  " + date}
        size={wp("2.5%")}
        color={colors.darkBlue}
        style={{ right: wp("15%"), bottom: wp("4%") }}
      />
      <AppText text={price} size={wp("3%")} style={{ left: wp("15%") }} />
      {type === "plus" ? (
        <AppIcon family="Feather" name="plus" size={wp("3%")} style={{ left: wp("11.5%") }} />
      ) : type === "minus" ? (
        <AppIcon family="Feather" name="minus" size={wp("3%")} style={{ left: wp("11.5%") }} />
      ) : null}

      <AppText text="تومان" size={wp("2.7%")} color={colors.darkBlue} style={{ left: wp("3.5%") }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
  },
});

export default TransactionCard;

import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppIcon from "./Icon";
import AppText from "./Text";
import colors from "../config/colors";

function TransactionCard({ width, height, borderRadius, title, date, time, price, type, iconType, iconUrl = null, style }) {
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
      {iconType === "rent" ? (
        <Image
          style={{ width: wp("10%"), height: hp("6%"), borderRadius: hp("3.5%"), position: "absolute", right: wp("3.5%") }}
          source={{
            uri: iconUrl,
          }}
        />
      ) : iconType === "wallet" ? (
        <AppIcon family="Ionicons" name="wallet-outline" color={colors.darkBlue} size={hp("4.5%")} style={{ right: wp("3.5%") }} />
      ) : iconType === "fastPay" ? (
        <Image
          resizeMode="contain"
          style={{ width: wp("14%"), height: hp("18%"), borderRadius: hp("1.5%"), position: "absolute", right: wp("1.2%") }}
          source={require("../assets/images/logo.png")}
        />
      ) : null}

      <AppText text={title} size={hp("1.55%")} style={{ right: wp("16%"), bottom: hp("5.5%") }} />
      <AppText text={time + "  -  " + date} size={hp("1.5%")} color={colors.darkBlue} style={{ right: wp("16%"), bottom: hp("2%") }} />
      <AppText text={price} size={hp("1.8%")} style={{ left: wp("14%") }} />
      {type === "plus" ? (
        <AppIcon family="Feather" name="plus" size={wp("3%")} style={{ left: wp("11%"), top: hp("4.5%") }} />
      ) : type === "minus" ? (
        <AppIcon family="Feather" name="minus" size={wp("3.2%")} style={{ left: wp("11%"), bottom: hp("3.7%") }} />
      ) : null}

      <AppText text="تومان" size={hp("1.3%")} color={colors.darkBlue} style={{ left: wp("3.5%") }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    margin: wp("2%"),
  },
});

export default TransactionCard;

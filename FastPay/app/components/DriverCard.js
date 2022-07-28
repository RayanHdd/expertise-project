import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppIcon from "./Icon";
import AppText from "./Text";
import colors from "../config/colors";
import { convertToFarsiNumber, toFarsiNumber } from "../functions/helperFunctions";

function DriverCard({ width, height, borderRadius, name, acceptorCode, score, iconUrl, style }) {
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
      <Image style={{ width: wp("10%"), height: hp("6%"), right: wp("3.5%"), borderRadius: hp("4%"), position: "absolute" }} source={{ uri: iconUrl }} />

      <AppText text={name} size={hp("1.9%")} style={{ right: wp("16%"), bottom: hp("5.3%") }} />
      <AppText text={"کد پذیرنده : " + toFarsiNumber(acceptorCode)} size={hp("1.7%")} color={colors.darkBlue} style={{ right: wp("16%"), bottom: hp("2%") }} />
      <AppText text={convertToFarsiNumber(parseFloat(score).toFixed(2))} size={hp("2.2%")} color={colors.darkBlue} style={{ left: wp("10.6%") }} />
      <AppIcon family="AntDesign" name="star" size={hp("2.2%")} style={{ left: wp("5.5%"), bottom: hp("3.8%") }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    margin: wp("2%"),
  },
});

export default DriverCard;

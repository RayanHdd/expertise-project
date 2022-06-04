import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";

const OffendingReport = () => {
  const [offendingTxt, setOffendingTxt] = useState("");
  return (
    <>
      <AppIcon
        family="AntDesign"
        name="close"
        size={wp("5.5%")}
        color={colors.darkBlue}
        style={{ top: hp("1.5%"), right: wp("3.6%") }}
      />

      <AppText
        text="تخلف راننده را اینجا ثبت کنید."
        size={wp("3%")}
        color={colors.darkBlue}
        style={{ top: hp("7%"), right: wp("3.6%") }}
      />
      <AppText
        text="نتیجه پس از بررسی به شما اعلام می شود."
        size={wp("3%")}
        color={colors.darkBlue}
        style={{ right: "5%", top: hp("9.8%") }}
      />

      <TextInput
        value={offendingTxt}
        multiline={true}
        placeholder="جزئیات تخلف راننده را بنویسید."
        onKeyPress={({ nativeEvent: { key: keyValue } }) => {
          if (keyValue === "Backspace") {
            setOffendingTxt(offendingTxt.slice(0, offendingTxt.length - 1));
          }
        }}
        onChangeText={(txt) => {
          setOffendingTxt(txt);
        }}
        style={{
          width: "97%",
          height: "60%",
          padding: wp("3%"),
          borderRadius: wp("2%"),
          borderWidth: wp("0.2%"),
          borderColor: colors.darkBlue,
          backgroundColor: colors.light,
          textAlignVertical: "top",
          textAlign: "auto",
          fontSize: wp("3%"),
          color: colors.darkBlue,
          fontFamily: "Dirooz",
          marginTop: wp("20%"),
          shadowColor: colors.darkBlue,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 3,
        }}
      />
    </>
  );
};

export default OffendingReport;

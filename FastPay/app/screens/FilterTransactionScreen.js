import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import { gregorian_to_jalali } from "../functions/helperFunctions";
import PersianDatePicker from "react-native-persian-date-picker2";

const FilterTransactionScreen = ({ navigation }) => {
  const [todayDate, setTodayDate] = useState(null);
  const [datePickerVisibility, setDatePickerVisibility] = useState(false);
  const [datePickerVisibility2, setDatePickerVisibility2] = useState(false);
  const [selectedType, setSelectedType] = useState("trip");
  const [birthDate, setBirthDate] = useState({
    string: "",
    year: null,
    month: null,
    day: null,
  });
  const [birthDate2, setBirthDate2] = useState({
    string: "",
    year: null,
    month: null,
    day: null,
  });

  useEffect(() => {
    const today = new Date();
    console.log(today.getDate());
    const jalali = gregorian_to_jalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    console.log(jalali);
    setTodayDate(jalali);
  }, []);

  const onBirthDatePickerConfirm = (objVal) => {
    const dataString = objVal.value[0] + "/" + objVal.value[1] + "/" + objVal.value[2];
    setBirthDate({
      string: dataString,
      year: objVal.value[0],
      month: objVal.value[1],
      day: objVal.value[2],
    });
    setDatePickerVisibility(false);
    return true;
  };
  const onBirthDatePickerConfirm2 = (objVal) => {
    const dataString = objVal.value[0] + "/" + objVal.value[1] + "/" + objVal.value[2];
    setBirthDate2({
      string: dataString,
      year: objVal.value[0],
      month: objVal.value[1],
      day: objVal.value[2],
    });
    setDatePickerVisibility2(false);
    return true;
  };

  const toFarsiDigits = function (str) {
    return str.replace(/[0-9]/g, function (w) {
      var persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
      return persian[w];
    });
  };

  return (
    <>
      <AppText
        text="لطفا تاریخ و نوع تراکنش را انتخاب کنید :"
        size={wp("4%")}
        color={colors.darkBlue}
        style={{ top: hp("13%"), left: wp("16%") }}
      />

      <AppText text="از تاریخ" size={wp("3.2%")} color={colors.darkBlue} style={{ right: "8%", top: hp("22.5%") }} />

      <TouchableWithoutFeedback
        onPress={() => {
          setDatePickerVisibility(true);
          console.log(todayDate);
        }}
      >
        <View style={{ top: hp("22%"), left: wp("15%") }}>
          <AppButton
            width={wp("60%")}
            height={wp("8%")}
            borderRadius={wp("2%")}
            style={{ borderWidth: wp("0.3%"), borderColor: colors.darkBlue, backgroundColor: colors.light }}
          />
          <AppIcon
            family="Feather"
            name="calendar"
            color={colors.darkBlue}
            size={wp("5%")}
            style={{ right: wp("43%"), top: wp("1.2%") }}
          />
          <AppText
            text={
              birthDate.string === "" && todayDate !== null
                ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`)
                : toFarsiDigits(birthDate.string)
            }
            size={wp("3.5%")}
            color={colors.secondary}
            style={{ top: wp("1%"), left: wp("22%") }}
          />
        </View>
      </TouchableWithoutFeedback>

      <AppText text="تا تاریخ" size={wp("3.2%")} color={colors.darkBlue} style={{ right: "8%", top: hp("28%") }} />

      <TouchableWithoutFeedback
        onPress={() => {
          setDatePickerVisibility2(true);
        }}
      >
        <View style={{ top: hp("23%"), left: wp("15%") }}>
          <AppButton
            width={wp("60%")}
            height={wp("8%")}
            borderRadius={wp("2%")}
            style={{ borderWidth: wp("0.3%"), borderColor: colors.darkBlue, backgroundColor: colors.light }}
          />
          <AppIcon
            family="Feather"
            name="calendar"
            color={colors.darkBlue}
            size={wp("5%")}
            style={{ right: wp("43%"), top: wp("1.2%") }}
          />
          <AppText
            text={
              birthDate2.string === "" && todayDate !== null
                ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`)
                : toFarsiDigits(birthDate2.string)
            }
            size={wp("3.5%")}
            color={colors.secondary}
            style={{ top: wp("1%"), left: wp("22%") }}
          />
        </View>
      </TouchableWithoutFeedback>

      {todayDate !== null && (
        <PersianDatePicker
          visible={datePickerVisibility || datePickerVisibility2}
          onConfirm={datePickerVisibility ? onBirthDatePickerConfirm : onBirthDatePickerConfirm2}
          startYear={1400}
          endYear={1402}
          containerStyle={{
            backgroundColor: colors.light,
            height: hp("55%"),
            borderRadius: wp("4%"),
            margin: wp("0.3%"),
          }}
          pickercontainerStyle={{
            backgroundColor: colors.medium,
            borderRadius: wp("3%"),
            margin: wp("0.5%"),
          }}
          pickerWrapperStyle={{}}
          pickerItemStyle={{}}
          submitTextStyle={{ fontFamily: "Dirooz", color: colors.light }}
          submitStyle={{ backgroundColor: colors.darkBlue, top: hp("10%") }}
          defaultValue={
            todayDate !== null
              ? [parseInt(todayDate[0]), parseInt(todayDate[1]), parseInt(todayDate[2])]
              : gregorian_to_jalali(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
          }
        />
      )}

      <View style={{ flexDirection: "row" }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedType("trip");
          }}
        >
          <View style={{ top: hp("27%"), left: wp("20%"), opacity: selectedType === "trip" ? 1 : 0.3 }}>
            <AppButton
              width={wp("15.5%")}
              height={wp("15.5%")}
              borderRadius={wp("6%")}
              style={{ borderWidth: wp("0.5%"), borderColor: colors.darkBlue, backgroundColor: colors.light }}
            />
            <Image
              source={require("../assets/images/taxi.png")}
              style={{
                width: wp("8%"),
                height: wp("8%"),
                left: wp("3.8%"),
                bottom: wp("11.3%"),
              }}
            />
            <AppText text="کرایه تاکسی" size={wp("3%")} color={colors.darkBlue} style={{ top: wp("16%") }} />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedType("wallet");
          }}
        >
          <View style={{ top: hp("27%"), left: wp("27%"), opacity: selectedType === "wallet" ? 1 : 0.3 }}>
            <AppButton
              width={wp("15.5%")}
              height={wp("15.5%")}
              borderRadius={wp("6%")}
              style={{ borderWidth: wp("0.5%"), borderColor: colors.darkBlue }}
            />
            <AppIcon
              family="SimpleLineIcons"
              name="wallet"
              color={colors.darkBlue}
              size={wp("7%")}
              style={{ left: wp("4.1%"), bottom: wp("11.7%") }}
            />
            <AppText text="افزایش اعتبار" size={wp("3%")} color={colors.darkBlue} style={{ top: wp("16%") }} />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedType("app");
          }}
        >
          <View style={{ top: hp("27%"), left: wp("34%"), opacity: selectedType === "app" ? 1 : 0.3 }}>
            <AppButton
              width={wp("15.5%")}
              height={wp("15.5%")}
              borderRadius={wp("6%")}
              style={{ borderWidth: wp("0.5%"), borderColor: colors.darkBlue, backgroundColor: colors.light }}
            />
            <Image
              source={require("../assets/images/logo.png")}
              style={{
                width: wp("13%"),
                height: wp("8%"),
                left: wp("1%"),
                bottom: wp("11.8%"),
                resizeMode: "center",
              }}
            />
            <AppText
              text="برنامه ای"
              size={wp("3.2%")}
              color={colors.darkBlue}
              style={{ top: wp("15.5%"), left: wp("2%") }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Transactions");
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: wp("20%"),
            height: hp("7%"),
            top: hp("30%"),
            borderRadius: wp("3%"),
            backgroundColor: colors.secondary,
            left: wp("25%"),
            shadowColor: colors.darkBlue,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            elevation: wp("2%"),
          }}
        >
          <AppButton width="30%" height="20%" color="secondary" borderRadius={wp("3%")} />
          <AppText text="انصراف" size={wp("3.5%")} color={colors.darkBlue} style={{}} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Transactions", {
              startDate:
                birthDate.string === "" && todayDate !== null
                  ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`)
                  : toFarsiDigits(birthDate.string),
              endDate:
                birthDate2.string === "" && todayDate !== null
                  ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`)
                  : toFarsiDigits(birthDate2.string),
              type: selectedType,
            });
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: wp("20%"),
            height: hp("7%"),
            top: hp("30%"),
            borderRadius: wp("3%"),
            backgroundColor: colors.primary,
            shadowColor: colors.darkBlue,
            elevation: wp("2%"),
            right: wp("25%"),
          }}
        >
          <AppButton width="30%" height="20%" borderRadius={wp("3%")} />
          <AppText text="تایید" size={wp("3.6%")} color={colors.darkBlue} style={{ left: wp("7%") }} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FilterTransactionScreen;

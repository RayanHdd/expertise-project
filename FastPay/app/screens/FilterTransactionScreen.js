import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import PersianDatePicker from "react-native-persian-date-picker2";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import { gregorian_to_jalali, toFarsiDigits } from "../functions/helperFunctions";

const FilterTransactionScreen = ({ navigation }) => {
  const [todayDate, setTodayDate] = useState(null);
  const [datePickerVisibility, setDatePickerVisibility] = useState(false);
  const [datePickerVisibility2, setDatePickerVisibility2] = useState(false);
  const [selectedType, setSelectedType] = useState("rent");
  const [filterStartDate, setFilterStartDate] = useState({
    string: "",
    year: null,
    month: null,
    day: null,
  });
  const [filterEndDate, setFilterEndDate] = useState({
    string: "",
    year: null,
    month: null,
    day: null,
  });

  useEffect(() => {
    const today = new Date();
    const jalali = gregorian_to_jalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    setTodayDate(jalali);
  }, []);

  const onStartDatePickerConfirm = (objVal) => {
    const dataString = objVal.value[0] + "/" + objVal.value[1] + "/" + objVal.value[2];
    setFilterStartDate({
      string: dataString,
      year: objVal.value[0],
      month: objVal.value[1],
      day: objVal.value[2],
    });
    setDatePickerVisibility(false);
    return true;
  };
  const onEndDatePickerConfirm = (objVal) => {
    const dataString = objVal.value[0] + "/" + objVal.value[1] + "/" + objVal.value[2];
    setFilterEndDate({
      string: dataString,
      year: objVal.value[0],
      month: objVal.value[1],
      day: objVal.value[2],
    });
    setDatePickerVisibility2(false);
    return true;
  };

  return (
    <>
      <AppText text="لطفا تاریخ و نوع تراکنش را انتخاب کنید :" size={hp("2.1%")} color={colors.darkBlue} style={{ top: hp("12%"), alignSelf: "center" }} />

      <AppText text="از تاریخ" size={hp("2%")} color={colors.darkBlue} style={{ right: "8%", top: hp("22.3%") }} />
      <TouchableWithoutFeedback
        onPress={() => {
          setDatePickerVisibility(true);
        }}
      >
        <View style={{ top: hp("22%"), justifyContent: "center", alignSelf: "center", right: wp("6%"), marginBottom: hp("1.5%") }}>
          <AppButton width={wp("60%")} height={hp("5%")} borderRadius={hp("0.9%")} style={{ borderWidth: hp("0.2%"), borderColor: colors.darkBlue, backgroundColor: colors.light }} />
          <AppIcon family="Feather" name="calendar" color={colors.darkBlue} size={hp("2.7%")} style={{ right: wp("3.3%") }} />
          <AppText
            text={filterStartDate.string === "" && todayDate !== null ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`) : toFarsiDigits(filterStartDate.string)}
            size={hp("2%")}
            color={colors.secondary}
            style={{ alignSelf: "center" }}
          />
        </View>
      </TouchableWithoutFeedback>

      <AppText text="تا تاریخ" size={hp("2%")} color={colors.darkBlue} style={{ right: "8%", top: hp("29.7%") }} />
      <TouchableWithoutFeedback
        onPress={() => {
          setDatePickerVisibility2(true);
        }}
      >
        <View style={{ top: hp("23%"), justifyContent: "center", alignSelf: "center", right: wp("6%"), marginBottom: hp("2.5%") }}>
          <AppButton width={wp("60%")} height={hp("5%")} borderRadius={hp("0.9%")} style={{ borderWidth: hp("0.2%"), borderColor: colors.darkBlue, backgroundColor: colors.light }} />
          <AppIcon family="Feather" name="calendar" color={colors.darkBlue} size={hp("2.7%")} style={{ right: wp("3.3%") }} />
          <AppText
            text={filterEndDate.string === "" && todayDate !== null ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`) : toFarsiDigits(filterEndDate.string)}
            size={hp("2%")}
            color={colors.secondary}
            style={{ alignSelf: "center" }}
          />
        </View>
      </TouchableWithoutFeedback>

      {todayDate !== null && (
        <PersianDatePicker
          visible={datePickerVisibility || datePickerVisibility2}
          onConfirm={datePickerVisibility ? onStartDatePickerConfirm : onEndDatePickerConfirm}
          startYear={1400}
          endYear={1402}
          containerStyle={{
            backgroundColor: colors.medium,
            height: wp("76%"),
            borderRadius: wp("4%"),
            alignItems: "center",
            justifyContent: "center",
            top: hp("5%"),
          }}
          pickercontainerStyle={{
            backgroundColor: colors.light,
            borderRadius: wp("3%"),
            marginLeft: wp("6%"),
            marginRight: wp("6%"),
            position: "absolute",
          }}
          submitTextStyle={{ fontFamily: "Dirooz", color: "white", fontSize: hp("2.4%") }}
          submitStyle={{
            position: "absolute",
            backgroundColor: colors.darkBlue,
            width: wp("70%"),
            height: hp("8%"),
            bottom: hp("3.2%"),
            shadowColor: colors.darkBlue,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            elevation: wp("1%"),
          }}
          defaultValue={
            todayDate !== null
              ? [parseInt(todayDate[0]), parseInt(todayDate[1]), parseInt(todayDate[2])]
              : gregorian_to_jalali(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
          }
        />
      )}

      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedType("rent");
        }}
      >
        <View style={{ top: hp("40%"), left: wp("18%"), position: "absolute", justifyContent: "center", alignSelf: "center", opacity: selectedType === "rent" ? 1 : 0.3 }}>
          <AppButton width={hp("8%")} height={hp("8%")} color="light" borderRadius={hp("2.4%")} style={{ borderWidth: hp("0.3%"), borderColor: colors.darkBlue }} />
          <Image
            source={require("../assets/images/taxi.png")}
            style={{
              width: wp("8%"),
              height: wp("8%"),
              alignSelf: "center",
              position: "absolute",
            }}
          />
          <AppText text="کرایه تاکسی" size={hp("1.5%")} color={colors.darkBlue} style={{ top: hp("8%") }} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedType("wallet");
        }}
      >
        <View style={{ top: hp("40%"), justifyContent: "center", position: "absolute", alignSelf: "center", opacity: selectedType === "wallet" ? 1 : 0.3 }}>
          <AppButton width={hp("8%")} height={hp("8%")} borderRadius={hp("2.4%")} style={{ borderWidth: hp("0.3%"), borderColor: colors.darkBlue }} />
          <AppIcon family="SimpleLineIcons" name="wallet" color={colors.darkBlue} size={hp("3.5%")} style={{ alignSelf: "center" }} />
          <AppText text="افزایش اعتبار" size={hp("1.4%")} color={colors.darkBlue} style={{ top: hp("8.2%"), alignSelf: "center" }} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedType("fastPay");
        }}
      >
        <View style={{ top: hp("40%"), justifyContent: "center", position: "absolute", alignSelf: "center", right: wp("18%"), opacity: selectedType === "fastPay" ? 1 : 0.3 }}>
          <AppButton width={hp("8%")} color="light" height={hp("8%")} borderRadius={hp("2.4%")} style={{ borderWidth: hp("0.3%"), borderColor: colors.darkBlue }} />
          <Image
            source={require("../assets/images/logo.png")}
            style={{
              width: wp("15%"),
              height: hp("8%"),
              alignSelf: "center",
              position: "absolute",
              resizeMode: "center",
            }}
          />
          <AppText text="برنامه ای" size={hp("1.5%")} color={colors.darkBlue} style={{ top: hp("8%"), alignSelf: "center" }} />
        </View>
      </TouchableWithoutFeedback>

      <View style={{ flexDirection: "row" }}>
        {!datePickerVisibility && !datePickerVisibility2 && (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: wp("25%"),
              height: hp("8%"),
              top: hp("50%"),
              left: wp("20%"),
              borderRadius: hp("1%"),
              backgroundColor: colors.secondary,
              shadowColor: colors.darkBlue,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              elevation: 3,
            }}
          >
            <AppButton width="30%" height="20%" color="secondary" borderRadius={hp("1%")} />
            <AppText text="انصراف" size={hp("2.1%")} color={colors.darkBlue} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}></View>

        {!datePickerVisibility && !datePickerVisibility2 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Transactions", {
                startDate: filterStartDate.string === "" && todayDate !== null ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`) : toFarsiDigits(filterStartDate.string),
                endDate: filterEndDate.string === "" && todayDate !== null ? toFarsiDigits(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`) : toFarsiDigits(filterEndDate.string),
                type: selectedType,
              });
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: wp("25%"),
              height: hp("8%"),
              top: hp("50%"),
              borderRadius: hp("1%"),
              backgroundColor: colors.primary,
              shadowColor: colors.darkBlue,
              elevation: 3,
              right: wp("20%"),
            }}
          >
            <AppButton width="30%" height="20%" borderRadius={hp("1%")} />
            <AppText text="تایید" size={hp("2.2%")} color={colors.darkBlue} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default FilterTransactionScreen;

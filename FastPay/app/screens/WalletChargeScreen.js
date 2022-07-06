import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import HeaderCard from "../components/HeaderCard";
import { manipulateData, fetchData } from "../functions/db_functions";
import { readData } from "../functions/storage_functions";
import storage_keys from "../constants/storage_keys";
import { toFarsiNumber, toEnglishNumber, trimMoney } from "../functions/helperFunctions";

const TOOMAN = "  تومان";
const db = SQLite.openDatabase("db.database"); // returns Database object

const WalletChargeScreen = ({ navigation, route }) => {
  const [value, setValue] = useState("۰");
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const { currentWalletCharge } = route.params;
  const [passengerId, setPassengerId] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const grabData = async () => {
      const phone_number = await readData(AsyncStorage, storage_keys.PHONE_NUMBER);
      const passenger_id = await fetchData(db, db_queries.GET_PASSENGER_ID_BY_PHONE_NUMBER, [phone_number]);
      setPassengerId(passenger_id[0].passenger_id);
      if (phone_number !== null) setUserPhoneNumber(phone_number);

      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        "-" +
        today.getHours() +
        "-" +
        today.getMinutes() +
        "-" +
        today.getSeconds();
      setDate(date);
    };
    grabData().catch(console.error);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText
            text="افزایش اعتبار کیف پول"
            size={hp("2.1%")}
            color={colors.darkBlue}
            style={{ bottom: hp("3.2%") }}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PassengerHome");
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon
              family="Ionicons"
              name="arrow-back"
              color={colors.darkBlue}
              size={hp("3.5%")}
              style={{ position: "relative", marginRight: wp("80%"), marginTop: hp("2.5%") }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.06 }} />

        <View style={styles.title}>
          <AppText text="مبلغ مورد نظر خود را به تومان وارد کنید." size={hp("1.8%")} color={colors.darkBlue} />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={{ position: "absolute", right: wp("67.5%"), justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setValue("۵۰۰۰۰");
            }}
          >
            <AppButton width={wp("23%")} height={hp("6%")} borderRadius={wp("8%")} color="secondary" />
            <AppText text="۵۰٬۰۰۰ تومان" size={hp("1.5%")} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", right: wp("38%"), justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setValue("۲۵۰۰۰");
            }}
          >
            <AppButton width={wp("23%")} height={hp("6%")} borderRadius={wp("8%")} color="secondary" />
            <AppText text="۲۵٬۰۰۰ تومان" size={hp("1.5%")} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", right: wp("8%"), justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setValue("۱۰۰۰۰");
            }}
          >
            <AppButton width={wp("23%")} height={hp("6%")} borderRadius={wp("8%")} color="secondary" />
            <AppText text="۱۰٬۰۰۰ تومان" size={hp("1.5%")} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.04 }} />
        <View style={styles.input}>
          <TextInput
            value={trimMoney(value) + TOOMAN}
            keyboardType="numeric"
            selectionColor={colors.darkBlue}
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue === "Backspace") {
                setValue(value.slice(0, value.length - 1));
              }
            }}
            onChangeText={(money) => {
              if (value !== "۰") setValue(value + toFarsiNumber(money));
              else setValue(toFarsiNumber(money));
            }}
            style={{
              width: "75%",
              height: "100%",
              borderRadius: wp("3%"),
              borderWidth: hp("0.2%"),
              borderColor: colors.darkBlue,
              backgroundColor: colors.light,
              textAlign: "center",
              fontSize: hp("2.5%"),
              color: colors.darkBlue,
              fontFamily: "Dirooz",
            }}
          />
        </View>
        <View style={{ flex: 0.5 }} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            manipulateData(
              db,
              db_queries.EDIT_PASSENGER_WALLET_CHARGE_BY_PHONE_NUMBER,
              [parseInt(toEnglishNumber(value)) + parseInt(currentWalletCharge), userPhoneNumber],
              "موجودی کیف پول به روز رسانی شد",
              "خطا در به روز رسانی کیف پول"
            );
            manipulateData(db, db_queries.INSERT_TRANSACTION, [
              "wallet",
              parseInt(toEnglishNumber(value)),
              date,
              null,
              null,
              "True",
              passengerId,
              null,
            ]);
            navigation.navigate("PassengerHome");
          }}
        >
          <AppButton width={wp("75%")} height="100%" borderRadius={wp("3.5%")} />
          <AppText text="ادامه" size={hp("2.6%")} />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0.07,
    width: wp("75%"),
    height: "100%",
    borderRadius: wp("3.5%"),
    left: wp("12.5%"),
    bottom: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  input: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flex: 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  header: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    flex: 0.07,
    alignItems: "center",
  },
});

export default WalletChargeScreen;

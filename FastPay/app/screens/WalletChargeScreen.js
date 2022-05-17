import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity, TextInput } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import PassengerNavigationMenu from "../components/PassengerNavigationMenu";
import TransactionCard from "../components/TransactionCard";
import db_queries from "../constants/db_queries";
import { manipulateData } from "../functions/db_functions";
import { toFarsiNumber, toEnglishNumber } from "../functions/helperFunctions";
import storage_keys from "../constants/storage_keys";
import { readData } from "../functions/storage_functions";

const TOOMAN = "  تومان";
const db = SQLite.openDatabase("db.database"); // returns Database object

const WalletChargeScreen = ({ navigation, route }) => {
  const [value, setValue] = useState("۰");
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const { currentWalletCharge } = route.params;

  useEffect(() => {
    const grabData = async () => {
      const data = await readData(AsyncStorage, storage_keys.PHONE_NUMBER);
      if (data !== null) setUserPhoneNumber(data);
    };
    grabData().catch(console.error);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="افزایش اعتبار کیف پول" size={wp("4%")} color={colors.darkBlue} />

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
              size={wp("7%")}
              style={{ position: "relative", marginRight: wp("80%"), marginTop: wp("2.5%") }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.06 }} />

        <View style={styles.title}>
          <AppText text="مبلغ مورد نظر خود را به تومان وارد کنید." size={wp("3.5%")} color={colors.darkBlue} />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={{ position: "absolute", right: wp("67.5%"), justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setValue("۵۰۰۰۰");
            }}
          >
            <AppButton width={wp("23%")} height={wp("11%")} borderRadius={wp("8%")} color="secondary" />
            <AppText text="۵۰٬۰۰۰ تومان" size={wp("2.8%")} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", right: wp("38%"), justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setValue("۲۵۰۰۰");
            }}
          >
            <AppButton width={wp("23%")} height={wp("11%")} borderRadius={wp("8%")} color="secondary" />
            <AppText text="۲۵٬۰۰۰ تومان" size={wp("2.8%")} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", right: wp("8%"), justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              setValue("۱۰۰۰۰");
            }}
          >
            <AppButton width={wp("23%")} height={wp("11%")} borderRadius={wp("8%")} color="secondary" />
            <AppText text="۱۰٬۰۰۰ تومان" size={wp("2.8%")} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.04 }} />
        <View style={styles.input}>
          <TextInput
            value={value + TOOMAN}
            keyboardType="numeric"
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              console.log(keyValue);
              if (keyValue === "Backspace") {
                // setValue("۰");
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
              borderWidth: wp("0.2%"),
              borderColor: colors.darkBlue,
              backgroundColor: colors.light,
              textAlign: "center",
              color: colors.darkBlue,
              fontFamily: "Dirooz",
            }}
          />
        </View>
        <View style={{ flex: 0.53 }} />

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
            navigation.navigate("PassengerHome");
          }}
        >
          <AppButton width={wp("70%")} height="100%" borderRadius={wp("3.5%")} />
          <AppText text="ادامه" size={wp("4.5%")} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0.07,
    bottom: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
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
  },
  title: {
    flex: 0.07,
    alignItems: "center",
  },
});

export default WalletChargeScreen;

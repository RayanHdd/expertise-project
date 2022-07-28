import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image, Platform, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import { toFarsiNumber, toEnglishNumber, trimMoney } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object
const TOOMAN = "  تومان";

const PaymentScreen = ({ navigation, route }) => {
  const { acceptor_code, wallet_charge, passenger_phone } = route.params;
  const [car, setCar] = useState("");
  const [first, setfirst] = useState("");
  const [last, setLast] = useState("");
  const [driverId, setDriverId] = useState(null);
  const [passengerId, setPassengerId] = useState(null);
  const [tripCost, setTripCost] = useState("۰");
  const [count, setCount] = useState("۱");
  const [date, setDate] = useState(null);
  const [driverImage, setDriverImage] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const grabData = async () => {
      const driver_info = await fetchData(db, db_queries.FETCH_DRIVER_INFO_BY_CODE, [parseInt(toEnglishNumber(acceptor_code))]);
      const passenger_id = await fetchData(db, db_queries.GET_PASSENGER_ID_BY_PHONE_NUMBER, [passenger_phone]);
      setCar(driver_info[0].driver_carModel);
      setfirst(driver_info[0].driver_firstName);
      setLast(driver_info[0].driver_lastName);
      setDriverId(driver_info[0].driver_id);
      setPassengerId(passenger_id[0].passenger_id);
      setDriverImage(driver_info[0].driver_imageUrl);

      const today = new Date();
      const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
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
          <AppText text="پرداخت هزینه سفر" size={hp("2.2%")} color={colors.darkBlue} style={{ top: wp("10%") }} />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PassengerHome");
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("4%")} style={{ position: "relative", marginRight: wp("79%"), marginTop: wp("5%") }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.04 }} />

        <View style={styles.image}>
          <Image
            style={{ width: hp("11%"), height: hp("11%"), borderRadius: hp("6%") }}
            source={{
              uri: driverImage,
            }}
          />
          <View
            style={{
              width: hp("12%"),
              height: hp("12%"),
              top: wp("-1%"),
              borderRadius: wp("15%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.3%"),
              backgroundColor: null,
              position: "absolute",
              opacity: 0.5,
            }}
          />
        </View>

        <View style={{ flex: 0.01 }} />

        <View style={styles.card}>
          <View style={{ width: "90%", height: "95%", backgroundColor: colors.light, borderRadius: wp("1.5%") }}>
            <AppText text="نام راننده" size={hp("1.9%")} style={{ right: wp("5%"), top: wp("3%") }} />
            <AppText text={`${first} ${last}`} size={hp("1.9%")} style={{ left: wp("5%"), top: wp("3%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: wp("11%"),
                opacity: 0.5,
              }}
            />
            <AppText text="خودرو" size={hp("1.9%")} style={{ right: wp("5%"), top: hp("6.5%") }} />
            <AppText text={`${car}`} size={hp("1.9%")} style={{ left: wp("5%"), top: hp("6.5%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("11%"),
                opacity: 0.5,
              }}
            />
            <AppText text="کد پذیرنده" size={hp("1.9%")} style={{ right: wp("5%"), top: hp("11.2%") }} />
            <AppText text={acceptor_code} size={hp("1.9%")} style={{ left: wp("5%"), top: hp("11.2%") }} />
          </View>
        </View>

        <View style={{ flex: 0.02 }} />

        <View style={styles.title}>
          <AppText text="تعداد مسافران" size={hp("2%")} style={{ right: wp("10%") }} />

          <TouchableOpacity
            onPress={() => {
              if (count !== "۱") setCount(toFarsiNumber(parseInt(toEnglishNumber(count)) - 1));
            }}
            style={{ alignItems: "center", justifyContent: "center", right: wp("30%") }}
          >
            <AppButton
              width={wp("10%")}
              height="80%"
              color="secondary"
              style={{
                borderTopLeftRadius: wp("2%"),
                borderBottomLeftRadius: wp("2%"),
              }}
            />
            <AppIcon family="Feather" name="minus" size={wp("5%")} style={{}} />
          </TouchableOpacity>

          <AppButton
            width={wp("8%")}
            height="80%"
            color="light"
            style={{
              position: "absolute",
              left: wp("21%"),
            }}
          />
          <AppText text={count} size={hp("2.3%")} color={colors.darkBlue} style={{ left: wp("23.85%") }} />
          <TouchableOpacity
            onPress={() => {
              setCount(toFarsiNumber(parseInt(toEnglishNumber(count)) + 1));
            }}
            style={{ alignItems: "center", justifyContent: "center", right: wp("20%") }}
          >
            <AppButton
              width={wp("10%")}
              height="80%"
              style={{
                borderBottomRightRadius: wp("2%"),
                borderTopRightRadius: wp("2%"),
              }}
            />
            <AppIcon family="Feather" name="plus" color={colors.darkBlue} size={wp("5%")} style={{}} />
          </TouchableOpacity>
        </View>

        <View style={styles.title}>
          <AppText text="مبدا" size={hp("2%")} style={{ right: wp("10%") }} />
          <TextInput
            value={source}
            selectionColor={colors.darkBlue}
            onChangeText={(txt) => {
              setSource(txt);
            }}
            placeholder="مبدا را وارد کنید"
            style={{
              width: "60%",
              height: "80%",
              borderRadius: wp("2%"),
              borderColor: colors.darkBlue,
              borderWidth: hp("0.15%"),
              color: colors.darkBlue,
              fontSize: hp("1.6%"),
              backgroundColor: colors.light,
              right: wp("10%"),
              textAlign: "center",
              fontFamily: "Dirooz",
            }}
          />
        </View>
        <View style={styles.title}>
          <AppText text="مقصد" size={hp("2%")} style={{ right: wp("10%") }} />
          <TextInput
            value={destination}
            selectionColor={colors.darkBlue}
            onChangeText={(txt) => {
              setDestination(txt);
            }}
            placeholder="مقصد را وارد کنید"
            style={{
              width: "60%",
              height: "80%",
              borderRadius: wp("2%"),
              fontSize: hp("1.6%"),
              color: colors.darkBlue,
              backgroundColor: colors.light,
              borderColor: colors.darkBlue,
              borderWidth: hp("0.15%"),
              textAlign: "center",
              right: wp("10%"),
              fontFamily: "Dirooz",
            }}
          />
        </View>
        <View style={styles.title}>
          <AppText text="مبلغ کرایه" size={hp("1.8%")} style={{ right: wp("10%") }} />
          <TextInput
            value={trimMoney(tripCost) + TOOMAN}
            keyboardType="numeric"
            selectionColor={colors.darkBlue}
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue === "Backspace") {
                setTripCost(tripCost.slice(0, tripCost.length - 1));
              }
            }}
            onChangeText={(money) => {
              if (tripCost !== "۰") setTripCost(tripCost + toFarsiNumber(money));
              else setTripCost(toFarsiNumber(money));
            }}
            style={{
              width: "60%",
              height: "80%",
              borderRadius: wp("2%"),
              fontSize: hp("1.8%"),
              color: colors.darkBlue,
              backgroundColor: colors.light,
              borderColor: colors.darkBlue,
              borderWidth: hp("0.15%"),
              textAlign: "center",
              right: wp("10%"),
              fontFamily: "Dirooz",
            }}
          />
        </View>

        <View style={{ flex: 0.165 }} />

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PassengerHome");
            }}
            style={styles.cancelBtn}
          >
            <AppButton width="30%" height="100%" color="secondary" borderRadius={wp("3%")} />
            <AppText text="انصراف" size={hp("2.2%")} color={colors.darkBlue} style={{ right: wp("13%") }} />
            <AppIcon family="MaterialIcons" name="cancel" color={colors.darkBlue} size={hp("3%")} style={{ left: wp("22%") }} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>

          <TouchableOpacity
            onPress={() => {
              let sourceNull = false;
              let destinationNull = false;
              let costNull = false;

              if (source === null || source.length === 0) {
                sourceNull = true;
              }
              if (destination === null || destination.length === 0) {
                destinationNull = true;
              }
              if (tripCost === null || tripCost === "۰" || tripCost.length === 0) {
                costNull = true;
              }
              if (sourceNull || destinationNull || costNull)
                toast.show("لطفا موارد خواسته شده را وارد کنید", {
                  type: "normal",
                  duration: 3000,
                });
              else {
                if (parseInt(wallet_charge) < parseInt(toEnglishNumber(tripCost))) {
                  toast.show("موجودی کیف پول ناکافی است", {
                    type: "normal",
                    duration: 3000,
                  });
                } else {
                  manipulateData(
                    db,
                    db_queries.INSERT_TRANSACTION,
                    ["rent", parseInt(toEnglishNumber(tripCost)), date, source, destination, parseInt(toEnglishNumber(count)), "False", passengerId, driverId],
                    "تراکنش برای تایید راننده ارسال شد",
                    "خطا در ارسال تراکنش"
                  );
                  navigation.navigate("PassengerHome");
                }
              }
            }}
            style={styles.payBtn}
          >
            <AppButton width="30%" height="100%" borderRadius={wp("3%")} />
            <AppText text="پرداخت" size={hp("2.1%")} color={colors.darkBlue} style={{ left: wp("6%") }} />
            <AppIcon family="SimpleLineIcons" name="wallet" color={colors.darkBlue} size={hp("3%")} style={{ left: wp("22%") }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.05 }} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    borderRadius: wp("3%"),
    backgroundColor: colors.secondary,
    left: wp("12%"),
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  payBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    borderRadius: wp("3%"),
    backgroundColor: colors.primary,
    shadowColor: colors.darkBlue,
    right: wp("12%"),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  card: {
    flex: 0.17,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flex: 0.075,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    flex: 0.0625,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  header: {
    flex: 0.09,
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
    elevation: 3,
  },
  image: {
    flex: 0.13,
    alignItems: "center",
  },
});

export default PaymentScreen;

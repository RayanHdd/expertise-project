import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import * as SQLite from "expo-sqlite";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import { toFarsiNumber, toEnglishNumber } from "../functions/helperFunctions";

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

  useEffect(() => {
    const grabData = async () => {
      const data = await fetchData(db, db_queries.FETCH_DRIVER_INFO_BY_CODE, [toEnglishNumber(acceptor_code)]);
      const data2 = await fetchData(db, db_queries.GET_PASSENGER_ID_BY_PHONE_NUMBER, [passenger_phone]);
      console.log(data);
      console.log(data2);
      setCar(data[0].driver_carModel);
      setfirst(data[0].driver_firstName);
      setLast(data[0].driver_lastName);
      setDriverId(data[0].driver_id);
      setPassengerId(data2[0].passenger_id);
      setDriverImage(data[0].driver_imageUrl);

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
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="پرداخت هزینه سفر" size={wp("4%")} color={colors.darkBlue} style={{ top: wp("10%") }} />

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
              style={{ position: "relative", marginRight: wp("80%"), marginTop: wp("5%") }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.04 }} />

        <View style={styles.image}>
          <Image
            style={{ width: wp("20%"), height: wp("20%"), borderRadius: wp("15%") }}
            // source={require("../assets/images/driver_123456.jpeg")}
            source={{
              uri: driverImage,
            }}
          />
          <View
            style={{
              width: wp("22.5%"),
              height: wp("22.5%"),
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
            <AppText text="نام راننده" size={wp("3%")} style={{ right: wp("5%"), top: wp("3%") }} />
            <AppText text={`${first} ${last}`} size={wp("3%")} style={{ left: wp("5%"), top: wp("3%") }} />
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
            <AppText text="خودرو" size={wp("3%")} style={{ right: wp("5%"), top: wp("12%") }} />
            <AppText text={`${car}`} size={wp("3%")} style={{ left: wp("5%"), top: wp("12%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: wp("20%"),
                opacity: 0.5,
              }}
            />
            <AppText text="کد پذیرنده" size={wp("3%")} style={{ right: wp("5%"), top: wp("22%") }} />
            <AppText text={acceptor_code} size={wp("3%")} style={{ left: wp("5%"), top: wp("22%") }} />
          </View>
        </View>

        <View style={{ flex: 0.02 }} />

        <View style={styles.title}>
          <AppText text="تعداد مسافران" size={wp("3.5%")} style={{ right: wp("10%") }} />

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
          <AppText text={count} size={wp("4.5%")} color={colors.darkBlue} style={{ left: wp("23.85%") }} />
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
          <AppText text="مبدا" size={wp("3.5%")} style={{ right: wp("10%") }} />
          <TextInput
            placeholder="مبدا را وارد کنید"
            style={{
              width: "60%",
              height: "80%",
              borderRadius: wp("2%"),
              color: colors.darkBlue,
              fontSize: wp("3%"),
              backgroundColor: colors.light,
              paddingRight: wp("21%"),
              right: wp("10%"),
              fontFamily: "Dirooz",
            }}
          />
        </View>
        <View style={styles.title}>
          <AppText text="مقصد" size={wp("3.5%")} style={{ right: wp("10%") }} />
          <TextInput
            placeholder="مقصد را وارد کنید"
            style={{
              width: "60%",
              height: "80%",
              borderRadius: wp("2%"),
              fontSize: wp("3%"),
              color: colors.darkBlue,
              backgroundColor: colors.light,
              paddingRight: wp("20%"),
              right: wp("10%"),
              fontFamily: "Dirooz",
            }}
          />
        </View>
        <View style={styles.title}>
          <AppText text="مبلغ کرایه" size={wp("3.2%")} style={{ right: wp("10%") }} />
          <TextInput
            value={tripCost + TOOMAN}
            keyboardType="numeric"
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              console.log(keyValue);
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
              fontSize: wp("3%"),
              color: colors.darkBlue,
              backgroundColor: colors.light,
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
            <AppText text="انصراف" size={wp("3.8%")} color={colors.darkBlue} style={{ right: wp("14%") }} />
            <AppIcon
              family="MaterialIcons"
              name="cancel"
              color={colors.darkBlue}
              size={wp("6%")}
              style={{ left: wp("21%") }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>

          <TouchableOpacity
            onPress={() => {
              if (parseInt(wallet_charge) < parseInt(toEnglishNumber(count)) * parseInt(toEnglishNumber(tripCost))) {
                toast.show("موجودی کیف پول ناکافی است", {
                  type: "normal",
                  duration: 3000,
                });
              } else {
                manipulateData(
                  db,
                  db_queries.EDIT_PASSENGER_WALLET_CHARGE_BY_PHONE_NUMBER,
                  [
                    parseInt(wallet_charge) - parseInt(toEnglishNumber(count)) * parseInt(toEnglishNumber(tripCost)),
                    passenger_phone,
                  ],
                  "پرداخت کرایه با موفقیت انجام شد",
                  "خطا در پرداخت کرایه"
                );
                manipulateData(db, db_queries.INSERT_TRANSACTION, [
                  "trip",
                  parseInt(toEnglishNumber(count)) * parseInt(toEnglishNumber(tripCost)),
                  date,
                  "میدان معلم",
                  "پل احسان",
                  passengerId,
                  driverId,
                ]);
                navigation.navigate("PassengerHome");
              }
            }}
            style={styles.payBtn}
          >
            <AppButton width="30%" height="100%" borderRadius={wp("3%")} />
            <AppText text="پرداخت" size={wp("3.8%")} color={colors.darkBlue} style={{ left: wp("5%") }} />
            <AppIcon
              family="SimpleLineIcons"
              name="wallet"
              color={colors.darkBlue}
              size={wp("6%")}
              style={{ left: wp("20%") }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.05 }} />
      </View>
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
  },
  image: {
    flex: 0.13,
    alignItems: "center",
  },
});

export default PaymentScreen;

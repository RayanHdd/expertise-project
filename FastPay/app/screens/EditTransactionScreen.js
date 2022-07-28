import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image, SafeAreaView, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import { toFarsiNumber, toEnglishNumber, gregorian_to_jalali, trimMoney } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object
const TOOMAN = "  تومان";

const EditTransactionScreen = ({ navigation }) => {
  const [tripCost, setTripCost] = useState("۰");
  const [transactionId, setTransactionId] = useState("");
  const [date, setDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [driverCode, setDriverCode] = useState(null);
  const [cardShow, setCardShow] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (transactionId.length !== 0) {
      const grabData = async () => {
        const data = await fetchData(db, db_queries.FETCH_RENT_TRANSACTION_BY_ID, [toEnglishNumber(transactionId)]);
        if (data.length !== 0) {
          setCardShow(true);
          const name = await fetchData(db, db_queries.GET_DRIVER_NAME_BY_ID, [data[0].driver_id]);
          const code = await fetchData(db, db_queries.GET_DRIVER_CODE_BY_ID, [data[0].driver_id]);
          const date = data[0].transaction_dateTime.split("-");
          const date2 = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));
          setFormattedDate(date2);
          setDate(date);
          setDriverName(name);
          setDriverCode(code);
          setData(data);
        } else {
          setCardShow(false);
        }
      };
      grabData().catch(console.error);
    }
  }, [transactionId]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="ویرایش تراکنش" size={hp("2%")} color={colors.darkBlue} style={{ top: wp("10%") }} />

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("4%")} style={{ position: "relative", marginRight: wp("80%"), marginTop: hp("2.5%") }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.07 }} />

        <View style={styles.title}>
          <AppText text="شناسه تراکنش را وارد کنید :" size={hp("1.7%")} style={{ right: wp("8%") }} />
          <TextInput
            focusable
            value={transactionId}
            selectionColor={colors.darkBlue}
            keyboardType="numeric"
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue === "Backspace" && transactionId !== null && transactionId.length !== 0) {
                setTransactionId(transactionId.slice(0, transactionId.length - 1));
              }
            }}
            onChangeText={(id) => {
              setTransactionId(transactionId + toFarsiNumber(id));
            }}
            style={{
              width: "38%",
              height: "80%",
              borderRadius: hp("1%"),
              borderWidth: hp("0.15%"),
              borderColor: colors.darkBlue,
              fontSize: hp("1.8%"),
              color: colors.darkBlue,
              backgroundColor: colors.light,
              textAlign: "center",
              right: wp("22%"),
              fontFamily: "Dirooz",
            }}
          />
        </View>

        {!cardShow && transactionId.length !== 0 ? (
          <Image
            style={{
              width: wp("60%"),
              height: hp("70%"),
              borderRadius: wp("7%"),
              left: wp("20%"),
              top: hp("10%"),
              position: "absolute",
            }}
            source={require("../assets/images/search_file.png")}
          />
        ) : null}
        {!cardShow && transactionId.length !== 0 ? <AppText text="موردی یافت نشد!" size={hp("3%")} color={colors.secondary} style={{ top: hp("59%"), alignSelf: "center" }} /> : null}

        {cardShow && driverName && driverCode && data ? (
          <>
            <View style={styles.card}>
              <View style={{ width: "90%", height: "96%", backgroundColor: colors.secondary, borderRadius: hp("1%"), marginTop: hp("4%") }}>
                <AppText text="نام راننده" size={hp("1.6%")} style={{ right: wp("5%"), top: hp("1.5%") }} />
                <AppText text={driverName[0].driver_firstName + " " + driverName[0].driver_lastName} size={hp("1.5%")} style={{ left: wp("5%"), top: hp("1.5%") }} />
                <View
                  style={{
                    borderBottomColor: colors.darkBlue,
                    borderBottomWidth: 0.2,
                    width: "90%",
                    left: wp("5%"),
                    top: hp("4.7%"),
                    opacity: 0.8,
                  }}
                />
                <AppText text="کد پذیرنده" size={hp("1.6%")} style={{ right: wp("5%"), top: hp("5.7%") }} />
                <AppText text={toFarsiNumber(driverCode[0].driver_acceptorCode)} size={hp("1.6%")} style={{ left: wp("5%"), top: hp("5.7%") }} />
                <View
                  style={{
                    borderBottomColor: colors.darkBlue,
                    borderBottomWidth: 0.2,
                    width: "90%",
                    left: wp("5%"),
                    top: hp("8.7%"),
                    opacity: 0.8,
                  }}
                />
                <AppText text="تعداد مسافران" size={hp("1.6%")} style={{ right: wp("5%"), top: hp("9.7%") }} />
                <AppText text={toFarsiNumber(data[0].transaction_passengerCount) + " نفر"} size={hp("1.6%")} style={{ left: wp("5%"), top: hp("9.7%") }} />
                <View
                  style={{
                    borderBottomColor: colors.darkBlue,
                    borderBottomWidth: 0.2,
                    width: "90%",
                    left: wp("5%"),
                    top: hp("12.7%"),
                    opacity: 0.8,
                  }}
                />
                <AppText text="مسیر" size={hp("1.6%")} style={{ right: wp("5%"), top: hp("13.7%") }} />
                <AppText text={data[0].transaction_source + "  -  " + data[0].transaction_destination} size={hp("1.4%")} style={{ left: wp("5%"), top: hp("13.9%") }} />
                <View
                  style={{
                    borderBottomColor: colors.darkBlue,
                    borderBottomWidth: 0.2,
                    width: "90%",
                    left: wp("5%"),
                    top: hp("16.7%"),
                    opacity: 0.8,
                  }}
                />
                <AppText text="تاریخ و ساعت" size={hp("1.6%")} style={{ right: wp("5%"), top: hp("17.7%") }} />
                <AppText
                  text={`${toFarsiNumber(formattedDate[0])}/${toFarsiNumber(formattedDate[1])}/${toFarsiNumber(formattedDate[2])} - ${toFarsiNumber(date[3])}:${toFarsiNumber(
                    date[4]
                  )}:${toFarsiNumber(date[5])}`}
                  size={hp("1.5%")}
                  style={{ left: wp("5%"), top: hp("17.7%") }}
                />
                <View
                  style={{
                    borderBottomColor: colors.darkBlue,
                    borderBottomWidth: 0.2,
                    width: "90%",
                    left: wp("5%"),
                    top: hp("20.7%"),
                    opacity: 0.8,
                  }}
                />
                <AppText text="مبلغ کرایه" size={hp("1.6%")} style={{ right: wp("5%"), top: hp("21.7%") }} />
                <AppText text={trimMoney(toFarsiNumber(parseInt(data[0].transaction_cost).toString())) + "  تومان"} size={hp("1.5%")} style={{ left: wp("5%"), top: hp("21.8%") }} />
              </View>
            </View>

            <View style={styles.title}>
              <AppText text="مبلغ کرایه جدید :" size={hp("1.6%")} style={{ right: wp("8%"), top: hp("4.2%") }} />
              <TextInput
                value={trimMoney(tripCost) + TOOMAN}
                selectionColor={colors.darkBlue}
                keyboardType="numeric"
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
                  width: "50%",
                  height: "80%",
                  borderRadius: wp("2%"),
                  fontSize: hp("1.8%"),
                  color: colors.darkBlue,
                  backgroundColor: colors.light,
                  borderColor: colors.darkBlue,
                  borderWidth: hp("0.15%"),
                  textAlign: "center",
                  right: wp("12.5%"),
                  fontFamily: "Dirooz",
                  marginTop: hp("5.2%"),
                }}
              />
            </View>

            <AppText
              text="مبلغ اضافی به صورت خودکار به کیف پول مسافر بازگردانده میشود"
              color={colors.secondary}
              size={hp("1.5%")}
              style={{ right: wp("8%"), top: hp("3.5%"), position: "relative" }}
            />

            <View style={{ flex: 0.145 }} />

            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.cancelBtn}
              >
                <AppButton width="30%" height="100%" color="secondary" borderRadius={hp("1.2%")} />
                <AppText text="انصراف" size={hp("1.9%")} color={colors.darkBlue} style={{ left: wp("7.5%") }} />
                <AppIcon family="MaterialIcons" name="cancel" color={colors.darkBlue} size={hp("3%")} style={{ left: wp("22%") }} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}></View>

              <TouchableOpacity
                onPress={() => {
                  if (tripCost !== null && tripCost !== "۰") {
                    const today = new Date();
                    const todayDate =
                      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
                    const grabData = async () => {
                      const wallet_charge = await fetchData(db, db_queries.GET_WALLET_CHARGE_BY_ID, [data[0].passenger_id]);
                      manipulateData(
                        db,
                        db_queries.INSERT_TRANSACTION,
                        [
                          "fastPay",
                          parseInt(toEnglishNumber(data[0].transaction_cost)) - parseInt(toEnglishNumber(tripCost)),
                          todayDate,
                          null,
                          null,
                          null,
                          "True",
                          data[0].passenger_id,
                          null,
                        ],
                        null,
                        "خطا در ثبت تراکنش"
                      );
                      manipulateData(
                        db,
                        db_queries.EDIT_PASSENGER_WALLET_CHARGE_BY_ID,
                        [parseInt(wallet_charge[0].passenger_walletCharge) + parseInt(toEnglishNumber(data[0].transaction_cost)) - parseInt(toEnglishNumber(tripCost)), data[0].passenger_id],
                        "تراکنش با موفقیت ویرایش شد",
                        "خطا در ویرایش تراکنش"
                      );
                    };
                    grabData().catch(console.error);
                    navigation.goBack();
                  } else {
                    toast.show("لطفا مبلغ کرایه جدید را وارد کنید", {
                      type: "normal",
                      duration: 3000,
                    });
                  }
                }}
                style={styles.payBtn}
              >
                <AppButton width="30%" height="100%" borderRadius={hp("1.2%")} />
                <AppText text="ویرایش" size={hp("1.9%")} color={colors.darkBlue} style={{ left: wp("7%") }} />
                <AppIcon family="Feather" name="edit" color={colors.darkBlue} size={hp("3%")} style={{ left: wp("22%") }} />
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        <View style={{ flex: 0.03 }} />
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
    borderRadius: hp("1.2%"),
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
    borderRadius: hp("1.2%"),
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
  card: {
    flex: 0.292,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditTransactionScreen;

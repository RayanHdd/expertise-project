import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, SafeAreaView } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
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

const TransactionConfirmationScreen = ({ navigation, route }) => {
  const { driver_name, driver_code, transaction_source, transaction_destination, dateTime, cost, passenger_id, transaction_id, transaction_passengerCount } = route.params;
  const [date, setDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [currentWalletCharge, setCurrentWalletCharge] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const grabData = async () => {
      const charge = await fetchData(db, db_queries.GET_WALLET_CHARGE_BY_ID, [passenger_id]);

      setCurrentWalletCharge(charge[0].passenger_walletCharge);
    };
    grabData().catch(console.error);

    const date = dateTime.split("-");
    const date2 = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));
    setFormattedDate(date2);
    setDate(date);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="تایید تراکنش" size={hp("2.4%")} color={colors.darkBlue} style={{ top: wp("10%") }} />

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("4%")} style={{ position: "relative", marginRight: wp("80%"), marginTop: wp("5%") }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.29 }} />

        <Image
          style={{
            width: wp("60%"),
            height: hp("65%"),
            top: hp("-5%"),
            alignSelf: "center",
            position: "absolute",
          }}
          source={require("../assets/images/confirmation.png")}
        />

        <View style={styles.card}>
          <View style={{ width: "90%", height: "96%", backgroundColor: colors.secondary, borderRadius: wp("1.5%") }}>
            <AppText text="نام راننده" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("1.6%") }} />
            <AppText text={driver_name[0].driver_firstName + " " + driver_name[0].driver_lastName} size={hp("1.7%")} style={{ left: wp("5%"), top: hp("1.6%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("5%"),
                opacity: 0.5,
              }}
            />
            <AppText text="کد پذیرنده" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("6%") }} />
            <AppText text={toFarsiNumber(driver_code)} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("6%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("9.5%"),
                opacity: 0.5,
              }}
            />
            <AppText text="مسیر" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("10.5%") }} />
            <AppText text={transaction_source + "  -  " + transaction_destination} size={hp("1.45%")} style={{ left: wp("5%"), top: hp("10.7%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("14%"),
                opacity: 0.5,
              }}
            />
            <AppText text="تعداد مسافرها" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("15%") }} />
            <AppText text={toFarsiNumber(transaction_passengerCount) + " نفر"} size={hp("2%")} style={{ left: wp("5%"), top: hp("15%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("18.5%"),
                opacity: 0.5,
              }}
            />
            <AppText text="تاریخ و ساعت" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("19.6%") }} />
            <AppText
              text={
                formattedDate !== null
                  ? `${toFarsiNumber(formattedDate[0])}/${toFarsiNumber(formattedDate[1])}/${toFarsiNumber(formattedDate[2])} - ${toFarsiNumber(date[3])}:${toFarsiNumber(
                      date[4]
                    )}:${toFarsiNumber(date[5])}`
                  : null
              }
              size={hp("1.7%")}
              style={{ left: wp("5%"), top: hp("19.7%") }}
            />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("23%"),
                opacity: 0.5,
              }}
            />
            <AppText text="مبلغ کرایه" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("24.5%") }} />
            <AppText text={trimMoney(toFarsiNumber(parseInt(cost).toString())) + "  تومان"} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("24.5%") }} />
          </View>
        </View>

        <View style={{ flex: 0.05 }} />

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              setShowAlert(true);
            }}
            style={styles.cancelBtn}
          >
            <AppButton width="30%" height="100%" borderRadius={wp("3%")} />
            <AppText text="حذف" size={hp("2.4%")} color={colors.darkBlue} style={{ left: wp("7.6%") }} />
            <AppIcon family="AntDesign" name="delete" color={colors.darkBlue} size={hp("3.2%")} style={{ left: wp("20.5%") }} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>

          <TouchableOpacity
            onPress={() => {
              manipulateData(
                db,
                db_queries.EDIT_PASSENGER_WALLET_CHARGE_BY_ID,
                [parseInt(currentWalletCharge) - parseInt(toEnglishNumber(cost)), passenger_id],
                null,
                "خطا در کسر موجودی از مسافر"
              );
              manipulateData(db, db_queries.EDIT_TRANSACTION_ISCONFIRMED_BY_ID, [transaction_id], "تراکنش با موفقیت تایید و ثبت شد", "خطا در تایید تراکنش");
              navigation.replace("UnconfirmedTransactions");
            }}
            style={styles.payBtn}
          >
            <AppButton width="30%" height="100%" borderRadius={hp("1.2%")} />
            <AppText text="تایید" size={hp("2.5%")} color={colors.darkBlue} style={{ right: wp("16%") }} />
            <AppIcon family="Feather" name="check-circle" color={colors.darkBlue} size={hp("3.4%")} style={{ left: wp("20%") }} />
          </TouchableOpacity>
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="حذف تراکنش"
          titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.darkBlue }}
          message="تراکنش حذف شود؟"
          messageStyle={{
            fontFamily: "Dirooz",
            fontSize: hp("2%"),
            color: colors.secondary,
          }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="انصراف"
          confirmText="حذف"
          confirmButtonColor={colors.darkBlue}
          cancelButtonColor={colors.medium}
          confirmButtonTextStyle={{ fontFamily: "Dirooz", fontSize: hp("2%") }}
          confirmButtonStyle={{ marginLeft: wp("4%") }}
          cancelButtonTextStyle={{ fontFamily: "Dirooz", fontSize: hp("2%"), color: colors.darkBlue }}
          contentContainerStyle={{ width: wp("65%"), height: hp("25%") }}
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            manipulateData(db, db_queries.DELETE_TRANSACTION_BY_ID, [transaction_id], "تراکنش با موفقیت حذف شد", "خطا در حذف تراکنش");
            navigation.navigate("UnconfirmedTransactions");
          }}
        />

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
    backgroundColor: colors.primary,
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
    flex: 0.32,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TransactionConfirmationScreen;

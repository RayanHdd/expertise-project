import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, TextInput, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import { toFarsiNumber, gregorian_to_jalali, trimMoney } from "../functions/helperFunctions";
import AwesomeAlert from "react-native-awesome-alerts";
import * as SQLite from "expo-sqlite";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { send } from "../api/sendSMS";

const db = SQLite.openDatabase("db.database"); // returns Database object

function TransactionDetailsScreen({ navigation, route }) {
  const { driver_name, driver_code, transaction_source, transaction_destination, dateTime, cost, driver_image, transaction_id, driver_id } = route.params;
  const [showAlert, setShowAlert] = useState(false);
  const [reportTxt, setReportTxt] = useState("");
  const view_shot = useRef(null);

  const date = dateTime.split("-");
  const formattedDate = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));

  const captureAndShareScreenshot = () => {
    view_shot.current.capture().then((uri) => {
      Sharing.shareAsync("file://" + uri);
    }),
      (error) => console.error("Oops, snapshot failed", error);
  };

  return (
    <>
      <ViewShot style={styles.container} ref={view_shot} options={{ format: "jpg", quality: 0.8 }}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="جزئیات تراکنش" size={hp("2%")} color={colors.darkBlue} style={{ right: wp("5%"), top: hp("4.5%") }} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Transactions");
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("3.6%")} style={{ marginLeft: wp("7%"), marginTop: wp("5%"), position: "relative" }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.06 }} />

        <View style={styles.image}>
          <Image style={{ width: hp("12%"), height: hp("12%"), borderRadius: hp("6%"), bottom: wp("3%") }} source={{ uri: driver_image }} />
          <View
            style={{
              width: hp("13%"),
              height: hp("13%"),
              borderRadius: hp("7%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.3%"),
              backgroundColor: null,
              bottom: hp("5.5%"),
              position: "absolute",
              opacity: 0.5,
            }}
          />
        </View>

        <View style={styles.card}>
          <View style={{ width: "90%", height: "100%", backgroundColor: colors.secondary, borderRadius: wp("1.5%") }}>
            <AppText text="نام راننده" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("1.5%") }} />
            <AppText text={driver_name[0].driver_firstName + " " + driver_name[0].driver_lastName} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("1.5%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("5.5%"),
                opacity: 0.5,
              }}
            />
            <AppText text="کد پذیرنده" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("6.8%") }} />
            <AppText text={toFarsiNumber(driver_code)} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("6.8%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("10.8%"),
                opacity: 0.5,
              }}
            />
            <AppText text="مسیر" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("12%") }} />
            <AppText text={transaction_source + "  -  " + transaction_destination} size={hp("1.5%")} style={{ left: wp("5%"), top: hp("12.45%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("16%"),
                opacity: 0.5,
              }}
            />
            <AppText text="تعداد مسافران" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("17%") }} />
            <AppText text="۱ نفر" size={hp("1.8%")} style={{ left: wp("5%"), top: hp("17%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("21%"),
                opacity: 0.5,
              }}
            />
            <AppText text="تاریخ و ساعت" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("22.2%") }} />
            <AppText
              text={`${toFarsiNumber(formattedDate[0])}/${toFarsiNumber(formattedDate[1])}/${toFarsiNumber(formattedDate[2])} - ${toFarsiNumber(date[3])}:${toFarsiNumber(
                date[4]
              )}:${toFarsiNumber(date[5])}`}
              size={hp("1.7%")}
              style={{ left: wp("5%"), top: hp("22.5%") }}
            />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("26%"),
                opacity: 0.5,
              }}
            />
            <AppText text="مبلغ کرایه" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("27.5%") }} />
            <AppText text={trimMoney(toFarsiNumber(parseInt(cost).toString())) + " تومان"} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("27.5%") }} />
          </View>
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          customView={
            <>
              <Image style={{ width: hp("4%"), height: hp("4%"), top: hp("1%"), right: wp("32%"), position: "absolute" }} source={require("../assets/images/danger.png")} />

              <AppText text="تخلف راننده را اینجا ثبت کنید." size={hp("1.7%")} color={colors.darkBlue} style={{ top: hp("8%"), right: wp("3.6%") }} />
              <AppText text="نتیجه پس از بررسی به شما اعلام می شود." size={hp("1.7%")} color={colors.darkBlue} style={{ right: wp("3.6%"), top: hp("10.8%") }} />

              <TextInput
                value={reportTxt}
                multiline
                selectionColor={colors.darkBlue}
                placeholder="جزئیات تخلف راننده را بنویسید."
                onChangeText={(txt) => {
                  setReportTxt(txt);
                }}
                style={{
                  width: "97%",
                  height: "60%",
                  padding: hp("1.6%"),
                  borderRadius: wp("2%"),
                  borderWidth: wp("0.2%"),
                  borderColor: colors.darkBlue,
                  backgroundColor: colors.light,
                  textAlignVertical: "top",
                  textAlign: "auto",
                  fontSize: hp("1.7%"),
                  color: colors.darkBlue,
                  fontFamily: "Dirooz",
                  marginTop: hp("11%"),
                  shadowColor: colors.darkBlue,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 2,
                }}
              />
            </>
          }
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton
          showCancelButton
          cancelText="ثبت"
          cancelButtonTextStyle={{ fontSize: wp("4.2%"), fontFamily: "Dirooz", color: colors.darkBlue }}
          confirmButtonTextStyle={{ fontSize: wp("4%"), fontFamily: "Dirooz", color: colors.darkBlue }}
          confirmText="انصراف"
          alertContainerStyle={{ color: colors.light }}
          contentContainerStyle={{ width: wp("80%"), height: hp("60%") }}
          cancelButtonStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: wp("20%"),
            height: hp("7%"),
            bottom: hp("2%"),
            borderRadius: wp("3%"),
            backgroundColor: colors.primary,
            left: wp("25%"),
            shadowColor: colors.darkBlue,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 3,
          }}
          confirmButtonColor={colors.darkBlue}
          cancelButtonColor={colors.medium}
          confirmButtonStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: wp("20%"),
            height: hp("7%"),
            bottom: hp("2%"),
            borderRadius: wp("3%"),
            backgroundColor: colors.secondary,
            right: wp("25%"),
            shadowColor: colors.darkBlue,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 3,
          }}
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            if (reportTxt === null || reportTxt.length === 0)
              toast.show("لطفا جرئیات تخلف را وارد کنید", {
                type: "normal",
                duration: 3000,
              });
            else {
              const today = new Date();
              const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
              setShowAlert(false);
              manipulateData(db, db_queries.INSERT_REPORT, [reportTxt, date, parseInt(transaction_id)], "گزارش با موفقیت ثبت شد", "خطا در گزارش تخلف");

              const grabData = async () => {
                const phone_numbers = await fetchData(db, db_queries.FETCH_MANAGER_PHONE_NUMBERS, []);
                send("0" + phone_numbers[0].manager_phone.toString().substring(2)).then((sent) => {
                  console.log("Sent!", sent);
                });
              };
              grabData().catch(console.error);
            }
          }}
        />

        <View style={{ flex: 0.15 }} />
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              setShowAlert(true);
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              width: "25%",
              height: "100%",
              borderRadius: wp("3%"),
              backgroundColor: colors.primary,
              shadowColor: colors.darkBlue,
              left: wp("15%"),
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              elevation: 3,
            }}
          >
            <AppButton width="30%" height="100%" borderRadius={wp("3%")} style={{ left: wp("15%"), position: "absolute" }} />
            <AppText text="گزارش" size={hp("1.9%")} color={colors.darkBlue} style={{ left: wp("6%") }} />
            <AppIcon family="MaterialIcons" name="report" color={colors.darkBlue} size={hp("3.5%")} style={{ left: wp("20%") }} />
          </TouchableOpacity>

          <View style={{ flex: 1.3 }}></View>

          <TouchableOpacity
            onPress={() => {
              captureAndShareScreenshot();
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              width: "30%",
              height: "100%",
              borderRadius: wp("3%"),
              backgroundColor: colors.primary,
              shadowColor: colors.darkBlue,
              right: wp("15%"),
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              elevation: 3,
            }}
          >
            <AppButton width="30%" height="100%" borderRadius={wp("3%")} style={{}} />
            <AppText text="اشتراک گذاری" size={hp("1.5%")} style={{ right: wp("9.3%") }} />
            <AppIcon family="Entypo" name="share" color={colors.darkBlue} size={hp("2.8%")} style={{ right: wp("2.5%") }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RateTrip", { driver_id: driver_id });
          }}
          style={{ flex: 0.04, position: "absolute", top: hp("90.5%"), right: wp("32%") }}
        >
          <AppText
            text="به سفر خود امتیاز دهید"
            size={hp("1.9%")}
            color={colors.secondary}
            style={{
              textDecorationLine: "underline",
              position: "relative",
            }}
          />
        </TouchableOpacity>

        <View style={{ flex: 0.07 }} />
      </ViewShot>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 0.17,
    alignItems: "center",
  },
  buttons: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  header: {
    flex: 0.08,
    justifyContent: "center",
    backgroundColor: colors.light,
    paddingTop: Platform.OS === "ios" ? hp("2%") : StatusBar.currentHeight,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  card: {
    flex: 0.342,
    alignItems: "center",
    justifyContent: "center",
    bottom: hp("3%"),
  },
});

export default TransactionDetailsScreen;

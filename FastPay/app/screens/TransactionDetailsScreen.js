import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, TextInput } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import { toFarsiNumber, gregorian_to_jalali, trimMoney } from "../functions/helperFunctions";
import { captureScreen } from "react-native-view-shot";
import AwesomeAlert from "react-native-awesome-alerts";
// import OffendingReport from "../components/OffendingReport";
import * as SQLite from "expo-sqlite";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";

const db = SQLite.openDatabase("db.database"); // returns Database object

function TransactionDetailsScreen({ navigation, route }) {
  const {
    driver_name,
    driver_code,
    transaction_source,
    transaction_destination,
    dateTime,
    cost,
    driver_image,
    driver_id,
  } = route.params;
  const [showAlert, setShowAlert] = useState(false);
  const [offendingTxt, setOffendingTxt] = useState("");

  const date = dateTime.split("-");
  const formattedDate = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));

  const OffendingReport = () => {
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

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText
            text="جزئیات تراکنش"
            size={wp("4%")}
            color={colors.darkBlue}
            style={{ right: wp("5%"), top: wp("8%") }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Transactions");
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon
              family="Ionicons"
              name="arrow-back"
              color={colors.darkBlue}
              size={wp("7%")}
              style={{ marginLeft: wp("7%"), marginTop: wp("5%"), position: "relative" }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.06 }} />

        <View style={styles.image}>
          <Image
            style={{ width: wp("25%"), height: wp("25%"), borderRadius: wp("15%"), bottom: wp("3%") }}
            // source={require("../assets/images/profile.jpeg")}
            source={{ uri: driver_image }}
          />
          <View
            style={{
              width: wp("28%"),
              height: wp("28%"),
              borderRadius: wp("15%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.3%"),
              backgroundColor: null,
              bottom: wp("5.65%"),
              position: "absolute",
              opacity: 0.5,
            }}
          />
        </View>

        <View style={styles.card}>
          <View style={{ width: "90%", height: "96%", backgroundColor: colors.secondary, borderRadius: wp("1.5%") }}>
            <AppText text="نام راننده" size={wp("3%")} style={{ right: wp("5%"), top: wp("3%") }} />
            {/* <AppText text="علی هاشمی" size={wp("3%")} style={{ left: wp("5%"), top: wp("3%") }} /> */}
            <AppText
              text={driver_name[0].driver_firstName + " " + driver_name[0].driver_lastName}
              size={wp("3%")}
              style={{ left: wp("5%"), top: wp("3%") }}
            />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: wp("10%"),
              }}
            />
            <AppText text="نام مسافر" size={wp("3%")} style={{ right: wp("5%"), top: wp("11%") }} />
            <AppText text="امیرمسعود حیدری" size={wp("3%")} style={{ left: wp("5%"), top: wp("11%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: wp("18%"),
              }}
            />
            <AppText text="کد پذیرنده" size={wp("3%")} style={{ right: wp("5%"), top: wp("19%") }} />
            {/* <AppText text="۳۴۲۱۵۷" size={wp("3%")} style={{ left: wp("5%"), top: wp("19%") }} /> */}
            <AppText text={toFarsiNumber(driver_code)} size={wp("3%")} style={{ left: wp("5%"), top: wp("19%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: wp("26%"),
              }}
            />
            <AppText text="مسیر" size={wp("3%")} style={{ right: wp("5%"), top: wp("27%") }} />
            {/* <AppText text="پل معالی آباد  -  چمران" size={wp("3%")} style={{ left: wp("5%"), top: wp("27%") }} /> */}
            <AppText
              text={transaction_source + "  -  " + transaction_destination}
              size={wp("3%")}
              style={{ left: wp("5%"), top: wp("27%") }}
            />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: wp("34%"),
              }}
            />
            <AppText text="تاریخ و ساعت" size={wp("3%")} style={{ right: wp("5%"), top: wp("35%") }} />
            {/* <AppText text="۱۶:۲۳  -  ۱۴۰۰/۱۱/۲۳" size={wp("3%")} style={{ left: wp("5%"), top: wp("35%") }} /> */}
            <AppText
              text={`${toFarsiNumber(formattedDate[0])}/${toFarsiNumber(formattedDate[1])}/${toFarsiNumber(
                formattedDate[2]
              )} - ${toFarsiNumber(date[3])}:${toFarsiNumber(date[4])}:${toFarsiNumber(date[5])}`}
              size={wp("3%")}
              style={{ left: wp("5%"), top: wp("35%") }}
            />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: wp("42%"),
              }}
            />
            <AppText text="مبلغ کرایه" size={wp("3%")} style={{ right: wp("5%"), top: wp("43%") }} />
            {/* <AppText text="۲٬۵۰۰ تومان" size={wp("3%")} style={{ left: wp("5%"), top: wp("43%") }} /> */}
            <AppText
              text={trimMoney(toFarsiNumber(parseInt(cost).toString())) + "  تومان"}
              size={wp("3%")}
              style={{ left: wp("5%"), top: wp("43%") }}
            />
          </View>
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          customView={<OffendingReport />}
          // title="کد پذیرنده راننده"
          // titleStyle={{ fontFamily: "Dirooz", fontSize: wp("4%"), color: colors.darkBlue }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          showCancelButton={true}
          cancelText={<AppText size={wp("4.2%")} text="ثبت" color={colors.darkBlue} />}
          confirmText={<AppText size={wp("4%")} text="انصراف" color={colors.darkBlue} />}
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
          }}
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            manipulateData(
              db,
              db_queries.INSERT_OFFENDING,
              [offendingTxt, driver_id],
              "گزارش تخلف با موفقیت ثبت شد",
              "خطا در گزارش تخلف"
            );
            setShowAlert(false);
          }}
        />

        <View style={{ flex: 0.19 }} />
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
            <AppButton
              width="30%"
              height="100%"
              borderRadius={wp("3%")}
              style={{ left: wp("15%"), position: "absolute" }}
            />
            <AppText text="گزارش تخلف" size={wp("3.2%")} color={colors.darkBlue} style={{ left: wp("4%") }} />
            <AppIcon
              family="MaterialIcons"
              name="report"
              color={colors.darkBlue}
              size={wp("6%")}
              style={{ left: wp("22%") }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1.3 }}></View>

          <TouchableOpacity
            onPress={() => {
              captureScreen({
                format: "jpg",
                quality: 1,
              }).then(
                (uri) => console.log("Image saved to", uri),
                (error) => console.error("Oops, snapshot failed", error)
              );
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
            <AppText text="پرینت" size={wp("3.6%")} color={colors.darkBlue} style={{ right: wp("13%") }} />
            <AppIcon
              family="MaterialCommunityIcons"
              name="file-pdf-outline"
              color={colors.darkBlue}
              size={wp("6%")}
              style={{ right: wp("5%") }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.1 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 0.17,
    // justifyContent: "center",
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
    paddingTop: StatusBar.currentHeight,
  },
  card: {
    flex: 0.32,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TransactionDetailsScreen;

import React from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, Platform, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import { toFarsiNumber, gregorian_to_jalali, trimMoney } from "../functions/helperFunctions";

const ManagerTransactionDetailsScreen = ({ navigation, route }) => {
  const { driver_name, driver_code, transaction_source, transaction_destination, dateTime, cost, driver_image, transaction_id, driver_id } = route.params;
  const date = dateTime.split("-");
  const formattedDate = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="جزئیات تراکنش" size={hp("2%")} color={colors.darkBlue} style={{ right: wp("5%"), top: hp("4.5%") }} />
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
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
            <AppText text="شناسه تراکنش" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("2%") }} />
            <AppText text={toFarsiNumber(transaction_id)} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("2%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("6%"),
                opacity: 0.5,
              }}
            />
            <AppText text="نام راننده" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("6.5%") }} />
            <AppText text={driver_name[0].driver_firstName + " " + driver_name[0].driver_lastName} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("6.5%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("11.2%"),
                opacity: 0.5,
              }}
            />
            <AppText text="کد پذیرنده" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("11.8%") }} />
            <AppText text={toFarsiNumber(driver_code)} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("11.8%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("16.2%"),
                opacity: 0.5,
              }}
            />
            <AppText text="مسیر" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("17%") }} />
            <AppText text={transaction_source + "  -  " + transaction_destination} size={hp("1.6%")} style={{ left: wp("5%"), top: hp("17%") }} />
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
            <AppText text="تعداد مسافران" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("22%") }} />
            <AppText text="۱ نفر" size={hp("1.8%")} style={{ left: wp("5%"), top: hp("22%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("26.5%"),
                opacity: 0.5,
              }}
            />
            <AppText text="تاریخ و ساعت" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("27.2%") }} />
            <AppText
              text={`${toFarsiNumber(formattedDate[0])}/${toFarsiNumber(formattedDate[1])}/${toFarsiNumber(formattedDate[2])} - ${toFarsiNumber(date[3])}:${toFarsiNumber(
                date[4]
              )}:${toFarsiNumber(date[5])}`}
              size={hp("1.8%")}
              style={{ left: wp("5%"), top: hp("27.5%") }}
            />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("31.5%"),
                opacity: 0.5,
              }}
            />
            <AppText text="مبلغ کرایه" size={hp("1.8%")} style={{ right: wp("5%"), top: hp("32.5%") }} />
            <AppText text={trimMoney(toFarsiNumber(parseInt(cost).toString())) + "  تومان"} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("32.5%") }} />
          </View>
        </View>

        <View style={{ flex: 0.2 }} />
      </SafeAreaView>
    </>
  );
};

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
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    bottom: hp("3%"),
  },
});

export default ManagerTransactionDetailsScreen;

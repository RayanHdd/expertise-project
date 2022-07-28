import React from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, SafeAreaView, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import HeaderCard from "../components/HeaderCard";
import { toFarsiNumber, convertToFarsiNumber } from "../functions/helperFunctions";

function DriverDetailsScreen({ navigation, route }) {
  const { driver_name, driver_code, driver_car, driver_phone, driver_image, driver_numberplate, driver_score } = route.params;

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="مشخصات راننده" size={hp("2.2%")} color={colors.darkBlue} style={{ right: wp("5%"), top: hp("5%") }} />
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("3.7%")} style={{ marginLeft: wp("7%"), marginTop: wp("5%"), position: "relative" }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.06 }} />

        <View style={styles.image}>
          <Image resizeMode="cover" style={{ width: hp("14%"), height: hp("14%"), borderRadius: hp("7%"), bottom: hp("1.6%") }} source={{ uri: driver_image }} />
          <View
            style={{
              width: hp("15.5%"),
              height: hp("15.5%"),
              borderRadius: hp("8%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.3%"),
              backgroundColor: null,
              bottom: hp("3.3%"),
              position: "absolute",
              opacity: 0.5,
            }}
          />
        </View>

        <View style={styles.card}>
          <View style={{ width: "90%", height: "96%", backgroundColor: colors.secondary, borderRadius: wp("1.5%") }}>
            <AppText text="نام راننده" size={hp("2%")} style={{ right: wp("5%"), top: hp("1.6%") }} />
            <AppText text={driver_name} size={hp("1.8%")} style={{ left: wp("5%"), top: hp("1.6%") }} />
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
            <AppText text="کد پذیرنده" size={hp("2%")} style={{ right: wp("5%"), top: hp("6.5%") }} />
            <AppText text={toFarsiNumber(driver_code)} size={hp("2%")} style={{ left: wp("5%"), top: hp("6.5%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("10.2%"),
                opacity: 0.5,
              }}
            />
            <AppText text="شماره تماس" size={hp("2%")} style={{ right: wp("5%"), top: hp("11.4%") }} />
            <AppText text={"۰" + toFarsiNumber(driver_phone).slice(2)} size={hp("2%")} style={{ left: wp("5%"), top: hp("11.4%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("15%"),
                opacity: 0.5,
              }}
            />
            <AppText text="مدل خودرو" size={hp("2%")} style={{ right: wp("5%"), top: hp("16%") }} />
            <AppText text={driver_car} size={hp("2%")} style={{ left: wp("5%"), top: hp("16%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("20%"),
                opacity: 0.5,
              }}
            />
            <AppText text="پلاک خودرو" size={hp("2%")} style={{ right: wp("5%"), top: hp("22.5%") }} />
            <Image
              style={{ width: wp("90%"), height: hp("24%"), borderRadius: hp("0.5%"), position: "absolute", top: hp("12.5%"), right: wp("19%") }}
              resizeMode="contain"
              source={require("../assets/images/numberplate-empty.png")}
            />
            <AppText text={"ایران"} size={hp("1.6%")} color={colors.darkBlue} style={{ left: wp("40.7%"), top: hp("21.5%") }} />
            <AppText text={driver_numberplate.slice(0, 2)} size={hp("2.2%")} color={colors.darkBlue} style={{ left: wp("40.7%"), top: hp("23.3%") }} />
            <AppText text={driver_numberplate.slice(15, 17)} size={hp("3%")} color={colors.darkBlue} style={{ left: wp("10%"), top: hp("21.8%") }} />
            <AppText text={driver_numberplate.slice(13, 14)} size={hp("2.8%")} color={colors.darkBlue} style={{ left: wp("18.2%"), top: hp("21.2%") }} />
            <AppText text={driver_numberplate.slice(9, 12)} size={hp("3%")} color={colors.darkBlue} style={{ left: wp("24%"), top: hp("21.8%") }} />
            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "8%",
                left: wp("35.5%"),
                top: hp("24.4%"),
                transform: [{ rotate: "90deg" }],
              }}
            />

            <View
              style={{
                borderBottomColor: colors.darkBlue,
                borderBottomWidth: 0.2,
                width: "90%",
                left: wp("5%"),
                top: hp("28%"),
                opacity: 0.5,
              }}
            />
            <AppText text="امتیاز راننده" size={hp("2%")} style={{ right: wp("5%"), top: hp("29.5%") }} />
            <AppIcon family="AntDesign" name="star" size={hp("2%")} style={{ left: wp("5"), top: hp("30.2%") }} />
            <AppText text={convertToFarsiNumber(driver_score)} size={hp("2%")} style={{ left: wp("9.3%"), top: hp("29.5%") }} />
          </View>
        </View>

        <View style={{ flex: 0.16 }} />
        <View style={styles.buttons}>
          <View style={{ flex: 1.3 }}></View>
        </View>

        <View style={{ flex: 0.06 }} />
      </SafeAreaView>
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
  card: {
    flex: 0.38,
    alignItems: "center",
    justifyContent: "center",
    bottom: hp("1%"),
  },
});

export default DriverDetailsScreen;

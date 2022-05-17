import React from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";

function TransactionDetailsScreen() {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="جزئیات تراکنش" size={wp("4%")} color={colors.darkBlue} style={{ right: wp("5%") }} />
          <AppIcon
            family="Ionicons"
            name="arrow-back"
            color={colors.darkBlue}
            size={wp("7%")}
            style={{ left: wp("5%") }}
          />
        </View>

        <View style={{ flex: 0.06 }} />

        <View style={styles.image}>
          <Image
            style={{ width: wp("25%"), height: wp("25%"), borderRadius: wp("15%"), bottom: wp("3%") }}
            source={require("../assets/images/profile.jpeg")}
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
            <AppText text="علی هاشمی" size={wp("3%")} style={{ left: wp("5%"), top: wp("3%") }} />
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
            <AppText text="۳۴۲۱۵۷" size={wp("3%")} style={{ left: wp("5%"), top: wp("19%") }} />
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
            <AppText text="پل معالی آباد  -  چمران" size={wp("3%")} style={{ left: wp("5%"), top: wp("27%") }} />
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
            <AppText text="۱۶:۲۳  -  ۱۴۰۰/۱۱/۲۳" size={wp("3%")} style={{ left: wp("5%"), top: wp("35%") }} />
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
            <AppText text="۲٬۵۰۰ تومان" size={wp("3%")} style={{ left: wp("5%"), top: wp("43%") }} />
          </View>
        </View>

        <View style={{ flex: 0.04 }} />
        <View style={styles.buttons}>
          <AppButton
            width="30%"
            height="100%"
            borderRadius={wp("3%")}
            style={{ left: wp("15%"), position: "absolute" }}
          />
          <AppText text="گزارش تخلف" size={wp("3.2%")} color={colors.darkBlue} style={{ left: wp("18.2%") }} />
          <AppIcon
            family="MaterialIcons"
            name="report"
            color={colors.darkBlue}
            size={wp("6%")}
            style={{ left: wp("36%") }}
          />

          <AppButton
            width="30%"
            height="100%"
            borderRadius={wp("3%")}
            style={{ right: wp("15%"), position: "absolute" }}
          />
          <AppText text="پرینت" size={wp("3.6%")} color={colors.darkBlue} style={{ right: wp("28%") }} />
          <AppIcon
            family="MaterialCommunityIcons"
            name="file-pdf-outline"
            color={colors.darkBlue}
            size={wp("6%")}
            style={{ right: wp("19%") }}
          />
        </View>
        <View style={{ flex: 0.25 }} />
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

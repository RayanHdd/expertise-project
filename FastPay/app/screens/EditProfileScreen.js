import React from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import PassengerNavigationMenu from "../components/PassengerNavigationMenu";
import TransactionCard from "../components/TransactionCard";

function TransactionsScreen() {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="ویرایش مشخصات کاربری" size={wp("4%")} color={colors.darkBlue} />
          <AppIcon
            family="Ionicons"
            name="arrow-back"
            color={colors.darkBlue}
            size={wp("7%")}
            style={{ left: wp("5%") }}
          />
        </View>

        <View style={{ flex: 0.035 }} />

        <View style={styles.profile}>
          <AppButton
            width={wp("30%")}
            height="35%"
            color="light"
            borderRadius={wp("6%")}
            style={{
              position: "absolute",
              left: wp("20%"),
              top: wp("5%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.1%"),
            }}
          />
          <AppText text="آپلود عکس" size={wp("3.2%")} style={{ left: wp("24%"), top: wp("6.7%") }} />
          <AppIcon
            family="Feather"
            name="image"
            color={colors.darkBlue}
            size={wp("5.5%")}
            style={{ left: wp("41%"), top: wp("6.7%") }}
          />

          <AppButton
            width={wp("30%")}
            height="35%"
            color="light"
            borderRadius={wp("6%")}
            style={{
              position: "absolute",
              left: wp("20%"),
              top: wp("19%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.1%"),
            }}
          />
          <AppText text="حذف عکس" size={wp("3.2%")} style={{ left: wp("24%"), top: wp("20.7%") }} />
          <AppIcon
            family="Feather"
            name="trash-2"
            color={colors.darkBlue}
            size={wp("5.5%")}
            style={{ left: wp("41%"), top: wp("20.7%") }}
          />
          <Image
            style={{ width: wp("28%"), height: wp("28%"), borderRadius: wp("15%"), top: wp("3%"), left: wp("20%") }}
            source={require("../assets/images/profile.jpeg")}
          />
          <View
            style={{
              width: wp("31%"),
              height: wp("31%"),
              borderRadius: wp("15%"),
              top: wp("1.5%"),
              right: wp("14.5%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.3%"),
              backgroundColor: null,
              position: "absolute",
              opacity: 0.5,
            }}
          />
        </View>

        <View style={{ flex: 0.045 }} />

        <View style={styles.title}>
          <AppText text="نام کاربری" size={wp("3.2%")} style={{ right: wp("15%") }} />
        </View>
        <View style={styles.input}>
          <TextInput
            value="علی هاشمی"
            style={{
              width: "70%",
              height: "90%",
              borderRadius: wp("3%"),
              borderWidth: wp("0.1%"),
              borderColor: colors.darkBlue,
              color: colors.darkBlue,
              backgroundColor: colors.light,
              paddingRight: wp("30%"),
            }}
          />
          <AppIcon
            family="SimpleLineIcons"
            name="user"
            color={colors.darkBlue}
            size={wp("5.5%")}
            style={{ right: wp("19%"), opacity: 0.7 }}
          />
        </View>

        <View style={styles.title}>
          <AppText text="شماره موبایل" size={wp("3.2%")} style={{ right: wp("15%") }} />
        </View>
        <View style={styles.input}>
          <TextInput
            keyboardType="numeric"
            value="۰۹۱۲۳۴۵۶۷۸۹"
            style={{
              width: "70%",
              height: "90%",
              borderRadius: wp("3%"),
              borderWidth: wp("0.1%"),
              borderColor: colors.darkBlue,
              color: colors.darkBlue,
              backgroundColor: colors.light,
              fontSize: wp("5%"),
              paddingLeft: wp("20%"),
            }}
          />
          <AppIcon
            family="SimpleLineIcons"
            name="screen-smartphone"
            color={colors.darkBlue}
            size={wp("5.7%")}
            style={{ right: wp("19%"), opacity: 0.7 }}
          />
        </View>

        <View style={{ flex: 0.345 }} />

        <View style={styles.button}>
          <AppButton
            width={wp("70%")}
            height="100%"
            borderRadius={wp("3.5%")}
            style={{ position: "absolute", bottom: wp("6%") }}
          />
          <AppText text="‌ذخیره" size={wp("4.7%")} style={{ bottom: wp("9.5%") }} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 0.045,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
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
    alignItems: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
  },
  profile: {
    flex: 0.165,
    alignItems: "center",
  },
});

export default TransactionsScreen;

import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, Platform, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";

const db = SQLite.openDatabase("db.database"); // returns Database object

function RateTripScreen({ navigation, route }) {
  const { driver_id } = route.params;
  const [rateTxt, setRateTxt] = useState("متوسط");
  const [currentScore, setCurrentScore] = useState(null);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      const grabData = async () => {
        const driver_score = await fetchData(db, db_queries.GET_DRIVER_SCORE_BY_ID, [driver_id]);
        setCurrentScore(parseFloat(driver_score[0].driver_score));
      };
      grabData().catch(console.error);
    });
    return onRefresh;
  }, [navigation]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="بازخورد سفر" size={hp("2.4%")} color={colors.darkBlue} style={{ right: wp("7%"), top: wp("8%") }} />
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("3.8%")} style={{ marginLeft: wp("7%"), marginTop: wp("5%"), position: "relative" }} />
          </TouchableOpacity>
        </View>

        <View style={styles.image}>
          <Image style={{ width: "80%", height: "100%", bottom: hp("1%") }} source={require("../assets/images/rating.png")} resizeMode="contain" />
        </View>

        <View style={{ flex: 0.16 }} />
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              width: "25%",
              height: "100%",
              borderRadius: wp("3%"),
              backgroundColor: colors.secondary,
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
            <AppButton width="30%" height="100%" color={colors.secondary} borderRadius={wp("3%")} style={{ left: wp("15%"), position: "absolute" }} />
            <AppText text="انصراف" size={hp("2%")} color={colors.darkBlue} style={{ left: wp("5%") }} />
            <AppIcon family="MaterialIcons" name="cancel" color={colors.darkBlue} size={hp("3%")} style={{ left: wp("20%") }} />
          </TouchableOpacity>

          <View style={{ flex: 1.3 }}></View>

          <TouchableOpacity
            onPress={() => {
              let newRate;
              switch (rateTxt) {
                case "خیلی بد":
                  newRate = (currentScore + 1) / 2;
                  break;
                case "بد":
                  newRate = (currentScore + 2) / 2;
                  break;
                case "متوسط":
                  newRate = (currentScore + 3) / 2;
                  break;
                case "خوب":
                  newRate = (currentScore + 4) / 2;
                  break;
                case "عالی":
                  newRate = (currentScore + 5) / 2;
                  break;
                default:
                  newRate = (currentScore + 3) / 2;
                  break;
              }
              manipulateData(db, db_queries.EDIT_DRIVER_SCORE_BY_ID, [newRate.toString(), driver_id], "امتیاز با موفقیت ثبت شد", "خطا در ثبت امتیاز");
              navigation.goBack();
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
            <AppText text="ثبت" size={hp("2.5%")} color={colors.darkBlue} style={{ right: wp("14%") }} />
            <AppIcon family="Feather" name="check-circle" color={colors.darkBlue} size={hp("3%")} style={{ right: wp("5%") }} />
          </TouchableOpacity>
        </View>

        <AppText
          text="با ثبت امتیاز، ما را در بهبود کیفیت خدمات یاری کنید"
          size={hp("1.9%")}
          color={colors.darkBlue}
          style={{
            flex: 0.04,
            top: hp("18%"),
            alignSelf: "center",
          }}
        />

        <TouchableOpacity
          activeOpacity={hp("2%")}
          onPress={() => {
            setRateTxt("خیلی بد");
          }}
          style={{ position: "absolute", left: wp("20%"), top: hp("50%") }}
        >
          <AppIcon family="AntDesign" name="star" color={colors.primary} size={hp("6%")} style={{ position: "relative" }} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={hp("2%")}
          onPress={() => {
            setRateTxt("بد");
          }}
          style={{ position: "absolute", left: wp("32%"), top: hp("50%") }}
        >
          {rateTxt === "خیلی بد" ? <AppIcon family="AntDesign" name="staro" color={colors.darkBlue} size={hp("6%")} style={{ position: "relative" }} /> : null}
          {rateTxt !== "خیلی بد" ? <AppIcon family="AntDesign" name="star" color={colors.primary} size={hp("6%")} style={{ position: "relative" }} /> : null}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={hp("2%")}
          onPress={() => {
            setRateTxt("متوسط");
          }}
          style={{ position: "absolute", left: wp("44%"), top: hp("50%") }}
        >
          {rateTxt === "خیلی بد" || rateTxt === "بد" ? <AppIcon family="AntDesign" name="staro" color={colors.darkBlue} size={hp("6%")} style={{ position: "relative" }} /> : null}
          {rateTxt !== "خیلی بد" && rateTxt !== "بد" ? <AppIcon family="AntDesign" name="star" color={colors.primary} size={hp("6%")} style={{ position: "relative" }} /> : null}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={hp("2%")}
          onPress={() => {
            setRateTxt("خوب");
          }}
          style={{ position: "absolute", left: wp("56%"), top: hp("50%") }}
        >
          {rateTxt === "خیلی بد" || rateTxt === "بد" || rateTxt === "متوسط" ? (
            <AppIcon family="AntDesign" name="staro" color={colors.darkBlue} size={hp("6%")} style={{ position: "relative" }} />
          ) : null}
          {rateTxt !== "خیلی بد" && rateTxt !== "بد" && rateTxt !== "متوسط" ? <AppIcon family="AntDesign" name="star" color={colors.primary} size={hp("6%")} style={{ position: "relative" }} /> : null}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={hp("2%")}
          onPress={() => {
            setRateTxt("عالی");
          }}
          style={{ position: "absolute", left: wp("68%"), top: hp("50%") }}
        >
          {rateTxt === "خیلی بد" || rateTxt === "بد" || rateTxt === "متوسط" || rateTxt === "خوب" ? (
            <AppIcon family="AntDesign" name="staro" color={colors.darkBlue} size={hp("6%")} style={{ position: "relative" }} />
          ) : null}
          {rateTxt !== "خیلی بد" && rateTxt !== "بد" && rateTxt !== "متوسط" && rateTxt !== "خوب" ? (
            <AppIcon family="AntDesign" name="star" color={colors.primary} size={hp("6%")} style={{ position: "relative" }} />
          ) : null}
        </TouchableOpacity>

        <AppText
          text={rateTxt}
          size={hp("3%")}
          color={colors.secondary}
          style={{
            flex: 0.04,
            top: hp("58%"),
            alignSelf: "center",
          }}
        />

        <View style={{ flex: 0.06 }} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 0.5,
    alignItems: "center",
    top: hp("2%"),
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
});

export default RateTripScreen;

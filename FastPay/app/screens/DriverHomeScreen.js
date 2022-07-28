import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, Platform, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import { readDataAsync } from "../functions/storage_functions";
import storage_keys from "../constants/storage_keys";

const db = SQLite.openDatabase("db.database"); // returns Database object

const DriverHomeScreen = ({ navigation, route }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isBadgeShown, setIsBadgeShown] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      readDataAsync(AsyncStorage, storage_keys.DRIVER_ID).then((response) => {
        setDriverId(response);
        const grabData = async () => {
          const driver_info = await fetchData(db, db_queries.FETCH_DRIVER_INFO_BY_ID, [response]);
          const unConfirmed_transactions_exist = await fetchData(db, db_queries.CHECK_IF_UNCONFIRMED_EXISTS, [response]);
          if (Object.values(unConfirmed_transactions_exist[0])[0] === 0) {
            setIsBadgeShown(false);
          } else {
            setIsBadgeShown(true);
          }
          setDriverInfo(driver_info);
        };
        grabData().catch(console.error);
      });
    });
    return onRefresh;
  }, [navigation]);

  const logout = async () => {
    try {
      await AsyncStorage.setItem(storage_keys.IS_DRIVER_LOGGED_IN, "False");
      console.log("Data successfully saved");
    } catch (e) {
      console.error("Failed to save the data to the storage");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />

          <TouchableOpacity
            onPress={() => {
              setShowAlert(true);
            }}
            style={{ position: "absolute", right: wp("8%"), top: hp("5%") }}
          >
            <AppIcon family="Ionicons" name="exit-outline" color={colors.darkBlue} size={hp("3.5%")} style={{ position: "relative" }} />
          </TouchableOpacity>

          <Image
            style={{
              width: hp("9.5%"),
              height: hp("9.5%"),
              borderRadius: hp("5%"),
              right: wp("49.5%"),
              bottom: wp("2%"),
              alignSelf: "center",
            }}
            source={{
              uri: driverInfo !== null ? driverInfo[0].driver_imageUrl : null,
            }}
          />

          <AppText
            text={driverInfo !== null ? driverInfo[0].driver_firstName + " " + driverInfo[0].driver_lastName : null}
            size={hp("2%")}
            color={colors.secondary}
            style={{ top: hp("14.7%"), textAlign: "center", alignSelf: "center", fontWeight: "600" }}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UnconfirmedTransactions");
            }}
            style={{ position: "absolute", left: wp("8%"), top: hp("5.3%") }}
          >
            <AppIcon family="FontAwesome" name="bell-o" color={colors.darkBlue} size={hp("3%")} style={{ position: "relative" }} />
            {isBadgeShown ? (
              <View
                style={{
                  backgroundColor: colors.redTomato,
                  width: hp("1.8%"),
                  height: hp("1.8%"),
                  borderRadius: hp("1%"),
                  left: wp("3.3%"),
                  top: hp("-3%"),
                  borderWidth: hp("0.2"),
                  borderColor: colors.light,
                  position: "relative",
                }}
              />
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.05 }} />
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DriverTransactions", { driver_id: driverId });
            }}
            style={styles.QRStyle}
          >
            <AppButton width="65%" height="100%" borderRadius={wp("3%")} />
            <AppText text="پرداخت ها" size={hp("2.4%")} color={colors.darkBlue} />
            <AppIcon family="MaterialIcons" name="payment" color={colors.darkBlue} size={hp("3.7%")} style={styles.icon} />
          </TouchableOpacity>

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="خروج از حساب"
            titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.darkBlue }}
            message="از حساب خود خارج میشوید؟"
            messageStyle={{
              fontFamily: "Dirooz",
              fontSize: hp("1.8%"),
              color: colors.secondary,
            }}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="انصراف"
            confirmText="خروج"
            confirmButtonColor={colors.darkBlue}
            cancelButtonColor={colors.medium}
            confirmButtonTextStyle={{ fontFamily: "Dirooz", fontSize: hp("1.8%") }}
            cancelButtonTextStyle={{ fontFamily: "Dirooz", fontSize: hp("2%"), color: colors.darkBlue }}
            contentContainerStyle={{ width: wp("65%"), height: hp("23%") }}
            onCancelPressed={() => {
              setShowAlert(false);
            }}
            onConfirmPressed={() => {
              logout();
              navigation.replace("Signup");
            }}
          />
        </View>
        <View style={{ flex: 0.39 }} />
        <View style={styles.navigation}></View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flex: 0.14,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  header: {
    flex: 0.19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
    paddingTop: StatusBar.currentHeight / 2,
    flexDirection: "row",
  },
  buttons: {
    flex: 0.09,
    alignItems: "center",
  },
  QRStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "65%",
    marginBottom: wp("3.2%"),
    borderRadius: wp("3%"),
    backgroundColor: colors.primary,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  codeStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "68%",
    marginTop: wp("3.2%"),
    borderRadius: wp("3%"),
    backgroundColor: colors.secondary,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  icon: {
    right: "9%",
  },
  title: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    left: "10%",
  },
});

export default DriverHomeScreen;

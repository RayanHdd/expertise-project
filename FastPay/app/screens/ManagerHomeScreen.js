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

const ManagerHomeScreen = ({ navigation }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isBadgeShown, setIsBadgeShown] = useState(false);
  const [managerInfo, setManagerInfo] = useState(null);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      readDataAsync(AsyncStorage, storage_keys.MANAGER_ID).then((response) => {
        const grabData = async () => {
          const manager_info = await fetchData(db, db_queries.FETCH_MANAGER_INFO_BY_ID, [parseInt(response)]);
          const report_exists = await fetchData(db, db_queries.CHECK_IF_REPORT_EXISTS, []);
          if (Object.values(report_exists[0])[0] === 0) {
            setIsBadgeShown(false);
          } else {
            setIsBadgeShown(true);
          }
          setManagerInfo(manager_info);
        };
        grabData().catch(console.error);
      });
    });
    return onRefresh;
  }, [navigation]);

  const logout = async () => {
    try {
      await AsyncStorage.setItem(storage_keys.IS_MANAGER_LOGGED_IN, "False");
      console.log("Data successfully saved");
    } catch (e) {
      alert("Failed to save the data to the storage");
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
            style={{ position: "absolute", right: wp("6%"), top: hp("5%") }}
          >
            <AppIcon family="Ionicons" name="exit-outline" color={colors.darkBlue} size={hp("3.5%")} style={{ position: "relative" }} />
          </TouchableOpacity>

          <Image
            resizeMode="contain"
            style={{
              width: hp("10.5%"),
              height: hp("10.5%"),
              borderRadius: hp("5.5%"),
              left: wp("41.5%"),
              alignSelf: "center",
              position: "absolute",
            }}
            source={{
              uri: managerInfo !== null ? managerInfo[0].manager_imageUri : null,
            }}
          />

          <AppText
            text={managerInfo !== null ? managerInfo[0].manager_firstName + " " + managerInfo[0].manager_lastName : null}
            size={hp("2%")}
            color={colors.secondary}
            style={{ top: hp("14.5%"), textAlign: "center", fontWeight: "600" }}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Reports");
            }}
            style={{ position: "absolute", left: wp("8%"), top: hp("5.35%") }}
          >
            <AppIcon family="FontAwesome" name="bell-o" color={colors.darkBlue} size={hp("3%")} style={{ position: "relative" }} />
            {isBadgeShown ? (
              <View
                style={{
                  backgroundColor: colors.redTomato,
                  width: hp("1.8%"),
                  height: hp("1.8%"),
                  borderRadius: hp("1%"),
                  left: wp("3.2%"),
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
        <View style={styles.title}></View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditTransaction");
            }}
            style={styles.codeStyle}
          >
            <AppButton width="75%" height="65%" borderRadius={hp("1.2%")} color={colors.primary} />
            <AppText text="ویرایش تراکنش" size={hp("2.1%")} color={colors.darkBlue} style={{ left: wp("11%") }} />
            <AppIcon family="Feather" name="edit" size={wp("7%")} color={colors.darkBlue} style={styles.icon} />
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
    flex: 0.18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight / 2,
    flexDirection: "row",
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  buttons: {
    flex: 0.09,
    alignItems: "center",
  },
  codeStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "55%",
    marginTop: hp("1.5%"),
    borderRadius: wp("3%"),
    bottom: hp("10.5%"),
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

export default ManagerHomeScreen;

import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, Platform, SafeAreaView, Linking } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
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

const SettingsScreen = ({ navigation }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
        const grabData = async () => {
          const passenger_info = await fetchData(db, db_queries.FETCH_PASSENGER_INFO_BY_PHONE_NUMBER, [response]);
          setUsername(passenger_info[0].passenger_name);
          setImageUri(passenger_info[0].passenger_imageUri);
        };
        grabData().catch(console.error);
      });
    });
    return onRefresh;
  }, [navigation]);

  const logout = async () => {
    try {
      await AsyncStorage.setItem(storage_keys.IS_SIGNED_UP, "False");
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
          <AppText text="تنظیمات" size={hp("2%")} color={colors.darkBlue} style={{ right: "5%", top: hp("3.5%") }} />
          <Image
            style={{
              width: hp("10%"),
              height: hp("10%"),
              borderRadius: wp("10%"),
              alignSelf: "center",
              bottom: hp("10%"),
            }}
            source={{
              uri: imageUri,
            }}
          />
          <AppText text={username} size={hp("1.9%")} color={colors.secondary} style={{ alignSelf: "center", top: hp("15.2%") }} />
        </View>

        <View style={{ flex: 0.03 }} />
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              navigation.navigate("EditProfile");
            }}
          >
            <AppButton width="80%" height="75%" borderRadius={wp("2%")} color="secondary" />
            <AppIcon family="Feather" name="edit-3" size={hp("2.8%")} style={{ right: wp("6%") }} />
            <AppText text="ویرایش مشخصات کاربری" size={hp("1.8%")} style={{ right: wp("18%") }} />
            <AppIcon family="SimpleLineIcons" name="arrow-left" size={hp("2.4%")} style={{ left: wp("6%") }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.01 }} />

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={async () => {
              const url = "https://shiraz.ir/RContent/13D0JHQ-%D8%AA%D9%85%D8%A7%D8%B3-%D8%A8%D8%A7-%D9%85%D8%A7.aspx";
              await Linking.canOpenURL(url);
              Linking.openURL(url);
            }}
          >
            <AppButton width="80%" height="75%" borderRadius={wp("2%")} color="secondary" />
            <AppText text="ارتباط با ما" size={hp("1.8%")} style={{ right: wp("18%") }} />
            <AppIcon family="SimpleLineIcons" name="arrow-left" size={hp("2.4%")} style={{ left: wp("6%") }} />
            <AppIcon family="Foundation" name="at-sign" size={hp("3.6%")} style={{ right: wp("6%"), opacity: 0.6 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.01 }} />
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={async () => {
              const url = "https://shiraz.ir/RContent/8G9837HMZ-%D8%B4%D9%87%D8%B1%D8%AF%D8%A7%D8%B1-%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2.aspx";
              await Linking.canOpenURL(url);
              Linking.openURL(url);
            }}
          >
            <AppButton width="80%" height="75%" borderRadius={wp("2%")} color="secondary" />
            <AppIcon family="MaterialCommunityIcons" name="card-account-details-star-outline" size={hp("2.8%")} style={{ right: wp("6%") }} />
            <AppText text="درباره ما" size={hp("1.8%")} style={{ right: wp("18%") }} />
            <AppIcon family="SimpleLineIcons" name="arrow-left" size={hp("2.4%")} style={{ left: wp("6%") }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.01 }} />
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              setShowAlert(true);
            }}
            style={styles.exitButton}
          >
            <AppButton width="80%" height="75%" borderRadius={wp("2%")} />
            <AppIcon family="Ionicons" name="exit-outline" size={hp("3.6%")} color={colors.darkBlue} style={{ right: wp("5%") }} />
            <AppText text="خروج از حساب" size={hp("2%")} color={colors.darkBlue} style={{ right: wp("18%") }} />
          </TouchableOpacity>
        </View>
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
        <View style={styles.version}>
          <AppText text="نسخه  ۱.۰.۰" size={hp("1.8%")} color={colors.secondary} />
        </View>
        <View style={{ flex: 0.15 }} />

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
    flex: 0.2,
    justifyContent: "center",
    backgroundColor: colors.light,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  button: {
    flex: 0.0975,
    alignItems: "center",
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "75%",
    borderRadius: wp("2%"),
    margin: wp("1.5%"),
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
  exitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "75%",
    borderRadius: wp("2%"),
    margin: wp("1.5%"),
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
  version: {
    flex: 0.06,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SettingsScreen;

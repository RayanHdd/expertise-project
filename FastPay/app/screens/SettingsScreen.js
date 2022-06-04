import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AwesomeAlert from "react-native-awesome-alerts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import PassengerNavigationMenu from "../components/PassengerNavigationMenu";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import { toFarsiNumber, trimMoney } from "../functions/helperFunctions";
import storage_keys from "../constants/storage_keys";
import { readDataAsync } from "../functions/storage_functions";
import PhoneInput from "react-native-phone-number-input";

const STORAGE_KEY = "@is_signedup";
const db = SQLite.openDatabase("db.database"); // returns Database object

const SettingsScreen = ({ navigation }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
      const grabData = async () => {
        const data2 = await fetchData(db, db_queries.FETCH_PASSENGER_INFO_BY_PHONE_NUMBER, [response]);
        console.log(data2);
        setUsername(data2[0].passenger_name);
        setImageUri(data2[0].passenger_imageUri);
      };
      grabData().catch(console.error);
    });
  }, [navigation]);

  const activeAlert = () => {
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, "False");
      alert("Data successfully saved");
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText
            text="تنظیمات"
            size={wp("3.5%")}
            color={colors.darkBlue}
            style={{ right: "5%", marginBottom: "15%" }}
          />
          {/* <AppIcon
            family="FontAwesome"
            name="user-circle-o"
            color={colors.darkBlue}
            size={wp("15%")}
            style={{ right: wp("42%"), top: wp("15%") }}
          /> */}
          <Image
            style={{
              width: wp("20%"),
              height: wp("20%"),
              borderRadius: wp("10%"),
              left: wp("39%"),
              bottom: hp("10%"),
            }}
            // source={require("../assets/images/profile.jpeg")}
            source={{
              uri: imageUri,
            }}
          />
          <AppText
            text={username}
            size={wp("3.2%")}
            color={colors.secondary}
            style={{ right: "40%", top: wp("34%") }}
          />
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
            <AppIcon family="Feather" name="edit-3" size={wp("5%")} style={{ right: wp("6%") }} />
            <AppText text="ویرایش مشخصات کاربری" size={wp("3.5%")} style={{ right: wp("18%") }} />
            <AppIcon family="SimpleLineIcons" name="arrow-left" size={wp("4.5%")} style={{ left: wp("6%") }} />
          </TouchableOpacity>
        </View>
        {/* <View style={{ flex: 0.01 }} />
        <View style={styles.button}>
          <TouchableOpacity style={styles.optionButton}>
            <AppButton width="80%" height="65%" borderRadius={wp("2%")} color="secondary" />
            <AppIcon
              family="MaterialCommunityIcons"
              name="card-text-outline"
              size={wp("5%")}
              style={{ right: wp("6%") }}
            />
            <AppText text="قوانین و مقررات" size={wp("3.5%")} style={{ right: wp("18%") }} />
            <AppIcon family="SimpleLineIcons" name="arrow-left" size={wp("4.5%")} style={{ left: wp("6%") }} />
          </TouchableOpacity>
        </View> */}
        <View style={{ flex: 0.01 }} />
        <View style={styles.button}>
          <TouchableOpacity style={styles.optionButton}>
            <AppButton width="80%" height="75%" borderRadius={wp("2%")} color="secondary" />
            <AppIcon family="Ionicons" name="notifications-outline" size={wp("6%")} style={{ right: wp("6%") }} />
            <View
              style={{
                backgroundColor: colors.darkBlue,
                width: wp("3.4%"),
                height: wp("3.4%"),
                borderRadius: wp("1.7%"),
                position: "absolute",
                right: wp("5.5%"),
                top: wp("5.6%"),
                borderWidth: wp("0.3"),
                borderColor: colors.secondary,
              }}
            ></View>
            <AppText
              size={wp("2.2%")}
              text="۱"
              color={colors.light}
              style={{ right: wp("7.1%"), top: wp("5.8%"), fontWeight: "bold" }}
            ></AppText>
            <AppText text="اعلان ها" size={wp("3.5%")} style={{ right: wp("18%") }} />
            <AppIcon family="SimpleLineIcons" name="arrow-left" size={wp("4.5%")} style={{ left: wp("6%") }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.01 }} />
        <View style={styles.button}>
          <TouchableOpacity style={styles.optionButton}>
            <AppButton width="80%" height="75%" borderRadius={wp("2%")} color="secondary" />
            <AppIcon
              family="MaterialCommunityIcons"
              name="card-account-details-star-outline"
              size={wp("5%")}
              style={{ right: wp("6%") }}
            />
            <AppText text="درباره ما" size={wp("3.5%")} style={{ right: wp("18%") }} />
            <AppIcon family="SimpleLineIcons" name="arrow-left" size={wp("4.5%")} style={{ left: wp("6%") }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.01 }} />
        <View style={styles.button}>
          <TouchableOpacity onPress={activeAlert} style={styles.exitButton}>
            <AppButton width="80%" height="75%" borderRadius={wp("2%")} />
            <AppIcon
              family="SimpleLineIcons"
              name="logout"
              size={wp("5%")}
              color={colors.darkBlue}
              style={{ right: wp("6%") }}
            />
            <AppText text="خروج از حساب" size={wp("3.5%")} color={colors.darkBlue} style={{ right: wp("18%") }} />
          </TouchableOpacity>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="خروج از حساب"
          titleStyle={{ fontFamily: "Dirooz", fontSize: wp("4%"), color: colors.darkBlue }}
          message="از حساب خود خارج میشوید؟"
          messageStyle={{
            fontFamily: "Dirooz",
            fontSize: wp("3%"),
            color: colors.secondary,
          }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          alertContainerStyle={{ color: colors.light }}
          cancelText="انصراف"
          confirmText="بله"
          confirmButtonColor={colors.darkBlue}
          cancelButtonColor={colors.medium}
          confirmButtonTextStyle={{ fontFamily: "Dirooz", fontSize: wp("3.5%") }}
          cancelButtonTextStyle={{ fontFamily: "Dirooz", fontSize: wp("3.5%"), color: colors.secondary }}
          onCancelPressed={() => {
            hideAlert();
          }}
          onConfirmPressed={() => {
            saveData();
            manipulateData(
              db,
              db_queries.DELETE_PASSENGER_BY_PHONE_NUMBER,
              [989390041011],
              "حساب بسته شد",
              "خطا در خروج از حساب"
            );
            navigation.navigate("Signup");
          }}
        />
        <View style={styles.version}>
          <AppText text="نسخه  ۱.۰.۰" size={wp("3%")} color={colors.secondary} />
        </View>
        <View style={{ flex: 0.15 }} />

        <View style={styles.navigation}>
          {/* <PassengerNavigationMenu width="90%" height="75%" borderRadius={wp("4%")} active="settings" /> */}
        </View>
      </View>
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
    paddingTop: StatusBar.currentHeight,
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

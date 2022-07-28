import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { manipulateData } from "../functions/db_functions";
import { saveData } from "../functions/storage_functions";
import storage_keys from "../constants/storage_keys";

const db = SQLite.openDatabase("db.database"); // returns Database object

const ConfirmationCodeScreen = ({ route, navigation }) => {
  const { phoneNumber, confirmation_code } = route.params;
  const [invalidCode, setInvalidCode] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    setFocus(true);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 0.05 }} />

        <View style={styles.image}>
          <Image style={{ width: "70%", height: "100%" }} source={require("../assets/images/logo.png")} />
        </View>

        <View style={{ flex: 0.02 }} />

        <View style={styles.title}>
          <AppText text="کد فعال سازی" size={hp("1.6%")} color={colors.darkBlue} style={{ right: wp("15%") }} />
        </View>

        <AwesomeAlert
          show={showProgress}
          showProgress
          progressSize={wp("5%")}
          progressColor={colors.darkBlue}
          title="در حال انجام..."
          titleStyle={{ fontFamily: "Dirooz", fontSize: hp("1.6%"), color: colors.darkBlue }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
        />

        <View style={styles.input}>
          <OTPInputView
            style={{
              width: "75%",
              height: "80%",
              color: colors.darkBlue,
              backgroundColor: colors.light,
              borderRadius: wp("2%"),
              padding: wp("2%"),
            }}
            pinCount={5}
            autoFocusOnLoad={focus}
            keyboardType="default"
            selectionColor={colors.darkBlue}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              setShowProgress(false);
              if (code !== confirmation_code) {
                setInvalidCode(true);
                toast.show("کد اشتباه است", {
                  type: "normal",
                  duration: 3000,
                });
              } else {
                setInvalidCode(false);
                manipulateData(db, db_queries.INSERT_PASSENGER, [phoneNumber], "حساب با موفقیت ساخته شد", "خطا در ساخت حساب");
                saveData(AsyncStorage, storage_keys.IS_SIGNED_UP, "True");
                saveData(AsyncStorage, storage_keys.PHONE_NUMBER, phoneNumber);
                navigation.replace("Tabs");
              }
            }}
          />
        </View>

        <View style={styles.subtitle}>
          <AppText text={"کد فعال سازی برای شماره " + "0" + phoneNumber.substr(3) + " " + "ارسال شد!"} size={hp("1.4%")} color={colors.secondary} style={{ right: wp("15%") }} />
        </View>

        <View style={{ flex: 0.04 }} />

        <TouchableOpacity
          onPress={() => {
            if (invalidCode) {
              toast.show("کد اشتباه است", {
                type: "normal",
                duration: 3000,
              });
            } else {
              manipulateData(db, db_queries.INSERT_PASSENGER, [phoneNumber], "حساب با موفقیت ساخته شد", "خطا در ساخت حساب");
              saveData(AsyncStorage, storage_keys.IS_SIGNED_UP, "True");
              saveData(AsyncStorage, storage_keys.PHONE_NUMBER, phoneNumber);
              navigation.replace("Tabs");
            }
          }}
          style={styles.button}
        >
          <AppButton
            borderRadius={wp("3%")}
            width={wp("65%")}
            height="100%"
            style={{
              position: "absolute",
            }}
          />
          <AppText text="تایید" color={colors.darkBlue} size={hp("2.5%")} style={{ textAlign: "center" }} />
        </TouchableOpacity>

        <View style={{ flex: 0.03 }} />

        <TouchableWithoutFeedback onPress={() => navigation.replace("Signup")}>
          <View style={styles.footer}>
            <AppText text="تغییر شماره همراه" color={colors.secondary} size={hp("2%")} style={{ textDecorationLine: "underline" }} />
          </View>
        </TouchableWithoutFeedback>

        <View style={{ flex: 0.37 }} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0.07,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: wp("3%"),
    width: wp("65%"),
    alignSelf: "center",
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  title: {
    flex: 0.03,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 0.04,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    flex: 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 0.07,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  image: {
    flex: 0.22,
    alignItems: "center",
  },
  underlineStyleBase: {
    width: wp("8%"),
    height: hp("5%"),
    borderWidth: 0,
    borderBottomWidth: wp("0.5%"),
    color: colors.darkBlue,
    fontSize: hp("2.4%"),
    fontWeight: "600",
  },
  underlineStyleHighLighted: {
    borderColor: colors.darkBlue,
  },
});

export default ConfirmationCodeScreen;

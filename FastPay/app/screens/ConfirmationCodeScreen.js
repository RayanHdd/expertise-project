import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { checkVerification } from "../api/verify";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import AwesomeAlert from "react-native-awesome-alerts";

import AppButton from "../components/Button";
import AppText from "../components/Text";
import colors from "../config/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import storage_keys from "../constants/storage_keys";
import { saveData } from "../functions/storage_functions";
import db_queries from "../constants/db_queries";
import { manipulateData } from "../functions/db_functions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const ConfirmationCodeScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [invalidCode, setInvalidCode] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    setFocus(true);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 0.05 }} />

        <View style={styles.image}>
          <Image style={{ width: "70%", height: "100%" }} source={require("../assets/images/logo.png")} />
        </View>

        <View style={{ flex: 0.02 }} />

        <View style={styles.title}>
          <AppText text="کد فعال سازی" size={wp("3%")} color={colors.darkBlue} style={{ right: wp("15%") }} />
        </View>

        <AwesomeAlert
          show={showProgress}
          showProgress={true}
          progressSize={wp("5%")}
          progressColor={colors.darkBlue}
          title="در حال انجام..."
          titleStyle={{ fontFamily: "Dirooz", fontSize: wp("3%"), color: colors.darkBlue }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          alertContainerStyle={{ color: colors.light }}
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
            pinCount={6}
            autoFocusOnLoad={focus}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              console.log(`Code is ${code}, you are good to go!`);
              setShowProgress(true);
              checkVerification(phoneNumber, code).then((success) => {
                console.log(success);
                setShowProgress(false);
                if (!success) {
                  setInvalidCode(true);
                  toast.show("کد اشتباه است", {
                    type: "normal",
                    duration: 3000,
                  });
                } else {
                  setInvalidCode(false);
                  manipulateData(
                    db,
                    db_queries.INSERT_PASSENGER,
                    [phoneNumber],
                    "حساب با موفقیت ساخته شد",
                    "خطا در ساخت حساب"
                  );
                  saveData(AsyncStorage, storage_keys.IS_SIGNED_UP, "True");
                  saveData(AsyncStorage, storage_keys.PHONE_NUMBER, phoneNumber);
                  navigation.replace("Tabs");
                }
              });
            }}
          />
        </View>

        <View style={styles.subtitle}>
          <AppText
            text={"کد فعال سازی برای شماره " + phoneNumber.substr(1) + " " + "ارسال شد!"}
            size={wp("2.5%")}
            color={colors.secondary}
            style={{ right: wp("15%") }}
          />
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
              navigation.replace("Tabs");
            }
          }}
          style={styles.button}
        >
          <AppButton
            borderRadius={wp("3%")}
            width={wp("60%")}
            height="100%"
            style={{
              position: "absolute",
            }}
          />
          <AppText text="تایید" color={colors.darkBlue} size={wp("4.2%")} style={{ right: wp("26%") }} />
        </TouchableOpacity>

        <View style={{ flex: 0.03 }} />

        <TouchableWithoutFeedback onPress={() => navigation.replace("Signup")}>
          <View style={styles.footer}>
            <AppText
              text="تغییر شماره همراه"
              color={colors.secondary}
              size={wp("3.6%")}
              style={{ textDecorationLine: "underline" }}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={{ flex: 0.37 }} />
      </View>
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
    width: wp("60%"),
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
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: wp("0.5%"),
    color: colors.darkBlue,
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  underlineStyleHighLighted: {
    borderColor: colors.darkBlue,
  },
});

export default ConfirmationCodeScreen;

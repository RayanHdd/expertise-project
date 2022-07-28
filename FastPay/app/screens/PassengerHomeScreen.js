import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image, Platform, SafeAreaView, Keyboard } from "react-native";
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
import { toEnglishNumber, toFarsiNumber, trimMoney } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const PassengerHomeScreen = ({ navigation }) => {
  const [walletCharge, setWalletCharge] = useState(0);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
        const grabData = async () => {
          const wallet_charge = await fetchData(db, db_queries.GET_WALLET_CHARGE_BY_PHONE_NUMBER, [response]);
          const passenger_info = await fetchData(db, db_queries.FETCH_PASSENGER_INFO_BY_PHONE_NUMBER, [response]);
          setWalletCharge(wallet_charge[0].passenger_walletCharge);
          setImageUri(passenger_info[0].passenger_imageUri);
          if (response !== null) setUserPhoneNumber(response);
        };
        grabData().catch(console.error);
      });
    });
    return onRefresh;
  }, [navigation]);

  const ifCodeExists = async () => {
    if (confirmationCode === null || confirmationCode.length !== 6) {
      Keyboard.dismiss();
      toast.show("کد پذیرنده باید ۶ رقمی باشد", {
        type: "normal",
        duration: 3000,
      });
    } else {
      const data = await fetchData(db, db_queries.CHECK_IF_CODE_EXISTS, [toEnglishNumber(confirmationCode)]);
      if (Object.values(data[0])[0] === 0) {
        Keyboard.dismiss();
        toast.show("کد وارد شده موجود نیست", {
          type: "normal",
          duration: 3000,
        });
      } else {
        setShowAlert(false);
        navigation.navigate("Payment", {
          acceptor_code: confirmationCode,
          wallet_charge: walletCharge,
          passenger_phone: userPhoneNumber,
        });
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <Image
            style={{ width: wp("14%"), height: wp("14%"), borderRadius: wp("7%"), right: wp("12%"), bottom: wp("2%") }}
            source={{
              uri: imageUri,
            }}
          />
          <AppText text="موجودی کیف پول :" size={hp("1.9%")} color={colors.secondary} style={{ right: "25%", marginBottom: "8%" }} />
          <AppText
            text={trimMoney(toFarsiNumber(walletCharge)) + " تومان"}
            size={hp("2.4%")}
            color={parseInt(walletCharge) < 2000 ? "red" : colors.darkBlue}
            style={{ right: "25%", top: hp("7.5%") }}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("WalletCharge", { currentWalletCharge: walletCharge });
            }}
            style={{
              position: "absolute",
            }}
          >
            <AppButton
              width={hp("6%")}
              height={hp("6%")}
              borderRadius={wp("2.5%")}
              style={{
                marginRight: wp("75%"),
                top: hp("0.7%"),
              }}
            />
            <AppIcon family="MaterialCommunityIcons" name="plus" color={colors.darkBlue} size={hp("3.8%")} style={{ left: hp("1.2%"), top: hp("1.6%") }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.05 }} />
        <View style={styles.title}>
          <AppText text="روش پرداخت را مشخص کنید" size={wp("4%")} color={colors.darkBlue} />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("BarCodeScan", { wallet_charge: walletCharge, passenger_phone: userPhoneNumber });
            }}
            style={styles.QRStyle}
          >
            <AppButton width="75%" height="65%" borderRadius={wp("3%")} />
            <AppText text="پرداخت با اسکن بارکد" size={hp("2%")} color={colors.darkBlue} />
            <AppIcon family="MaterialCommunityIcons" name="qrcode-scan" color={colors.darkBlue} size={wp("6.5%")} style={styles.icon} />
          </TouchableOpacity>

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            customView={
              <TextInput
                value={confirmationCode}
                keyboardType="numeric"
                selectionColor={colors.darkBlue}
                onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                  if (keyValue === "Backspace") {
                    setConfirmationCode(confirmationCode.slice(0, confirmationCode.length - 1));
                  }
                }}
                onChangeText={(code) => {
                  if (confirmationCode !== null) setConfirmationCode(confirmationCode + toFarsiNumber(code));
                  else setConfirmationCode(toFarsiNumber(code));
                }}
                style={{
                  width: "90%",
                  height: "35%",
                  borderRadius: wp("2%"),
                  borderWidth: hp("0.2%"),
                  borderColor: colors.darkBlue,
                  backgroundColor: colors.light,
                  textAlign: "center",
                  marginTop: wp("4%"),
                  fontFamily: "Dirooz",
                  fontSize: hp("2.5%"),
                }}
              />
            }
            title="کد پذیرنده راننده"
            titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.darkBlue }}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            showCancelButton={true}
            cancelText="انصراف"
            confirmText="تایید"
            confirmButtonTextStyle={{ fontSize: hp("2.2%"), fontFamily: "Dirooz", color: "white" }}
            cancelButtonTextStyle={{ fontSize: hp("2.2%"), fontFamily: "Dirooz", color: colors.darkBlue }}
            contentContainerStyle={{ width: wp("70%"), height: hp("35%") }}
            cancelButtonStyle={{ marginRight: wp("5%") }}
            confirmButtonColor={colors.darkBlue}
            cancelButtonColor={colors.medium}
            onCancelPressed={() => {
              setShowAlert(false);
              setConfirmationCode(null);
            }}
            onConfirmPressed={() => {
              ifCodeExists();
            }}
          />

          <TouchableOpacity
            onPress={() => {
              setShowAlert(true);
            }}
            style={styles.codeStyle}
          >
            <AppButton width="75%" height="65%" borderRadius={wp("3%")} color="secondary" />
            <AppText text="پرداخت با کد پذیرنده" size={hp("2%")} />
            <AppIcon family="MaterialCommunityIcons" name="cellphone-iphone" size={wp("7%")} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.35 }} />
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
    backgroundColor: colors.medium,
  },
  header: {
    flex: 0.12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
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
    flex: 0.22,
    alignItems: "center",
  },
  QRStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "68%",
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

export default PassengerHomeScreen;

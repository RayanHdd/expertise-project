import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import { toFarsiNumber, trimMoney } from "../functions/helperFunctions";
import storage_keys from "../constants/storage_keys";
import { readDataAsync } from "../functions/storage_functions";
import AwesomeAlert from "react-native-awesome-alerts";

const db = SQLite.openDatabase("db.database"); // returns Database object

const DriverHomeScreen = ({ navigation }) => {
  const [walletCharge, setWalletCharge] = useState(0);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  //   useEffect(() => {
  //     const onRefresh = navigation.addListener("focus", () => {
  //       readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
  //         const grabData = async () => {
  //           const data2 = await fetchData(db, db_queries.GET_WALLET_CHARGE_BY_PHONE_NUMBER, [response]);
  //           const data3 = await fetchData(db, db_queries.FETCH_PASSENGER_INFO_BY_PHONE_NUMBER, [response]);
  //           // const data3 = await fetchData(db, db_queries.FETCH_PASSENGERS, []);
  //           console.log(data3);
  //           setWalletCharge(data2[0].passenger_walletCharge);
  //           setImageUri(data3[0].passenger_imageUri);
  //           if (response !== null) setUserPhoneNumber(response);
  //         };
  //         grabData().catch(console.error);
  //       });
  //     });
  //     return onRefresh;
  //   }, [navigation]);

  const hideAlert = () => {
    setShowAlert(false);
    setConfirmationCode(null);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />

          <AppIcon
            family="Feather"
            name="menu"
            color={colors.darkBlue}
            size={wp("7%")}
            style={{ right: wp("8%"), top: hp("5.5%") }}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("WalletCharge", { currentWalletCharge: walletCharge });
              console.log(userPhoneNumber);
            }}
            style={{ position: "absolute" }}
          >
            <AppIcon
              family="FontAwesome"
              name="bell-o"
              color={colors.darkBlue}
              size={wp("7%")}
              style={{ right: wp("35%"), bottom: hp("-2.8%") }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.05 }} />
        <View style={styles.title}></View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("BarCodeScan", { wallet_charge: walletCharge, passenger_phone: userPhoneNumber });
            }}
            style={styles.QRStyle}
          >
            <AppButton width="65%" height="60%" borderRadius={wp("3%")} />
            <AppText text="پرداخت ها" size={wp("4%")} color={colors.darkBlue} />
            <AppIcon
              family="MaterialIcons"
              name="payment"
              color={colors.darkBlue}
              size={wp("6.5%")}
              style={styles.icon}
            />
          </TouchableOpacity>

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            customView={
              <TextInput
                value={confirmationCode}
                keyboardType="numeric"
                onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                  console.log(keyValue);
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
                  borderWidth: wp("0.2%"),
                  borderColor: colors.darkBlue,
                  backgroundColor: colors.light,
                  textAlign: "center",
                  fontSize: wp("5%"),
                  color: colors.darkBlue,
                  fontFamily: "Dirooz",
                  marginTop: wp("4%"),
                }}
              />
            }
            title="کد پذیرنده راننده"
            titleStyle={{ fontFamily: "Dirooz", fontSize: wp("4%"), color: colors.darkBlue }}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            showCancelButton={true}
            cancelText={<AppText size={wp("4.5%")} text="انصراف" color={colors.darkBlue} />}
            confirmText={<AppText size={wp("4.5%")} text="تایید" color="white" />}
            alertContainerStyle={{ color: colors.light }}
            contentContainerStyle={{ width: wp("70%"), height: hp("35%") }}
            cancelButtonStyle={{ marginRight: wp("5%") }}
            confirmButtonColor={colors.darkBlue}
            cancelButtonColor={colors.medium}
            onCancelPressed={hideAlert}
            onConfirmPressed={() => {
              hideAlert();
              navigation.navigate("Payment", {
                acceptor_code: confirmationCode,
                wallet_charge: walletCharge,
                passenger_phone: userPhoneNumber,
              });
            }}
          />

          <TouchableOpacity
            onPress={() => {
              setShowAlert(true);
            }}
            style={styles.codeStyle}
          >
            <AppButton width="75%" height="65%" borderRadius={wp("3%")} color="secondary" />
            <AppText text="پرداخت با کد پذیرنده" size={wp("3.5%")} />
            <AppIcon family="MaterialCommunityIcons" name="cellphone-iphone" size={wp("7%")} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.39 }} />
        <View style={styles.navigation}></View>
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
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
    flexDirection: "row",
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

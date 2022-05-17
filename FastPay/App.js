import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import LottieView from "lottie-react-native";

import PassengerHomeScreen from "./app/screens/PassengerHomeScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import TransactionsScreen from "./app/screens/TransactionsScreen";
import WalletChargeScreen from "./app/screens/WalletChargeScreen";
import EditProfileScreen from "./app/screens/EditProfileScreen";
import TransactionDetailsScreen from "./app/screens/TransactionDetailsScreen";
import PaymentScreen from "./app/screens/PaymentScreen";
import ConfirmationCodeScreen from "./app/screens/ConfirmationCodeScreen";
import SignupScreen from "./app/screens/SignupScreen";
import Toast from "react-native-toast-notifications";
import colors from "./app/config/colors";
import Tabs from "./app/navigation/Tabs";
import BarCodeScanScreen from "./app/screens/BarCodeScanScreen";
import db_queries from "./app/constants/db_queries";
import { createOrDropTable, manipulateData } from "./app/functions/db_functions";
import storage_keys from "./app/constants/storage_keys";
import { readData } from "./app/functions/storage_functions";

const Stack = createNativeStackNavigator();
const db = SQLite.openDatabase("db.database"); // returns Database object

export default function App() {
  const [signedup, setSignedup] = useState("");
  const [splashShown, setSplashShown] = useState(true);

  useEffect(() => {
    const grabData = async () => {
      const data = await readData(AsyncStorage, storage_keys.IS_SIGNED_UP);
      if (data !== null) setSignedup(data);
    };
    grabData().catch(console.error);
  }, []);

  useEffect(() => {
    // createOrDropTable(db, "passenger_table", db_queries.CREATE_PASSENGER_TABLE);
    // createOrDropTable(db, "driver_table", db_queries.DROP_DRIVER_TABLE);
    // createOrDropTable(db, "driver_table", db_queries.CREATE_DRIVER_TABLE);
    // createOrDropTable(db, "passenger_table", db_queries.DROP_PASSENGER_TABLE);
    // createOrDropTable(db, "transaction_table", db_queries.CREATE_TRANSACTION_TABLE);
    // createOrDropTable(db, "transaction_table", db_queries.DROP_TRANSACTION_TABLE);
    // manipulateData(
    //   db,
    //   db_queries.INSERT_DRIVER,
    //   ["aliH", "aliH123", 989390041011, "علی", "هاشمی", 123456, "سمند زرد", "۹۳-ایران-۳۴۵-ج-۱۲"],
    //   "حساب راننده با موفقیت ساخته شد",
    //   "خطا در ساخت حساب راننده"
    // );
    // manipulateData(db, db_queries.INSERT_TRANSACTION, [100, "14001-4-5", "میدان معلم", "پل احسان", 1, 1]);
  }, []);

  setTimeout(() => {
    setSplashShown(false);
  }, 2200);

  return (
    <>
      {!splashShown && (
        <NavigationContainer>
          <Stack.Navigator>
            {signedup === "True" ? (
              <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
            ) : null}
            <Stack.Screen options={{ headerShown: false }} name="Signup" component={SignupScreen} />
            <Stack.Screen options={{ headerShown: false }} name="ConfirmationCode" component={ConfirmationCodeScreen} />
            <Stack.Screen options={{ headerShown: false }} name="BarCodeScan" component={BarCodeScanScreen} />
            <Stack.Screen options={{ headerShown: false }} name="WalletCharge" component={WalletChargeScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Payment" component={PaymentScreen} />
            {signedup === "False" ? (
              <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
            ) : null}
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <Toast
        normalColor={colors.darkBlue}
        textStyle={{ color: colors.light, fontFamily: "Dirooz", fontSize: wp("3%") }}
        ref={(ref) => (global["toast"] = ref)}
      />
      {splashShown && <LottieView source={require("./app/assets/splash5.json")} autoPlay />}
      {splashShown && (
        <LottieView
          source={require("./app/assets/loading.json")}
          autoPlay
          style={{
            justifyContent: "center",
            marginLeft: wp("5%"),
            width: wp("80%"),
            height: wp("20%"),
            marginTop: hp("40%"),
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});

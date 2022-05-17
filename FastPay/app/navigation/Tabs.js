import React, { useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import colors from "../config/colors";

import PassengerHomeScreen from "../screens/PassengerHomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
// import * as SQLite from "expo-sqlite";
// import db_queries from "../constants/db_queries";
// import { createOrDropTable, manipulateData } from "../functions/db_functions";

// const db = SQLite.openDatabase("db.database"); // returns Database object

const Tab = createBottomTabNavigator();

const Tabs = () => {
  // useEffect(() => {
  //   // createOrDropTable(db, "passenger_table", db_queries.CREATE_PASSENGER_TABLE);
  //   // createOrDropTable(db, "driver_table", db_queries.DROP_DRIVER_TABLE);
  //   // createOrDropTable(db, "driver_table", db_queries.CREATE_DRIVER_TABLE);
  //   // createOrDropTable(db, "passenger_table", db_queries.DROP_PASSENGER_TABLE);
  //   // createOrDropTable(db, "transaction_table", db_queries.CREATE_TRANSACTION_TABLE);
  //   // manipulateData(
  //   //   db,
  //   //   db_queries.INSERT_DRIVER,
  //   //   ["aliH", "aliH123", 989390041011, "علی", "هاشمی", 123456, "سمند زرد", "۹۳-ایران-۳۴۵-ج-۱۲"],
  //   //   "حساب راننده با موفقیت ساخته شد",
  //   //   "خطا در ساخت حساب راننده"
  //   // );
  // }, []);

  return (
    <Tab.Navigator
      initialRouteName="PassengerHome"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: hp("2%"),
          left: wp("5%"),
          elevation: 0,
          justifyContent: "center",
          backgroundColor: colors.light,
          borderRadius: wp("4%"),
          width: wp("90%"),
          height: hp("10.5%"),
          ...styles.shadow,
        },
      }}
      //   tabBarOptions={{
      //     showLabel: false,
      //     style: {
      //       position: "absolute",
      //       bottom: 25,
      //       left: 20,
      //       right: 20,
      //       elevation: 0,
      //       backgroundColor: "#ffffff",
      //       borderRadius: 15,
      //       height: 90,
      //     },
      //   }}
    >
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: wp("-1.7%") }}>
              <AppIcon
                family="MaterialIcons"
                name="settings"
                size={wp("7%")}
                color={focused ? colors.darkBlue : colors.secondary}
                style={{}}
              />
              <AppText
                text="تنظیمات"
                size={wp("2.8%")}
                color={focused ? colors.darkBlue : colors.secondary}
                style={{ top: wp("2.7%") }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="PassengerHome"
        component={PassengerHomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: wp("-1.7%") }}>
              <View style={[styles.taxiIcon, { borderColor: focused ? colors.darkBlue : colors.secondary }]}></View>
              <AppText
                text="کرایه"
                size={wp("3%")}
                color={focused ? colors.darkBlue : colors.secondary}
                style={{ bottom: wp("12%") }}
              />
              <Image
                source={require("../assets/images/taxi.png")}
                style={{
                  width: wp("7.5%"),
                  height: wp("7.5%"),
                  //   left: wp("42.3%"),
                  bottom: wp("4.5%"),
                  opacity: focused ? 1.5 : 0.45,
                }}
              />
              <View style={styles.border}></View>
              <AppText
                text="پرداخت"
                size={wp("3%")}
                color={focused ? colors.darkBlue : colors.secondary}
                style={{ bottom: wp("-4.7%") }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: wp("-1.5%") }}>
              <AppIcon
                family="FontAwesome5"
                name="money-check"
                size={wp("5.5%")}
                color={focused ? colors.darkBlue : colors.secondary}
                style={{}}
              />
              <AppText
                text="تراکنش ها"
                size={wp("2.8%")}
                color={focused ? colors.darkBlue : colors.secondary}
                style={{ top: wp("2.5%") }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: wp("1%"),
    },
    shadowOpacity: 0.25,
    shadowRadius: wp("1%"),
    elevation: wp("1%"),
  },
  taxiIcon: {
    width: wp("18%"),
    height: wp("18%"),
    backgroundColor: colors.light,
    // left: wp("37%"),
    borderRadius: wp("9%"),
    borderWidth: wp("1.8%"),
    bottom: wp("1.4%"),
    position: "absolute",
  },
  border: {
    width: wp("22%"),
    height: wp("22%"),
    backgroundColor: null,
    // left: wp("35%"),
    borderRadius: wp("11%"),
    borderColor: colors.medium,
    borderWidth: wp("2%"),
    bottom: wp("-0.3%"),
    position: "absolute",
  },
});

export default Tabs;

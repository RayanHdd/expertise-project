import React, { useEffect } from "react";
import { StyleSheet, View, Image, BackHandler } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import PassengerHomeScreen from "../screens/PassengerHomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TransactionsScreen from "../screens/TransactionsScreen";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);

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
          height: hp("10%"),
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: wp("-2%") }}>
              <AppIcon family="MaterialIcons" name="settings" size={hp("3.8%")} color={focused ? colors.darkBlue : colors.secondary} style={{}} />
              <AppText text="تنظیمات" size={hp("1.7%")} color={focused ? colors.darkBlue : colors.secondary} style={{ top: hp("1.7%") }} />
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
              <AppText text="کرایه" size={wp("3%")} color={focused ? colors.darkBlue : colors.secondary} style={{ bottom: wp("12%") }} />
              <Image
                source={require("../assets/images/taxi.png")}
                style={{
                  width: wp("7.5%"),
                  height: wp("7.5%"),
                  bottom: wp("4.5%"),
                  opacity: focused ? 1.5 : 0.45,
                }}
              />
              <View style={styles.border}></View>
              <AppText text="پرداخت" size={hp("1.8%")} color={focused ? colors.darkBlue : colors.secondary} style={{ bottom: hp("-3%") }} />
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
            <View style={{ alignItems: "center", justifyContent: "center", top: wp("-2%") }}>
              <AppIcon family="FontAwesome5" name="money-check" size={hp("3.2%")} color={focused ? colors.darkBlue : colors.secondary} style={{}} />
              <AppText text="تراکنش ها" size={hp("1.7%")} color={focused ? colors.darkBlue : colors.secondary} style={{ top: hp("1.7%") }} />
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
    borderRadius: wp("9%"),
    borderWidth: wp("1.8%"),
    bottom: wp("1.4%"),
    position: "absolute",
  },
  border: {
    width: wp("22%"),
    height: wp("22%"),
    backgroundColor: null,
    borderRadius: wp("11%"),
    borderColor: colors.medium,
    borderWidth: wp("2%"),
    bottom: wp("-0.3%"),
    position: "absolute",
  },
});

export default Tabs;

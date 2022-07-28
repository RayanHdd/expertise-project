import React, { useEffect } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import ManagerDriversScreen from "../screens/ManagerDriversScreen";
import ManagerHomeScreen from "../screens/ManagerHomeScreen";
import ManagerTransactionsScreen from "../screens/ManagerTransactionsScreen";

const Tab = createBottomTabNavigator();

const ManagerTabs = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="ManagerHome"
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
        name="ManagerDrivers"
        component={ManagerDriversScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: hp("-1%") }}>
              <AppIcon
                family="MaterialCommunityIcons"
                name="card-account-details-outline"
                size={hp("4%")}
                color={focused ? colors.darkBlue : colors.secondary}
                style={{ top: hp("-2.5%") }}
              />
              <AppText text="راننده ها" size={hp("1.9%")} color={focused ? colors.darkBlue : colors.secondary} style={{ top: hp("1%") }} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ManagerHome"
        component={ManagerHomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: hp("0.5%") }}>
              <View style={[styles.taxiIcon, { borderColor: focused ? colors.darkBlue : colors.secondary }]}></View>
              <AppIcon
                family="AntDesign"
                name="home"
                color={colors.darkBlue}
                size={hp("4.5%")}
                style={{
                  bottom: hp("3%"),
                  opacity: focused ? 1.5 : 0.45,
                }}
              />
              <View style={styles.border}></View>
              <AppText text="خانه" size={hp("2.3%")} color={focused ? colors.darkBlue : colors.secondary} style={{ bottom: hp("-4.2%") }} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ManagerTransactions"
        component={ManagerTransactionsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: wp("-1.5%") }}>
              <AppIcon family="FontAwesome5" name="money-check" size={hp("3.3%")} color={focused ? colors.darkBlue : colors.secondary} style={{ top: hp("-2.5") }} />
              <AppText text="تراکنش ها" size={hp("1.8%")} color={focused ? colors.darkBlue : colors.secondary} style={{ top: hp("1%") }} />
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

export default ManagerTabs;

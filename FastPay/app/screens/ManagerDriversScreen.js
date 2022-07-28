import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, FlatList, Platform, SafeAreaView, Image, TextInput, Keyboard } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import LottieView from "lottie-react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import DriverCard from "../components/DriverCard";
import { fetchData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import { toFarsiNumber, toEnglishNumber } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const ManagerDriversScreen = ({ navigation }) => {
  const [drivers, setDrivers] = useState(null);
  const [progressBar, setProgressBar] = useState(false);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [isEmptyFilterResult, setIsEmptyFilterResult] = useState(false);
  const [filteredDrivers, setFilteredDrivers] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [acceptorCode, setAcceptorCode] = useState(null);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      getDrivers();
    });
    return onRefresh;
  }, [navigation]);

  const getDrivers = () => {
    setIsEmptyFilterResult(false);
    const grabData = async () => {
      const fetched_drivers = await fetchData(db, db_queries.FETCH_DRIVERS, []);
      if (fetched_drivers.length === 0) setIsEmptyResult(true);
      else {
        setIsEmptyResult(false);
      }
      setDrivers(fetched_drivers);
    };
    grabData().catch(console.error);
    setFilteredDrivers(null);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DriverDetails", {
            driver_name: item.driver_firstName + " " + item.driver_lastName,
            driver_code: item.driver_acceptorCode,
            driver_car: item.driver_carModel,
            driver_phone: item.driver_phone,
            driver_image: item.driver_imageUrl,
            driver_numberplate: item.driver_numberplate,
            driver_score: item.driver_score,
          });
        }}
      >
        <DriverCard
          width={wp("90%")}
          height={hp("10%")}
          borderRadius={hp("1.2%")}
          name={item.driver_firstName + " " + item.driver_lastName}
          acceptorCode={item.driver_acceptorCode}
          score={item.driver_score}
          iconUrl={item.driver_imageUrl}
        />
      </TouchableOpacity>
    );
  };

  const getFilteredDrivers = () => {
    if (filteredDrivers === null) {
      const code = parseInt(toEnglishNumber(acceptorCode));
      const result = drivers.filter((item) => {
        return item.driver_acceptorCode === code;
      });
      if (result.length === 0) {
        setIsEmptyFilterResult(true);
      } else {
        setIsEmptyFilterResult(false);
      }
      setFilteredDrivers(result);
      return result;
    } else {
      return filteredDrivers;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="راننده ها" size={hp("2.2%")} color={colors.darkBlue} style={{ right: "5%", marginBottom: "12%" }} />

          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => {
              setProgressBar(true);
              setTimeout(() => {
                setProgressBar(false);
              }, 600);
              setAcceptorCode(null);
              getDrivers();
            }}
          >
            <AppIcon family="Feather" name="refresh-ccw" color={colors.darkBlue} size={hp("3%")} style={{ marginLeft: wp("7%"), marginBottom: "8%", position: "relative" }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowAlert(true);
            }}
            style={styles.filterBtn}
          >
            <AppButton width={wp("40%")} height={wp("13%")} borderRadius={wp("2%")} />
            <AppText text="فیلتر" size={hp("2.3%")} color={colors.darkBlue} style={{ right: wp("18%") }} />
            <AppIcon family="Ionicons" name="filter" size={hp("2.8%")} color={colors.darkBlue} style={{ right: wp("10%") }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.03 }} />

        {isEmptyResult || isEmptyFilterResult ? (
          <Image
            style={{
              width: wp("60%"),
              height: hp("70%"),
              borderRadius: wp("7%"),
              left: wp("20%"),
              top: hp("5%"),
              position: "absolute",
            }}
            source={require("../assets/images/search_file.png")}
          />
        ) : null}
        {isEmptyResult || isEmptyFilterResult ? <AppText text="موردی یافت نشد!" size={hp("3%")} color={colors.secondary} style={{ top: hp("55%"), alignSelf: "center" }} /> : null}

        <View style={styles.card}>
          {!progressBar ? (
            <FlatList
              data={acceptorCode !== null && acceptorCode.length === 6 ? getFilteredDrivers() : drivers}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item) => item.driver_id}
              extraData={drivers}
            />
          ) : null}
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          customView={
            <TextInput
              value={acceptorCode}
              keyboardType="numeric"
              selectionColor={colors.darkBlue}
              onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                if (keyValue === "Backspace" && acceptorCode !== null && acceptorCode.length !== 0) {
                  setAcceptorCode(acceptorCode.slice(0, acceptorCode.length - 1));
                }
              }}
              onChangeText={(code) => {
                if (acceptorCode !== null) setAcceptorCode(acceptorCode + toFarsiNumber(code));
                else setAcceptorCode(toFarsiNumber(code));
              }}
              style={{
                width: "90%",
                height: "30%",
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
          title="فیلتر راننده ها"
          titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.secondary }}
          message="لطفا کد پذیرنده راننده را وارد کنید :"
          messageStyle={{ color: colors.darkBlue, fontSize: hp("2%"), marginTop: hp("2%"), fontFamily: "Dirooz", marginBottom: hp("0.5%") }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          showCancelButton={true}
          cancelText="انصراف"
          confirmText="تایید"
          confirmButtonTextStyle={{ fontSize: hp("2.4%"), fontFamily: "Dirooz", color: "white" }}
          cancelButtonTextStyle={{ fontSize: hp("2.4%"), fontFamily: "Dirooz", color: colors.darkBlue }}
          contentContainerStyle={{ width: wp("80%"), height: hp("40%") }}
          cancelButtonStyle={{ marginRight: wp("5%") }}
          confirmButtonColor={colors.darkBlue}
          cancelButtonColor={colors.medium}
          onCancelPressed={() => {
            setShowAlert(false);
            setAcceptorCode(null);
          }}
          onConfirmPressed={() => {
            if (acceptorCode === null || acceptorCode.length !== 6) {
              Keyboard.dismiss();
              toast.show("کد پذیرنده باید ۶ رقمی باشد", {
                type: "normal",
                duration: 3000,
              });
            } else {
              setShowAlert(false);
              setFilteredDrivers(null);
            }
          }}
        />

        {progressBar && (
          <LottieView
            source={require("../assets/animations/progress_bar.json")}
            loop={false}
            autoPlay
            style={{
              alignSelf: "center",
            }}
          />
        )}

        <View style={{ flex: 0.02 }} />

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
    flex: 0.14,
    justifyContent: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  card: {
    flex: 0.62,
    alignItems: "center",
  },
  filterBtn: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: hp("2.8%"),
    left: "30%",
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
});

export default ManagerDriversScreen;

import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, FlatList, Platform, SafeAreaView, Image } from "react-native";
import LottieView from "lottie-react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import { toFarsiNumber, gregorian_to_jalali, trimMoney, trimDatetime } from "../functions/helperFunctions";
import TransactionCard from "../components/TransactionCard";
import { readDataAsync } from "../functions/storage_functions";
import storage_keys from "../constants/storage_keys";

const db = SQLite.openDatabase("db.database"); // returns Database object

const UnconfirmedTransactionsScreen = ({ navigation, route }) => {
  const [transactions, setTransactions] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [driverImage, setDriverImage] = useState(null);
  const [drivercode, setDriverCode] = useState(null);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      getTransactions();
    });
    return onRefresh;
  }, [navigation]);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = () => {
    readDataAsync(AsyncStorage, storage_keys.DRIVER_ID).then((response) => {
      const grabData = async () => {
        const unconfirmed_transactions = await fetchData(db, db_queries.FETCH_UNCONFIRMED_TRANSACTIONS_BY_DRIVER_ID, [response]);
        if (unconfirmed_transactions.length === 0) setIsEmptyResult(true);
        else {
          setIsEmptyResult(false);
          const image = await fetchData(db, db_queries.GET_DRIVER_IMAGE_BY_ID, [response]);
          const name = await fetchData(db, db_queries.GET_DRIVER_NAME_BY_ID, [response]);
          const code = await fetchData(db, db_queries.GET_DRIVER_CODE_BY_ID, [response]);
          setDriverImage(image);
          setDriverName(name);
          setDriverCode(code);
        }
        setTransactions(unconfirmed_transactions);
      };
      grabData().catch(console.error);
    });
  };

  const renderItem = ({ item }) => {
    const date = item.transaction_dateTime.split("-");
    const formattedDate = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("TransactionConfirmation", {
            driver_name: driverName,
            driver_code: drivercode[0].driver_acceptorCode,
            transaction_source: item.transaction_source,
            transaction_destination: item.transaction_destination,
            dateTime: item.transaction_dateTime,
            cost: item.transaction_cost,
            driver_image: driverImage[0].driver_imageUrl,
            driver_id: item.driver_id,
            passenger_id: item.passenger_id,
            transaction_id: item.transaction_id,
            transaction_passengerCount: item.transaction_passengerCount,
          });
        }}
      >
        <TransactionCard
          width={wp("90%")}
          height={hp("10%")}
          borderRadius={hp("1.2%")}
          iconType="rent"
          iconUrl={driverImage[0].driver_imageUrl}
          title={driverName !== null ? "پرداخت به " + driverName[0].driver_firstName + " " + driverName[0].driver_lastName : "پرداخت به "}
          date={`${toFarsiNumber(formattedDate[0])}/${trimDatetime(toFarsiNumber(formattedDate[1]))}/${trimDatetime(toFarsiNumber(formattedDate[2]))}`}
          time={`${trimDatetime(toFarsiNumber(date[3]))}:${trimDatetime(toFarsiNumber(date[4]))}:${trimDatetime(toFarsiNumber(date[5]))}`}
          price={trimMoney(toFarsiNumber(parseInt(item.transaction_cost)))}
          type="plus"
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="تراکنش های در صف تایید" size={hp("2.2%")} color={colors.darkBlue} style={{ top: hp("7%"), alignSelf: "center" }} />

          <TouchableOpacity
            style={{ position: "absolute", left: wp("8%"), top: hp("5%") }}
            onPress={() => {
              navigation.navigate("DriverHome");
            }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("4%")} style={{ position: "relative" }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", right: wp("7%"), top: hp("5%") }}
            onPress={() => {
              setLoadingBar(true);
              setTimeout(() => {
                setLoadingBar(false);
              }, 600);
              getTransactions();
            }}
          >
            <AppIcon family="Feather" name="refresh-ccw" color={colors.darkBlue} size={hp("3.2%")} style={{ position: "relative" }} />
          </TouchableOpacity>
        </View>

        {isEmptyResult && !loadingBar ? (
          <Image
            style={{
              width: wp("60%"),
              height: hp("70%"),
              borderRadius: wp("7%"),
              alignSelf: "center",
              top: hp("5%"),
              position: "absolute",
            }}
            source={require("../assets/images/search_file.png")}
          />
        ) : null}

        {isEmptyResult && !loadingBar ? <AppText text="موردی یافت نشد!" size={hp("3%")} color={colors.secondary} style={{ top: hp("55%"), alignSelf: "center" }} /> : null}

        <View style={{ flex: 0.04 }} />
        <View style={styles.card}>
          {!loadingBar && !isEmptyResult ? (
            <FlatList data={transactions} showsVerticalScrollIndicator={false} renderItem={renderItem} keyExtractor={(item) => item.transaction_id} extraData={transactions} />
          ) : null}
        </View>

        {loadingBar && (
          <LottieView
            source={require("../assets/animations/progress_bar.json")}
            loop={false}
            autoPlay
            style={{
              alignSelf: "center",
            }}
          />
        )}

        <View style={{ flex: 0.04 }} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  header: {
    flex: 0.12,
    justifyContent: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight / 2,
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
    flex: 0.7,
    alignItems: "center",
  },
});

export default UnconfirmedTransactionsScreen;

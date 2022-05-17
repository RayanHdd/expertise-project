import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import PassengerNavigationMenu from "../components/PassengerNavigationMenu";
import TransactionCard from "../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import storage_keys from "../constants/storage_keys";
import { readDataAsync } from "../functions/storage_functions";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import { toFarsiNumber, trimMoney, gregorian_to_jalali } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const TransactionsScreen = ({ navigation }) => {
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [passengerId, setPassengerId] = useState(null);
  const [cost, setCost] = useState(null);
  const [transactionDate, setTransactionDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
      const grabData = async () => {
        const data = await await fetchData(db, db_queries.GET_PASSENGER_ID_BY_PHONE_NUMBER, [response]);
        const data2 = await fetchData(db, db_queries.FETCH_TRANSACTIONS_BY_PASSENGER_ID, [data[0].passenger_id]);
        console.log(data);
        console.log(data2);
        // setPassengerId(data[0].passenger_id);
        setCost(data2[0].transaction_cost);
        const date = data2[0].transaction_dateTime.split("-");
        console.log(date);
        setTransactionDate(date);
        // console.log(transactionDate);

        setFormattedDate(gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2])));
        //   // console.log(formattedDate);
      };
      grabData().catch(console.error);
    });
  }, []);

  // useEffect(() => {
  //   const onRefresh = navigation.addListener("focus", () => {
  //     //console.log("Refreshed!");
  //     readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
  //       //console.log(response);
  //       const grabData = async () => {
  //         const data2 = await fetchData(db, db_queries.GET_PASSENGER_ID_BY_PHONE_NUMBER, [response]);
  //         console.log(data2);

  //         const data3 = await fetchData(db, db_queries.FETCH_TRANSACTIONS_BY_PASSENGER_ID, [data2[0].passenger_id]);
  //         console.log(data3);
  //         setPassengerId(data2[0].passenger_id);
  //         setCost(data3[0].transaction_cost);
  //         setTransactionDate(data3[0].transaction_dataTime.split("-"));
  //         setFormattedDate(gregorian_to_jalali(transactionDate[0], transactionDate[1], transactionDate[2]));
  //         console.log(formattedDate);

  //         // setPassengerId(data2[0].passenger_id);
  //         if (response !== null) setUserPhoneNumber(response);
  //         //console.log(userPhoneNumber);
  //       };
  //       grabData().catch(console.error);

  //       // const grabData2 = async () => {
  //       //   const data2 = await fetchData(db, db_queries.FETCH_TRANSACTIONS_BY_PASSENGER_ID, [passengerId]);
  //       //   console.log(data2);
  //       //   setCost(data2[0].transaction_cost);
  //       //   setTransactionDate(data2[0].transaction_dataTime.split("-"));
  //       //   setFormattedDate(gregorian_to_jalali(transactionDate[0], transactionDate[1], transactionDate[2]));
  //       //   console.log(formattedDate);
  //       //   // if (response !== null) setUserPhoneNumber(response);
  //       //   //console.log(userPhoneNumber);
  //       // };
  //       // grabData2().catch(console.error);
  //     });
  //   });
  //   return onRefresh;
  // }, [navigation]);

  // useEffect(() => {
  //   const onRefresh = navigation.addListener("focus", () => {
  //     const grabData2 = async () => {
  //       const data2 = await fetchData(db, db_queries.FETCH_TRANSACTIONS_BY_PASSENGER_ID, [passengerId]);
  //       console.log(data2);
  //       setCost(data2[0].transaction_cost);
  //       setTransactionDate(data2[0].transaction_dataTime.split("-"));
  //       setFormattedDate(gregorian_to_jalali(transactionDate[0], transactionDate[1], transactionDate[2]));
  //       console.log(formattedDate);
  //       // if (response !== null) setUserPhoneNumber(response);
  //       //console.log(userPhoneNumber);
  //     };
  //     grabData2().catch(console.error);
  //   });
  //   return onRefresh;
  // }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText
            text="تراکنش ها"
            size={wp("3.5%")}
            color={colors.darkBlue}
            style={{ right: "5%", marginBottom: "15%" }}
          />
          <AppIcon
            family="Feather"
            name="refresh-ccw"
            color={colors.darkBlue}
            size={wp("6%")}
            style={{ left: wp("5%"), marginBottom: "15%" }}
          />
          <AppButton
            width={wp("40%")}
            height={wp("13%")}
            borderRadius={wp("2%")}
            style={{ position: "absolute", top: wp("17%"), left: wp("28%") }}
          />
          <AppText
            text="فیلتر"
            size={wp("4.5%")}
            color={colors.darkBlue}
            style={{ right: wp("50%"), top: wp("19%") }}
          />
          <AppIcon
            family="Ionicons"
            name="filter"
            size={wp("5%")}
            color={colors.darkBlue}
            style={{ right: wp("42%"), top: wp("20.4%") }}
          />
        </View>

        <View style={{ flex: 0.04 }} />
        <View style={styles.card}>
          {/* <TransactionCard
            width="90%"
            height="100%"
            borderRadius={10}
            iconType="wallet"
            title="افزایش اعتبار کیف پول"
            date="۱۴۰۰/۱۱/۲۳"
            time="۱۶:۲۳"
            price="۱۵٬۰۰۰"
            type="plus"
          /> */}
          <TransactionCard
            width="90%"
            height="100%"
            borderRadius={10}
            iconType="wallet"
            title="افزایش اعتبار کیف پول"
            // date="۱۴۰۰/۱۱/۲۳"
            date={`${toFarsiNumber(formattedDate[0])}/${toFarsiNumber(formattedDate[1])}/${toFarsiNumber(
              formattedDate[2]
            )}`}
            // time="۱۶:۲۳"
            time={`${toFarsiNumber(transactionDate[3])}:${toFarsiNumber(transactionDate[4])}:${toFarsiNumber(
              transactionDate[5]
            )}`}
            price={toFarsiNumber(parseInt(cost))}
            type="minus"
          />
        </View>
        <View style={{ flex: 0.01 }} />
        <View style={{ flex: 0.53 }} />

        <View style={styles.navigation}>
          {/* <PassengerNavigationMenu width="90%" height="75%" borderRadius={wp("4%")} active="transactions" /> */}
        </View>
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
    flex: 0.18,
    justifyContent: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
  },
  card: {
    flex: 0.1,
    alignItems: "center",
  },
});

export default TransactionsScreen;

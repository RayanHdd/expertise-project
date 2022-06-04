import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, FlatList } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import TransactionCard from "../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import storage_keys from "../constants/storage_keys";
import { readDataAsync } from "../functions/storage_functions";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import {
  toFarsiNumber,
  gregorian_to_jalali,
  toEnglishNumber,
  jalali_to_gregorian,
  trimMoney,
  trimDatetime,
} from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const TransactionsScreen = ({ navigation, route }) => {
  const [transactions, setTransactions] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [driverImage, setDriverImage] = useState(null);
  const [drivercode, setDriverCode] = useState(null);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      getTransactions();
    });
    return onRefresh;
  }, [navigation]);

  const getTransactions = () => {
    readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
      const grabData = async () => {
        const data = await fetchData(db, db_queries.GET_PASSENGER_ID_BY_PHONE_NUMBER, [response]);
        const data2 = await fetchData(db, db_queries.FETCH_TRANSACTIONS_BY_PASSENGER_ID, [data[0].passenger_id]);
        console.log(data);
        console.log(data2);
        setTransactions(data2);
      };
      grabData().catch(console.error);
    });
  };

  const renderItem = ({ item }) => {
    const date = item.transaction_dateTime.split("-");
    const formattedDate = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));

    if (item.transaction_type === "trip") {
      const grabData = async () => {
        const name = await fetchData(db, db_queries.GET_DRIVER_NAME_BY_ID, [item.driver_id]);
        const image = await fetchData(db, db_queries.GET_DRIVER_IMAGE_BY_ID, [item.driver_id]);
        const code = await fetchData(db, db_queries.GET_DRIVER_CODE_BY_ID, [item.driver_id]);
        // console.log(image);
        setDriverName(name);
        setDriverImage(image);
        setDriverCode(code);
      };
      grabData().catch(console.error);
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TransactionDetails", {
              driver_name: driverName,
              driver_code: drivercode[0].driver_acceptorCode,
              transaction_source: item.transaction_source,
              transaction_destination: item.transaction_destination,
              dateTime: item.transaction_dateTime,
              cost: item.transaction_cost,
              driver_image: driverImage[0].driver_imageUrl,
              driver_id: item.driver_id,
            });
          }}
        >
          <TransactionCard
            width={wp("85%")}
            height={hp("10%")}
            borderRadius={wp("4%")}
            iconType="rent"
            iconUrl={
              driverImage !== null
                ? driverImage[0].driver_imageUrl
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_4TfPNWILUAhTZpROTDfuyiYBMntr1ZT00A&usqp=CAU"
            }
            title={
              driverName !== null
                ? "پرداخت به " + driverName[0].driver_firstName + " " + driverName[0].driver_lastName
                : "پرداخت به "
            }
            date={`${toFarsiNumber(formattedDate[0])}/${trimDatetime(toFarsiNumber(formattedDate[1]))}/${trimDatetime(
              toFarsiNumber(formattedDate[2])
            )}`}
            time={`${trimDatetime(toFarsiNumber(date[3]))}:${trimDatetime(toFarsiNumber(date[4]))}:${trimDatetime(
              toFarsiNumber(date[5])
            )}`}
            price={trimMoney(toFarsiNumber(parseInt(item.transaction_cost)))}
            type="minus"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TransactionCard
          width={wp("85%")}
          height={hp("10%")}
          borderRadius={wp("4%")}
          iconType="wallet"
          title={item.transaction_type === "wallet" ? "افزایش اعتبار کیف پول" : "پرداخت از طرف FastPay"}
          date={`${toFarsiNumber(formattedDate[0])}/${trimDatetime(toFarsiNumber(formattedDate[1]))}/${trimDatetime(
            toFarsiNumber(formattedDate[2])
          )}`}
          time={`${trimDatetime(toFarsiNumber(date[3]))}:${trimDatetime(toFarsiNumber(date[4]))}:${trimDatetime(
            toFarsiNumber(date[5])
          )}`}
          price={trimMoney(toFarsiNumber(parseInt(item.transaction_cost)))}
          type="plus"
        />
      );
    }
  };

  const getFilteredTransactions = () => {
    const start = route.params.startDate.split("/");
    let jalali = toEnglishNumber(start[0]) + "-" + toEnglishNumber(start[1]) + "-" + toEnglishNumber(start[2]);
    const gregorian = jalali_to_gregorian(jalali) + "-0-0-0";
    const end = route.params.endDate.split("/");
    jalali = toEnglishNumber(end[0]) + "-" + toEnglishNumber(end[1]) + "-" + toEnglishNumber(end[2]);
    const gregorian2 = jalali_to_gregorian(jalali) + "-0-0-0";
    const type = route.params.type;

    const result = transactions.filter((item) => {
      console.log(item);
      return (
        item.transaction_type === type &&
        item.transaction_dateTime >= gregorian &&
        item.transaction_dateTime <= gregorian2
      );
    });
    console.log(result);

    return result;
  };

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

          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => {
              route.params = undefined;
              getTransactions();
            }}
          >
            <AppIcon
              family="Feather"
              name="refresh-ccw"
              color={colors.darkBlue}
              size={wp("6%")}
              style={{ marginLeft: wp("5%"), marginBottom: "15%", position: "relative" }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // setShowAlert(true);
              navigation.navigate("FilterTransaction");
            }}
            style={styles.filterBtn}
          >
            <AppButton width={wp("40%")} height={wp("13%")} borderRadius={wp("2%")} />
            <AppText text="فیلتر" size={wp("4.5%")} color={colors.darkBlue} style={{ right: wp("18%") }} />
            <AppIcon
              family="Ionicons"
              name="filter"
              size={wp("5%")}
              color={colors.darkBlue}
              style={{ right: wp("10%") }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.04 }} />
        <View style={styles.card}>
          <FlatList
            data={route.params !== undefined ? getFilteredTransactions() : transactions}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.transaction_id}
            extraData={transactions}
          />
        </View>
        <View style={{ flex: 0.05 }} />

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
    flex: 0.17,
    justifyContent: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
  },
  card: {
    flex: 0.6,
    alignItems: "center",
  },
  filterBtn: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: wp("7%"),
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
  PersianDatePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 7,
    paddingRight: 1,
    paddingLeft: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 6,
    marginBottom: 30,
    backgroundColor: "transparent",
    marginTop: 37,
  },
  PersianDatePickerText: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    textAlign: "center",
    color: "rgba(255,255,255,1)",
  },
});

export default TransactionsScreen;

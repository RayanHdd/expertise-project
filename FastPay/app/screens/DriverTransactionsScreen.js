import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, FlatList, Platform, SafeAreaView, Image } from "react-native";
import LottieView from "lottie-react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import { toFarsiNumber, gregorian_to_jalali, toEnglishNumber, jalali_to_gregorian, trimMoney, trimDatetime, dateTimeComparison } from "../functions/helperFunctions";
import TransactionCard from "../components/TransactionCard";

const db = SQLite.openDatabase("db.database"); // returns Database object

const DriverTransactionsScreen = ({ navigation, route }) => {
  const { driver_id } = route.params;
  const [transactions, setTransactions] = useState(null);
  const [passengerNames, setPassengerNames] = useState({});
  const [passengerImgUrls, setPassengerImgUrls] = useState({});
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [driverImage, setDriverImage] = useState(null);
  const [drivercode, setDriverCode] = useState(null);
  const [progressBar, setProgressBar] = useState(false);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [isEmptyFilterResult, setIsEmptyFilterResult] = useState(false);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      getTransactions();
    });
    return onRefresh;
  }, [navigation]);

  const getTransactions = () => {
    setIsEmptyFilterResult(false);
    const grabData = async () => {
      const driver_transactions = await fetchData(db, db_queries.FETCH_TRANSACTIONS_BY_DRIVER_ID, [driver_id]);
      let names = passengerNames;
      let urls = passengerImgUrls;
      driver_transactions.forEach((transaction) => {
        if (transaction.transaction_type === "rent") {
          const grabData = async () => {
            const passengerInfo = await fetchData(db, db_queries.FETCH_PASSENGER_INFO_BY_ID, [transaction.passenger_id]);
            names[transaction.transaction_id] = passengerInfo[0].passenger_name;
            urls[transaction.transaction_id] = passengerInfo[0].passenger_imageUri;
          };
          grabData().catch(console.error);
        }
      });
      setPassengerNames(names);
      setPassengerImgUrls(urls);
      if (driver_transactions.length === 0) setIsEmptyResult(true);
      else {
        setIsEmptyResult(false);
      }
      setTransactions(driver_transactions);
    };
    grabData().catch(console.error);
    setFilteredTransactions(null);
  };

  const renderItem = ({ item }) => {
    const date = item.transaction_dateTime.split("-");
    const formattedDate = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));

    const grabData = async () => {
      const name = await fetchData(db, db_queries.GET_DRIVER_NAME_BY_ID, [item.driver_id]);
      const image = await fetchData(db, db_queries.GET_DRIVER_IMAGE_BY_ID, [item.driver_id]);
      const code = await fetchData(db, db_queries.GET_DRIVER_CODE_BY_ID, [item.driver_id]);
      setDriverName(name);
      setDriverImage(image);
      setDriverCode(code);
    };
    grabData().catch(console.error);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DriverTransactionDetails", {
            driver_name: driverName,
            driver_code: drivercode[0].driver_acceptorCode,
            transaction_source: item.transaction_source,
            transaction_destination: item.transaction_destination,
            dateTime: item.transaction_dateTime,
            cost: item.transaction_cost,
            driver_image: driverImage[0].driver_imageUrl,
          });
        }}
      >
        <TransactionCard
          width={wp("90%")}
          height={hp("10%")}
          borderRadius={hp("1.2%")}
          iconType="rent"
          iconUrl={passengerImgUrls[item.transaction_id]}
          title={"پرداخت از " + passengerNames[item.transaction_id]}
          date={`${toFarsiNumber(formattedDate[0])}/${trimDatetime(toFarsiNumber(formattedDate[1]))}/${trimDatetime(toFarsiNumber(formattedDate[2]))}`}
          time={`${trimDatetime(toFarsiNumber(date[3]))}:${trimDatetime(toFarsiNumber(date[4]))}:${trimDatetime(toFarsiNumber(date[5]))}`}
          price={trimMoney(toFarsiNumber(parseInt(item.transaction_cost)))}
          type="plus"
        />
      </TouchableOpacity>
    );
  };

  const getFilteredTransactions = () => {
    if (filteredTransactions === null) {
      const start = route.params.startDate.split("/");
      let jalali = toEnglishNumber(start[0]) + "-" + toEnglishNumber(start[1]) + "-" + toEnglishNumber(start[2]);
      const gregorian = jalali_to_gregorian(jalali) + "-0-0-0";
      const end = route.params.endDate.split("/");
      jalali = toEnglishNumber(end[0]) + "-" + toEnglishNumber(end[1]) + "-" + toEnglishNumber(end[2]);
      const gregorian2 = jalali_to_gregorian(jalali) + "-23-59-59";

      const result = transactions.filter((item) => {
        return dateTimeComparison(item.transaction_dateTime, gregorian) === "BIGGER" && dateTimeComparison(item.transaction_dateTime, gregorian2) === "SMALLER";
      });
      if (result.length === 0) {
        setIsEmptyFilterResult(true);
      } else {
        setIsEmptyFilterResult(false);
      }
      setFilteredTransactions(result);
      return result;
    } else {
      return filteredTransactions;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />

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
              route.params.startDate = undefined;
              setProgressBar(true);
              setTimeout(() => {
                setProgressBar(false);
              }, 600);
              getTransactions();
            }}
          >
            <AppIcon family="Feather" name="refresh-ccw" color={colors.darkBlue} size={hp("3.2%")} style={{ position: "relative" }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DriverFilterTransaction");
            }}
            style={styles.filterBtn}
          >
            <AppButton width={wp("40%")} height={wp("13%")} borderRadius={wp("2%")} />
            <AppText text="فیلتر" size={wp("4.5%")} color={colors.darkBlue} style={{ right: wp("18%") }} />
            <AppIcon family="Ionicons" name="filter" size={wp("5%")} color={colors.darkBlue} style={{ right: wp("10%") }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.03 }} />

        {!progressBar && (isEmptyResult || isEmptyFilterResult) ? (
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
        {!progressBar && (isEmptyResult || isEmptyFilterResult) ? (
          <AppText text="موردی یافت نشد!" size={hp("3%")} color={colors.secondary} style={{ top: hp("55%"), alignSelf: "center" }} />
        ) : null}

        <View style={styles.card}>
          {!progressBar ? (
            <FlatList
              data={route.params.startDate !== undefined ? getFilteredTransactions() : transactions}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item) => item.transaction_id}
              extraData={transactions}
            />
          ) : null}
        </View>

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
    flex: 0.155,
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
    flex: 0.74,
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
});

export default DriverTransactionsScreen;

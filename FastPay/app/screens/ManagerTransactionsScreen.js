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
import { fetchData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import TransactionCard from "../components/TransactionCard";
import { toFarsiNumber, gregorian_to_jalali, toEnglishNumber, trimMoney, trimDatetime } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const ManagerTransactionsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState(null);
  const [driverNames, setDriverNames] = useState({});
  const [driverImgUrls, setDriverImgUrls] = useState({});
  const [progressBar, setProgressBar] = useState(false);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [isEmptyFilterResult, setIsEmptyFilterResult] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [filteredId, setFilteredId] = useState(null);
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
    setIsEmptyFilterResult(false);
    const grabData = async () => {
      const fetched_transactions = await fetchData(db, db_queries.FETCH_RENT_TRANSACTIONS, []);
      let names = driverNames;
      let urls = driverImgUrls;
      fetched_transactions.forEach((transaction) => {
        if (transaction.transaction_type === "rent") {
          const grabData = async () => {
            const name = await fetchData(db, db_queries.GET_DRIVER_NAME_BY_ID, [transaction.driver_id]);
            const image = await fetchData(db, db_queries.GET_DRIVER_IMAGE_BY_ID, [transaction.driver_id]);
            names[transaction.transaction_id] = name[0].driver_firstName + " " + name[0].driver_lastName;
            urls[transaction.transaction_id] = image[0].driver_imageUrl;
          };
          grabData().catch(console.error);
        }
      });
      setDriverNames(names);
      setDriverImgUrls(urls);
      if (fetched_transactions.length === 0) setIsEmptyResult(true);
      else {
        setIsEmptyResult(false);
      }
      setTransactions(fetched_transactions);
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
          navigation.navigate("ManagerTransactionDetails", {
            driver_name: driverName,
            driver_code: drivercode[0].driver_acceptorCode,
            transaction_source: item.transaction_source,
            transaction_destination: item.transaction_destination,
            dateTime: item.transaction_dateTime,
            cost: item.transaction_cost,
            driver_image: driverImage[0].driver_imageUrl,
            driver_id: item.driver_id,
            transaction_id: item.transaction_id,
          });
        }}
      >
        <TransactionCard
          width={wp("90%")}
          height={hp("10%")}
          borderRadius={hp("1.2%")}
          iconType="rent"
          iconUrl={driverImgUrls[item.transaction_id]}
          title={"پرداخت به " + driverNames[item.transaction_id]}
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
      const filtered_id = parseInt(toEnglishNumber(filteredId));
      const result = transactions.filter((item) => {
        return item.transaction_id === filtered_id;
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
          <AppText text="تراکنش ها" size={hp("2%")} color={colors.darkBlue} style={{ right: "5%", marginBottom: "12%" }} />

          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => {
              setProgressBar(true);
              setTimeout(() => {
                setProgressBar(false);
              }, 600);
              setFilteredId(null);
              getTransactions();
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
          {!progressBar && !isEmptyFilterResult ? (
            <FlatList
              data={filteredId !== null && filteredId.length !== 0 ? getFilteredTransactions() : transactions}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item) => item.transaction_id}
              extraData={transactions}
            />
          ) : null}
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          customView={
            <TextInput
              value={filteredId}
              keyboardType="numeric"
              selectionColor={colors.darkBlue}
              onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                if (keyValue === "Backspace" && filteredId !== null && filteredId.length !== 0) {
                  setFilteredId(filteredId.slice(0, filteredId.length - 1));
                }
              }}
              onChangeText={(code) => {
                if (filteredId !== null) setFilteredId(filteredId + toFarsiNumber(code));
                else setFilteredId(toFarsiNumber(code));
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
          title="فیلتر تراکنش ها"
          titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.secondary }}
          message="لطفا شناسه تراکنش را وارد کنید :"
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
            setFilteredId(null);
          }}
          onConfirmPressed={() => {
            if (filteredId === null || filteredId.length === 0) {
              Keyboard.dismiss();
              toast.show("شناسه تراکنش نمیتواند خالی باشد", {
                type: "normal",
                duration: 3000,
              });
            } else {
              setShowAlert(false);
              setFilteredTransactions(null);
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

        <View style={{ flex: 0.01 }} />

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
    flex: 0.64,
    alignItems: "center",
  },
  filterBtn: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: hp("2.8%"),
    left: wp("30%"),
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

export default ManagerTransactionsScreen;

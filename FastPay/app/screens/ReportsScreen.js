import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, FlatList, Platform, SafeAreaView, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import ReportCard from "../components/ReportCard";
import { toFarsiNumber, gregorian_to_jalali, trimDatetime } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const ReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState(null);
  const [isEmptyResult, setIsEmptyResult] = useState(false);

  useEffect(() => {
    const onRefresh = navigation.addListener("focus", () => {
      getReports();
    });
    return onRefresh;
  }, [navigation]);

  const getReports = () => {
    const grabData = async () => {
      const pending_reports = await fetchData(db, db_queries.FETCH_REPORTS, []);
      if (pending_reports.length === 0) setIsEmptyResult(true);
      else {
        setIsEmptyResult(false);
      }
      setReports(pending_reports);
    };
    grabData().catch(console.error);
  };

  const renderItem = ({ item }) => {
    const date = item.report_dateTime.split("-");
    const formattedDate = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));
    return (
      <ReportCard
        width={wp("85%")}
        height={hp("13%")}
        borderRadius={hp("1.2%")}
        date={`${toFarsiNumber(formattedDate[0])}/${trimDatetime(toFarsiNumber(formattedDate[1]))}/${trimDatetime(toFarsiNumber(formattedDate[2]))}`}
        time={`${trimDatetime(toFarsiNumber(date[3]))}:${trimDatetime(toFarsiNumber(date[4]))}:${trimDatetime(toFarsiNumber(date[5]))}`}
        reportTxt={item.report_text}
        transactionId={item.transaction_id}
        reportId={item.report_id}
      />
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="گزارش ها" size={hp("2.1%")} color={colors.darkBlue} style={{ right: "5%", top: hp("5%") }} />

          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={hp("3.4%")} style={{ marginLeft: wp("7%"), marginBottom: hp("-2%"), position: "relative" }} />
          </TouchableOpacity>
        </View>

        {isEmptyResult ? (
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
        {isEmptyResult ? <AppText text="موردی یافت نشد!" size={hp("3%")} color={colors.secondary} style={{ top: hp("55%"), alignSelf: "center" }} /> : null}

        <View style={{ flex: 0.03 }} />
        <View style={styles.card}>
          <FlatList data={reports} showsVerticalScrollIndicator={false} renderItem={renderItem} keyExtractor={(item) => item.report_id} extraData={reports} />
        </View>
        <View style={{ flex: 0.05 }} />

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
    flex: 0.1,
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
    flex: 0.6,
    alignItems: "center",
  },
});

export default ReportsScreen;

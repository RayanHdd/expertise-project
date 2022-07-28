import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import LottieView from "lottie-react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "./Button";
import AppIcon from "./Icon";
import AppText from "./Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import { gregorian_to_jalali, toFarsiNumber, trimMoney } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

function ReportCard({ width, height, borderRadius, date, time, reportTxt, transactionId, reportId, style }) {
  const [showReportTxtAlert, setShowReportTxtAlert] = useState(false);
  const [showTransactionAlert, setShowTransactionAlert] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [driverName, setDriverName] = useState(null);
  const [driverImage, setDriverImage] = useState(null);
  const [driverCode, setDriverCode] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [transactionDate, setTransactionDate] = useState(null);

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.secondary,
            opacity: isChecked ? 0.6 : 1,
            width: width,
            height: height,
            borderRadius: borderRadius,
            shadowColor: colors.darkBlue,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 3,
          },
          style,
        ]}
      >
        {!isChecked ? <AppIcon family="Foundation" name="burst-new" size={hp("4.5%")} style={{ right: wp("3%"), top: hp("1.2%"), transform: [{ rotate: "45deg" }] }} /> : null}

        <TouchableOpacity
          style={{ right: wp("13%"), bottom: hp("8.8%"), position: "absolute" }}
          onPress={() => {
            setShowReportTxtAlert(true);
          }}
        >
          <AppText text="مشاهده متن گزارش" size={hp("1.8%")} style={{ textDecorationLine: "underline", position: "relative" }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ position: "absolute", right: wp("13%"), bottom: hp("4.8%") }}
          onPress={() => {
            const grabData = async () => {
              const transaction_info = await fetchData(db, db_queries.FETCH_TRANSACTION_BY_ID, [transactionId]);
              const name = await fetchData(db, db_queries.GET_DRIVER_NAME_BY_ID, [transaction_info[0].driver_id]);
              const image = await fetchData(db, db_queries.GET_DRIVER_IMAGE_BY_ID, [transaction_info[0].driver_id]);
              const code = await fetchData(db, db_queries.GET_DRIVER_CODE_BY_ID, [transaction_info[0].driver_id]);
              setTransactionInfo(transaction_info[0]);
              setDriverName(name[0]);
              setDriverImage(image[0].driver_imageUrl);
              setDriverCode(code[0].driver_acceptorCode);
              const date = transaction_info[0].transaction_dateTime.split("-");
              const formatted = gregorian_to_jalali(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]));
              setTransactionDate(date);
              setFormattedDate(formatted);
            };
            grabData().catch(console.error);
            setShowTransactionAlert(true);
          }}
        >
          <AppText text="مشاهده تراکنش مربوطه" size={hp("1.8%")} style={{ position: "relative", textDecorationLine: "underline" }} />
        </TouchableOpacity>

        <AppText text={time + "  -  " + date} size={hp("1.6%")} color={colors.darkBlue} style={{ right: wp("13%"), bottom: hp("1.1%") }} />
        {!isChecked ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setIsChecked(true);
                manipulateData(db, db_queries.EDIT_REPORT_BY_ID, [reportId], null, "خطا در ثبت درخواست");
              }}
              style={{ position: "absolute", left: wp("5%"), bottom: hp("-1%"), width: wp("19%"), height: hp("12%"), borderRadius: hp("1%") }}
            >
              <AppButton width={wp("19%")} height="40%" borderRadius={hp("1%")} />
              <AppText text="بررسی شد" size={hp("1.6%")} style={{ left: wp("1.7%"), bottom: hp("8.4%") }} />
            </TouchableOpacity>
          </>
        ) : (
          <LottieView
            source={require("../assets/animations/checked.json")}
            loop={false}
            autoPlay
            style={{
              width: hp("8%"),
              height: hp("8%"),
              alignSelf: "center",
              right: wp("15%"),
            }}
          />
        )}
      </View>

      <AwesomeAlert
        show={showReportTxtAlert}
        showProgress={false}
        title="متن گزارش"
        titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.darkBlue }}
        message={reportTxt}
        messageStyle={{ fontFamily: "Dirooz", fontSize: hp("1.8%"), color: colors.secondary, alignSelf: "flex-end", top: hp("1%") }}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="بستن"
        confirmButtonStyle={{ marginTop: hp("22%") }}
        confirmButtonTextStyle={{ fontSize: hp("2.2%"), fontFamily: "Dirooz", color: "white" }}
        contentContainerStyle={{ width: wp("70%"), height: hp("45%") }}
        confirmButtonColor={colors.darkBlue}
        onConfirmPressed={() => {
          setShowReportTxtAlert(false);
        }}
      />

      {showTransactionAlert ? (
        <AwesomeAlert
          show={showTransactionAlert}
          showProgress={false}
          customView={
            <>
              <View
                style={{
                  flex: 0.17,
                  alignItems: "center",
                }}
              >
                <Image style={{ width: hp("10%"), height: hp("10%"), borderRadius: hp("5%"), top: hp("2%") }} source={{ uri: driverImage }} />
                <View
                  style={{
                    width: hp("11%"),
                    height: hp("11%"),
                    borderRadius: hp("7%"),
                    borderColor: "darkBlue",
                    borderWidth: wp("0.3%"),
                    backgroundColor: null,
                    top: hp("1.5%"),
                    position: "absolute",
                    opacity: 0.5,
                  }}
                />
              </View>

              <View style={{ flex: 0.342, top: hp("14%") }}>
                <View style={{ width: "90%", height: "100%", backgroundColor: colors.secondary, borderRadius: wp("1.5%") }}>
                  <AppText text="شناسه تراکنش" size={hp("1.65%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("1.6%"), textAlign: "right" }} />
                  <AppText
                    text={transactionInfo !== null ? toFarsiNumber(transactionInfo.transaction_id) : null}
                    color={colors.darkBlue}
                    size={hp("2%")}
                    style={{ right: wp("5%"), top: hp("1.4%") }}
                  />
                  <AppText text="نام راننده" size={hp("1.65%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("6%"), textAlign: "right" }} />
                  <AppText
                    text={driverName !== null ? driverName.driver_firstName + " " + driverName.driver_lastName : null}
                    color={colors.darkBlue}
                    size={hp("1.5%")}
                    style={{ right: wp("5%"), top: hp("6%") }}
                  />
                  <View
                    style={{
                      borderBottomColor: colors.darkBlue,
                      borderBottomWidth: 0.2,
                      width: "90%",
                      left: wp("5%"),
                      top: hp("5.5%"),
                      opacity: 0.5,
                    }}
                  />
                  <AppText text="کد پذیرنده" size={hp("1.65%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("10.5%") }} />
                  <AppText text={driverCode !== null ? toFarsiNumber(driverCode) : null} color={colors.darkBlue} size={hp("1.9%")} style={{ right: wp("5%"), top: hp("10.5%") }} />
                  <View
                    style={{
                      borderBottomColor: colors.darkBlue,
                      borderBottomWidth: 0.2,
                      width: "90%",
                      left: wp("5%"),
                      top: hp("10.8%"),
                      opacity: 0.5,
                    }}
                  />
                  <AppText text="مسیر" size={hp("1.65%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("15.3%") }} />
                  <AppText
                    text={transactionInfo !== null ? transactionInfo.transaction_source + " - " + transactionInfo.transaction_destination : null}
                    size={hp("1.1%")}
                    color={colors.darkBlue}
                    style={{ right: wp("5%"), top: hp("16%") }}
                  />
                  <View
                    style={{
                      borderBottomColor: colors.darkBlue,
                      borderBottomWidth: 0.2,
                      width: "90%",
                      left: wp("5%"),
                      top: hp("16%"),
                      opacity: 0.5,
                    }}
                  />
                  <AppText text="تعداد مسافران" size={hp("1.65%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("20.3%") }} />
                  <AppText
                    text={transactionInfo !== null ? toFarsiNumber(transactionInfo.transaction_passengerCount) : null}
                    size={hp("2%")}
                    color={colors.darkBlue}
                    style={{ right: wp("5%"), top: hp("20.3%") }}
                  />
                  <View
                    style={{
                      borderBottomColor: colors.darkBlue,
                      borderBottomWidth: 0.2,
                      width: "90%",
                      left: wp("5%"),
                      top: hp("21%"),
                      opacity: 0.5,
                    }}
                  />
                  <AppText text="تاریخ و ساعت" size={hp("1.65%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("25.5%") }} />
                  <AppText
                    text={
                      formattedDate !== null && transactionDate !== null
                        ? `${toFarsiNumber(formattedDate[0])}/${toFarsiNumber(formattedDate[1])}/${toFarsiNumber(formattedDate[2])} - ${toFarsiNumber(transactionDate[3])}:${toFarsiNumber(
                            transactionDate[4]
                          )}:${toFarsiNumber(transactionDate[5])}`
                        : null
                    }
                    size={hp("1.5%")}
                    color={colors.darkBlue}
                    style={{ right: wp("5%"), top: hp("25.5%") }}
                  />
                  <View
                    style={{
                      borderBottomColor: colors.darkBlue,
                      borderBottomWidth: 0.2,
                      width: "90%",
                      left: wp("5%"),
                      top: hp("26%"),
                      opacity: 0.5,
                    }}
                  />
                  <AppText text="مبلغ کرایه" size={hp("1.65%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("30.5%") }} />
                  <AppText
                    text={transactionInfo !== null ? trimMoney(toFarsiNumber(parseInt(transactionInfo.transaction_cost).toString())) + "  تومان" : null}
                    size={hp("1.7%")}
                    color={colors.darkBlue}
                    style={{ right: wp("5%"), top: hp("30.5%") }}
                  />
                </View>
              </View>
            </>
          }
          title="جزئیات تراکنش"
          titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.darkBlue }}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="بستن"
          confirmButtonStyle={{ marginTop: hp("60%") }}
          confirmButtonTextStyle={{ fontSize: hp("2.2%"), fontFamily: "Dirooz", color: "white" }}
          contentContainerStyle={{ width: wp("100%"), height: hp("80%") }}
          confirmButtonColor={colors.darkBlue}
          onConfirmPressed={() => {
            setShowTransactionAlert(false);
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    margin: wp("2%"),
  },
});

export default ReportCard;

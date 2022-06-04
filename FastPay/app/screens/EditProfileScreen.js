import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import HeaderCard from "../components/HeaderCard";
import colors from "../config/colors";
import PassengerNavigationMenu from "../components/PassengerNavigationMenu";
import TransactionCard from "../components/TransactionCard";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import { toFarsiNumber, trimMoney } from "../functions/helperFunctions";
import storage_keys from "../constants/storage_keys";
import { readDataAsync } from "../functions/storage_functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInput from "react-native-phone-number-input";

const db = SQLite.openDatabase("db.database"); // returns Database object

function EditProfileScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(null);
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState("");

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      alert("You need to enable permission access to the library");
    }
  };

  useEffect(() => {
    readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
      const grabData = async () => {
        const data2 = await fetchData(db, db_queries.FETCH_PASSENGER_INFO_BY_PHONE_NUMBER, [response]);
        setPhoneNumber(response);
        console.log(data2);
        setUsername(data2[0].passenger_name);
        setImageUri(data2[0].passenger_imageUri);
        setEditedPhoneNumber(data2[0].passenger_phone.toString());
      };
      grabData().catch(console.error);
    });
    requestPermission();
  }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="ویرایش مشخصات کاربری" size={wp("4%")} color={colors.darkBlue} style={{ top: hp("4.7%") }} />
          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <AppIcon
              family="Ionicons"
              name="arrow-back"
              color={colors.darkBlue}
              size={wp("7%")}
              style={{ position: "relative", marginRight: wp("80%"), marginTop: wp("5%") }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.035 }} />

        <View style={styles.profile}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              width: wp("30%"),
              height: hp("6%"),
              alignItems: "center",
              justifyContent: "center",
              width: "68%",
              top: wp("4%"),
              left: wp("1%"),
              borderRadius: wp("3%"),
              position: "absolute",
            }}
            onPress={async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.5,
                });
                if (!result.cancelled) {
                  setImageUri(result.uri);
                }
              } catch (error) {
                console.log("Error reading an image", error);
              }
            }}
          >
            <AppButton
              width={wp("30%")}
              height={hp("6%")}
              color="light"
              borderRadius={wp("6%")}
              style={{
                borderColor: "darkBlue",
                borderWidth: wp("0.1%"),
              }}
            />
            <AppText text="آپلود عکس" size={wp("3.2%")} style={{ left: wp("23%") }} />
            <AppIcon
              family="Feather"
              name="image"
              color={colors.darkBlue}
              size={wp("5.5%")}
              style={{ left: wp("39%") }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: wp("30%"),
              height: hp("6%"),
              top: wp("17%"),
              left: wp("20%"),
              borderRadius: wp("3%"),
              position: "absolute",
            }}
            onPress={() => {
              setImageUri(
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png"
              );
            }}
          >
            <AppButton
              width={wp("30%")}
              height={hp("6%")}
              color="light"
              borderRadius={wp("6%")}
              style={{
                borderColor: "darkBlue",
                borderWidth: wp("0.1%"),
              }}
            />
            <AppText text="حذف عکس" size={wp("3.2%")} style={{ left: wp("4%") }} />
            <AppIcon
              family="Feather"
              name="trash-2"
              color={colors.darkBlue}
              size={wp("5.5%")}
              style={{ right: wp("4%") }}
            />
          </TouchableOpacity>

          <Image
            style={{ width: wp("28%"), height: wp("28%"), borderRadius: wp("15%"), top: wp("3%"), left: wp("20%") }}
            // source={require("../assets/images/profile.jpeg")}
            source={{
              uri: imageUri,
            }}
          />
          <View
            style={{
              width: wp("31%"),
              height: wp("31%"),
              borderRadius: wp("15%"),
              top: wp("1.5%"),
              right: wp("14.5%"),
              borderColor: "darkBlue",
              borderWidth: wp("0.3%"),
              backgroundColor: null,
              position: "absolute",
              opacity: 0.5,
            }}
          />
        </View>

        <View style={{ flex: 0.045 }} />

        <View style={styles.title}>
          <AppText text="نام کاربری" size={wp("3.2%")} style={{ right: wp("15%") }} />
        </View>
        <View style={styles.input}>
          <TextInput
            value={username}
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue === "Backspace") {
                setUsername(username.slice(0, username.length - 1));
              }
            }}
            onChangeText={(txt) => {
              setUsername(txt);
            }}
            style={{
              width: "70%",
              height: "90%",
              borderRadius: wp("3%"),
              borderWidth: wp("0.1%"),
              borderColor: colors.darkBlue,
              color: colors.darkBlue,
              fontFamily: "Dirooz",
              fontSize: wp("3.5%"),
              backgroundColor: colors.light,
              paddingRight: wp("30%"),
            }}
          />
          <AppIcon
            family="SimpleLineIcons"
            name="user"
            color={colors.darkBlue}
            size={wp("5.5%")}
            style={{ right: wp("19%"), opacity: 0.7 }}
          />
        </View>

        <View style={styles.title}>
          <AppText text="شماره موبایل" size={wp("3.2%")} style={{ right: wp("15%") }} />
        </View>
        <View style={styles.input}>
          <TextInput
            keyboardType="numeric"
            value={
              editedPhoneNumber !== null
                ? toFarsiNumber("0" + editedPhoneNumber.slice(2, editedPhoneNumber.length))
                : null
            }
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue === "Backspace") {
                setEditedPhoneNumber(editedPhoneNumber.slice(0, editedPhoneNumber.length - 1));
              }
            }}
            onChangeText={(txt) => {
              // setEditedPhoneNumber(editedPhoneNumber + txt);
              if (editedPhoneNumber !== null) setEditedPhoneNumber(editedPhoneNumber + toFarsiNumber(txt));
              else setEditedPhoneNumber(toFarsiNumber(txt));
              // setEditedPhoneNumber(txt);
            }}
            style={{
              width: "70%",
              height: "90%",
              borderRadius: wp("3%"),
              borderWidth: wp("0.1%"),
              borderColor: colors.darkBlue,
              color: colors.darkBlue,
              fontFamily: "Dirooz",
              fontSize: wp("4%"),
              backgroundColor: colors.light,
              paddingLeft: wp("20%"),
            }}
          />
          <AppIcon
            family="SimpleLineIcons"
            name="screen-smartphone"
            color={colors.darkBlue}
            size={wp("5.7%")}
            style={{ right: wp("19%"), opacity: 0.7 }}
          />

          {/* <PhoneInput
            ref={phoneInput}
            defaultValue={null}
            placeholder="9123456789"
            containerStyle={{
              // width: "75%",
              // height: "55%",
              // borderRadius: wp("2%"),
              // backgroundColor: colors.light,
              // paddingRight: wp("5%"),
              // borderWidth: wp("0.1%"),
              // borderColor: colors.darkBlue,
              width: "70%",
              height: "90%",
              borderRadius: wp("3%"),
              borderWidth: wp("0.1%"),
              borderColor: colors.darkBlue,
              color: colors.darkBlue,
              fontFamily: "Dirooz",
              fontSize: wp("3%"),
              backgroundColor: colors.light,
              paddingRight: wp("30%"),
            }}
            textContainerStyle={{ fontSize: wp("4%"), color: colors.darkBlue }}
            textInputStyle={{ fontSize: wp("4%"), color: colors.darkBlue, letterSpacing: wp("0.35%") }}
            codeTextStyle={{ fontSize: wp("4%"), color: colors.darkBlue }}
            defaultCode="IR"
            layout="first"
            onChangeText={(text) => {
              setEditedPhoneNumber(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            countryPickerProps={{ withAlphaFilter: true }}
            // withShadow
            autoFocus
          /> */}
        </View>

        <View style={{ flex: 0.345 }} />

        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              manipulateData(
                db,
                db_queries.EDIT_PASSENGER_INFO_BY_PHONE_NUMBER,
                [imageUri, username, editedPhoneNumber, phoneNumber],
                "ویرایش با موفقیت انجام شد",
                "خطا در ویرایش مشخصات"
              );
              navigation.navigate("Settings");
            }}
            style={{ position: "absolute", width: wp("70%"), height: "100%", justifyContent: "center" }}
          >
            <AppButton width={wp("70%")} height="100%" borderRadius={wp("3.5%")} style={{ marginBottom: wp("6%") }} />
            <AppText
              text="‌ذخیره"
              color={colors.darkBlue}
              size={wp("4.7%")}
              style={{ bottom: wp("6%"), left: wp("29%") }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 0.045,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  header: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    paddingTop: StatusBar.currentHeight,
  },
  profile: {
    flex: 0.165,
    alignItems: "center",
  },
});

export default EditProfileScreen;

import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, TextInput, Image, Platform, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData, manipulateData } from "../functions/db_functions";
import HeaderCard from "../components/HeaderCard";
import { readDataAsync } from "../functions/storage_functions";
import storage_keys from "../constants/storage_keys";
import { toFarsiNumber } from "../functions/helperFunctions";

const db = SQLite.openDatabase("db.database"); // returns Database object

const EditProfileScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(null);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      alert("You need to enable permission access to the library");
    }
  };

  useEffect(() => {
    readDataAsync(AsyncStorage, storage_keys.PHONE_NUMBER).then((response) => {
      const grabData = async () => {
        const passenger_info = await fetchData(db, db_queries.FETCH_PASSENGER_INFO_BY_PHONE_NUMBER, [response]);
        setPhoneNumber(response);
        setUsername(passenger_info[0].passenger_name);
        setImageUri(passenger_info[0].passenger_imageUri);
        setEditedPhoneNumber(passenger_info[0].passenger_phone.toString());
      };
      grabData().catch(console.error);
    });
    requestPermission();
  }, [navigation]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length, backgroundColor: colors.light }} /> : null}
        <View style={styles.header}>
          <HeaderCard width="100%" height="100%" />
          <AppText text="ویرایش مشخصات کاربری" size={hp("2%")} color={colors.darkBlue} style={{ top: hp("4.7%") }} />
          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <AppIcon family="Ionicons" name="arrow-back" color={colors.darkBlue} size={wp("7%")} style={{ position: "relative", marginRight: wp("80%"), marginTop: hp("2.4%") }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.035 }} />

        <View style={styles.profile}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              height: hp("6%"),
              alignItems: "center",
              justifyContent: "center",
              width: "68%",
              top: hp("2.2%"),
              left: wp("1%"),
              position: "absolute",
            }}
            onPress={async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.8,
                });
                if (!result.cancelled) {
                  setImageUri(result.uri);
                }
              } catch (error) {
                console.error("Error reading an image", error);
              }
            }}
          >
            <AppButton
              width={wp("30%")}
              height={hp("6%")}
              color="light"
              borderRadius={hp("3%")}
              style={{
                borderColor: "darkBlue",
                borderWidth: hp("0.18%"),
                marginBottom: hp("2%"),
              }}
            />
            <AppText text="آپلود عکس" size={hp("1.65%")} style={{ bottom: hp("2.7%"), left: wp("22.5%") }} />
            <AppIcon family="Feather" name="image" color={colors.darkBlue} size={hp("2.7%")} style={{ left: wp("40%"), bottom: hp("2.7%") }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "68%",
              height: hp("6%"),
              top: hp("8.6%"),
              left: wp("1%"),
              position: "absolute",
            }}
            onPress={() => {
              setImageUri("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png");
            }}
          >
            <AppButton
              width={wp("30%")}
              height={hp("6%")}
              color="light"
              borderRadius={hp("3%")}
              style={{
                borderColor: "darkBlue",
                borderWidth: hp("0.18%"),
                marginTop: hp("2%"),
              }}
            />
            <AppText text="حذف عکس" size={hp("1.65%")} style={{ left: wp("22.5%"), bottom: hp("0.75%") }} />
            <AppIcon family="Feather" name="trash-2" color={colors.darkBlue} size={hp("2.7%")} style={{ left: wp("40%"), bottom: hp("0.75%") }} />
          </TouchableOpacity>

          <Image
            style={{ width: wp("28%"), height: wp("28%"), borderRadius: wp("15%"), top: wp("3%"), left: wp("20%") }}
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

        <View style={{ flex: 0.055 }} />

        <View style={styles.title}>
          <AppText text="نام کاربری" size={hp("2%")} style={{ right: wp("15%") }} />
        </View>
        <View style={styles.input}>
          <TextInput
            value={username}
            selectionColor={colors.darkBlue}
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
              borderWidth: hp("0.15%"),
              borderColor: colors.darkBlue,
              color: colors.darkBlue,
              fontFamily: "Dirooz",
              fontSize: hp("2%"),
              backgroundColor: colors.light,
              textAlign: "center",
            }}
          />
          <AppIcon family="SimpleLineIcons" name="user" color={colors.darkBlue} size={hp("3%")} style={{ right: wp("19%"), opacity: 0.7 }} />
        </View>

        <View style={{ flex: 0.02 }} />

        <View style={styles.title}>
          <AppText text="شماره موبایل" size={hp("2%")} style={{ right: wp("15%") }} />
        </View>
        <View style={styles.input}>
          <TextInput
            keyboardType="numeric"
            selectionColor={colors.darkBlue}
            value={editedPhoneNumber !== null ? toFarsiNumber("0" + editedPhoneNumber.slice(2, editedPhoneNumber.length)) : null}
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue === "Backspace") {
                setEditedPhoneNumber(editedPhoneNumber.slice(0, editedPhoneNumber.length - 1));
              }
            }}
            onChangeText={(txt) => {
              if (editedPhoneNumber !== null) setEditedPhoneNumber(editedPhoneNumber + toFarsiNumber(txt));
              else setEditedPhoneNumber(toFarsiNumber(txt));
            }}
            style={{
              width: "70%",
              height: "90%",
              borderRadius: wp("3%"),
              borderWidth: hp("0.15%"),
              borderColor: colors.darkBlue,
              color: colors.darkBlue,
              fontFamily: "Dirooz",
              fontSize: hp("2.4%"),
              backgroundColor: colors.light,
              textAlign: "center",
            }}
          />
          <AppIcon family="SimpleLineIcons" name="screen-smartphone" color={colors.darkBlue} size={hp("3%")} style={{ right: wp("19%"), opacity: 0.7 }} />
        </View>

        <View style={{ flex: 0.315 }} />

        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              manipulateData(db, db_queries.EDIT_PASSENGER_INFO_BY_PHONE_NUMBER, [imageUri, username, editedPhoneNumber, phoneNumber], "ویرایش با موفقیت انجام شد", "خطا در ویرایش مشخصات");
              navigation.navigate("Settings");
            }}
            style={{ position: "absolute", width: wp("70%"), height: "100%", justifyContent: "center", alignItems: "center" }}
          >
            <AppButton width={wp("70%")} height="30%" borderRadius={wp("3.5%")} style={{ marginBottom: hp("5%") }} />
            <AppText text="‌ذخیره" color={colors.darkBlue} size={hp("2.9%")} style={{ bottom: hp("1.5%") }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
    width: wp("70%"),
    marginBottom: hp("5%"),
    borderRadius: wp("3.5%"),
    left: wp("15%"),
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
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  profile: {
    flex: 0.165,
    alignItems: "center",
  },
});

export default EditProfileScreen;

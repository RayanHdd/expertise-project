import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, TextInput, Animated, StatusBar, Platform, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
import PhoneInput from "react-native-phone-number-input";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import { saveData } from "../functions/storage_functions";
import { sendVerificationCode } from "../api/sendSMS";
import storage_keys from "../constants/storage_keys";

const db = SQLite.openDatabase("db.database"); // returns Database object

const SignupScreen = ({ navigation }) => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [activeUser, setActiveUser] = useState("passenger");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [managerUsername, setManagerUsername] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
  const [checkMark, setCheckMark] = useState(false);
  const phoneInput = useRef(null);

  const _startAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const ifRecordExists = async () => {
    if (managerUsername === "" && managerPassword === "") {
      if (username === null || username.length === 0 || password === null || password.length === 0)
        toast.show("لطفا موارد خواسته شده را وارد کنید", {
          type: "normal",
          duration: 3000,
        });
      else {
        const data = await fetchData(db, db_queries.CHECK_IF_DRIVER_EXISTS, [username, password]);
        if (Object.values(data[0])[0] === 0) {
          toast.show("نام کاربری و/یا رمز عبور اشتباه است", {
            type: "normal",
            duration: 3000,
          });
        } else {
          if (checkMark) saveData(AsyncStorage, storage_keys.IS_DRIVER_LOGGED_IN, "True");
          const driverInfo = await fetchData(db, db_queries.FETCH_DRIVER_INFO_BY_USERNAME_AND_PASSWORD, [username, password]);
          saveData(AsyncStorage, storage_keys.DRIVER_ID, driverInfo[0].driver_id.toString());
          navigation.navigate("DriverHome");
        }
      }
    } else if (username === "" && password === "") {
      if (managerUsername === null || managerUsername.length === 0 || managerPassword === null || managerPassword.length === 0)
        toast.show("لطفا موارد خواسته شده را وارد کنید", {
          type: "normal",
          duration: 3000,
        });
      else {
        const data = await fetchData(db, db_queries.CHECK_IF_MANAGER_EXISTS, [managerUsername, managerPassword]);
        if (Object.values(data[0])[0] === 0) {
          toast.show("نام کاربری و/یا رمز عبور اشتباه است", {
            type: "normal",
            duration: 3000,
          });
        } else {
          if (checkMark) saveData(AsyncStorage, storage_keys.IS_MANAGER_LOGGED_IN, "True");
          const managerInfo = await fetchData(db, db_queries.FETCH_MANAGER_INFO_BY_USERNAME_AND_PASSWORD, [managerUsername, managerPassword]);
          saveData(AsyncStorage, storage_keys.MANAGER_ID, managerInfo[0].manager_id.toString());
          navigation.navigate("ManagerTabs");
        }
      }
    }
  };

  const ifPassengerExists = async () => {
    const data = await fetchData(db, db_queries.CHECK_IF_PASSENGER_EXISTS, [formattedValue]);
    if (Object.values(data[0])[0] === 1) {
      saveData(AsyncStorage, storage_keys.IS_SIGNED_UP, "True");
      saveData(AsyncStorage, storage_keys.PHONE_NUMBER, formattedValue);
      setShowProgress(false);
      navigation.replace("Tabs");
    } else {
      sendVerificationCode("0" + formattedValue.substring(3)).then((sent) => {
        setShowProgress(false);
        console.log("Sent!", sent);
        navigation.navigate("ConfirmationCode", { phoneNumber: formattedValue, confirmation_code: sent });
      });
    }
  };

  const activeAlert = () => {
    setShowAlert(true);
  };
  const hideAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    setFormattedValue("");
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <View style={{ flex: StatusBar.length + 0.04 }} /> : <View style={{ flex: 0.04 }} />}

        <View style={styles.image}>
          <Image style={{ width: "70%", height: "100%" }} source={require("../assets/images/logo.png")} />
        </View>

        <View style={{ flex: 0.03 }} />

        <View style={styles.title}>
          <AppText text="نوع کاربری" size={hp("2%")} color={colors.darkBlue} style={{ right: wp("15%") }} />
        </View>

        <View style={styles.buttons}>
          <TouchableWithoutFeedback
            onPress={() => {
              setActiveUser("passenger");
              setUsername("");
              setPassword("");
              setManagerUsername("");
              setManagerPassword("");
            }}
          >
            <View
              style={{
                position: "absolute",
                left: wp("14%"),
                width: "18%",
                height: "95%",
                borderRadius: wp("3%"),
                justifyContent: "center",
                borderColor: activeUser === "passenger" ? colors.darkBlue : colors.primary,
                borderWidth: wp("0.7"),
                opacity: activeUser === "passenger" ? 1 : 0.4,
              }}
            >
              <AppButton width="100%" height="100%" borderRadius={wp("2%")} />
              <AppText text="مسافر" size={hp("1.8%")} color={colors.darkBlue} style={{ left: wp("3.6%"), top: hp("7%") }} />
              <AppIcon family="MaterialCommunityIcons" name="seat-passenger" size={wp("8%")} style={{ left: wp("4.8%") }} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              setActiveUser("driver");
              setManagerUsername("");
              setManagerPassword("");
              _startAnimation();
            }}
          >
            <View
              style={{
                position: "absolute",
                left: wp("40%"),
                width: "18%",
                height: "95%",
                borderRadius: wp("3%"),
                justifyContent: "center",
                borderColor: activeUser === "driver" ? colors.darkBlue : colors.primary,
                borderWidth: wp("0.7"),
                opacity: activeUser === "driver" ? 1 : 0.4,
              }}
            >
              <AppButton width="100%" height="100%" borderRadius={wp("2%")} />
              <AppText text="راننده" size={hp("1.9%")} color={colors.darkBlue} style={{ left: wp("4.1%"), top: hp("7%") }} />
              <AppIcon family="MaterialCommunityIcons" name="taxi" size={wp("8%")} style={{ left: wp("4.5%") }} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              setActiveUser("manager");
              setUsername("");
              setPassword("");
              _startAnimation();
            }}
          >
            <View
              style={{
                position: "absolute",
                left: wp("66%"),
                width: "18%",
                height: "95%",
                borderRadius: wp("3%"),
                justifyContent: "center",
                borderColor: activeUser === "manager" ? colors.darkBlue : colors.primary,
                borderWidth: wp("0.7"),
                opacity: activeUser === "manager" ? 1 : 0.4,
              }}
            >
              <AppButton width="100%" height="100%" borderRadius={wp("2%")} />
              <AppText text="مدیر" size={hp("1.9%")} color={colors.darkBlue} style={{ left: wp("5%"), top: hp("7%") }} />
              <AppIcon family="Fontisto" name="person" size={wp("6%")} style={{ left: wp("5.8%") }} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ flex: 0.11 }} />

        {activeUser === "driver" || activeUser === "manager" ? (
          <>
            <View style={styles.input}>
              <Animated.View
                style={{
                  position: "absolute",
                  right: hp("16%"),
                  bottom: hp("14.5%"),
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                }}
              >
                <AppText text="نام کاربری" size={hp("2%")} color={colors.darkBlue} />
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  width: "75%",
                  height: "55%",
                  borderRadius: wp("2%"),
                  backgroundColor: "white",
                  padding: hp("1.6%"),
                  borderWidth: hp("0.2%"),
                  borderColor: colors.darkBlue,
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                }}
              >
                <TextInput
                  value={activeUser === "driver" ? username : managerUsername}
                  placeholder="نام کاربری خود را وارد کنید"
                  selectionColor={colors.darkBlue}
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") {
                      if (activeUser === "driver") setUsername(username.slice(0, username.length - 1));
                      else setManagerUsername(managerUsername.slice(0, managerUsername.length - 1));
                    }
                  }}
                  onChangeText={(txt) => {
                    if (activeUser === "driver") setUsername(txt);
                    else setManagerUsername(txt);
                  }}
                  style={{
                    textAlignVertical: "top",
                    textAlign: "right",
                    fontSize: hp("2%"),
                    color: colors.darkBlue,
                    fontFamily: "Dirooz",
                  }}
                />
              </Animated.View>
            </View>
            <View style={styles.input}>
              <Animated.View
                style={{
                  position: "absolute",
                  right: hp("14.5%"),
                  bottom: hp("14.2%"),
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                }}
              >
                <AppText text="رمز عبور" size={hp("2%")} color={colors.darkBlue} />
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  width: "75%",
                  height: "55%",
                  borderRadius: wp("2%"),
                  backgroundColor: "white",
                  padding: hp("1.6%"),
                  borderWidth: hp("0.2%"),
                  borderColor: colors.darkBlue,
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                }}
              >
                <TextInput
                  value={activeUser === "driver" ? password : managerPassword}
                  placeholder="رمز عبور خود را وارد کنید"
                  selectionColor={colors.darkBlue}
                  secureTextEntry={true}
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") {
                      if (activeUser === "driver") setPassword(password.slice(0, password.length - 1));
                      else setManagerPassword(managerPassword.slice(0, managerPassword.length - 1));
                    }
                  }}
                  onChangeText={(txt) => {
                    if (activeUser === "driver") setPassword(txt);
                    else setManagerPassword(txt);
                  }}
                  style={{
                    textAlignVertical: "top",
                    textAlign: "right",
                    fontSize: hp("2%"),
                    color: colors.darkBlue,
                    fontFamily: "Dirooz",
                  }}
                />
              </Animated.View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                setCheckMark(!checkMark);
              }}
            >
              <View style={styles.subtitle}>
                <Animated.View
                  style={{
                    position: "absolute",
                    width: hp("2.5%"),
                    height: hp("2.5%"),
                    right: wp("17%"),
                    borderRadius: hp("0.5%"),
                    backgroundColor: "white",
                    borderWidth: hp("0.2%"),
                    borderColor: colors.darkBlue,
                    transform: [
                      {
                        translateX: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [600, 0],
                        }),
                      },
                    ],
                  }}
                ></Animated.View>
                {checkMark ? <AppIcon family="Entypo" name="check" color={colors.darkBlue} size={hp("3%")} style={{ right: wp("16.3%") }} /> : null}

                <Animated.View
                  style={{
                    position: "absolute",
                    right: wp("44%"),
                    bottom: hp("2.4%"),
                    transform: [
                      {
                        translateX: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [600, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <AppText text="ذخیره اطلاعات" color={colors.secondary} size={hp("1.6%")} style={{ textDecorationLine: "underline" }} />
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
            <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title="قوانین و مقررات برنامه"
              titleStyle={{ fontFamily: "Dirooz", fontSize: wp("4%"), color: colors.darkBlue }}
              message="هنوز تعیین نشده است..."
              messageStyle={{
                fontFamily: "Dirooz",
                fontSize: wp("3%"),
                color: colors.secondary,
                alignSelf: "flex-end",
              }}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="تایید"
              alertContainerStyle={{ color: colors.light }}
              confirmButtonColor={colors.darkBlue}
              onConfirmPressed={hideAlert}
            />
            <View style={{ flex: 0.06 }} />
            <AwesomeAlert
              show={showProgress}
              showProgress={true}
              progressSize={wp("5%")}
              progressColor={colors.darkBlue}
              title="در حال انجام..."
              titleStyle={{ fontFamily: "Dirooz", fontSize: wp("3%"), color: colors.darkBlue }}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              alertContainerStyle={{ color: colors.light }}
            />
            <Animated.View
              style={{
                position: "absolute",
                right: wp("40%"),
                bottom: wp("5%"),
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0],
                    }),
                  },
                ],
              }}
            ></Animated.View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                ifRecordExists();
              }}
            >
              <Animated.View
                style={{
                  position: "absolute",
                  width: wp("70%"),
                  height: "100%",
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                }}
              >
                <AppButton borderRadius={wp("3%")} width={wp("70%")} height="100%" />
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  right: wp("39%"),
                  bottom: hp("6.2%"),
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                }}
              >
                <AppText text="ورود" color={colors.darkBlue} size={hp("3%")} style={{ position: "relative", top: hp("4.8%"), left: wp("8%") }} />
              </Animated.View>
            </TouchableOpacity>
            <View style={{ flex: 0.18 }} />
          </>
        ) : (
          <>
            <View style={styles.input}>
              <AppText text="شماره تلفن همراه" size={hp("2%")} color={colors.darkBlue} style={{ right: wp("16%"), bottom: hp("12%") }} />
              <PhoneInput
                ref={phoneInput}
                defaultValue={null}
                placeholder="9123456789"
                containerStyle={{
                  width: "75%",
                  height: "55%",
                  borderRadius: wp("2%"),
                  backgroundColor: "white",
                  paddingRight: wp("5%"),
                }}
                textContainerStyle={{ fontSize: wp("4%"), color: colors.darkBlue, backgroundColor: "white" }}
                textInputStyle={{
                  fontSize: wp("4%"),
                  color: colors.darkBlue,
                  letterSpacing: wp("0.35%"),
                }}
                codeTextStyle={{ fontSize: wp("4%"), color: colors.darkBlue }}
                defaultCode="IR"
                layout="first"
                onChangeText={(text) => {
                  setValue(text);
                }}
                onChangeFormattedText={(text) => {
                  setFormattedValue(text);
                }}
                countryPickerProps={{ withAlphaFilter: true }}
                withShadow
                autoFocus
              />
            </View>

            <TouchableWithoutFeedback onPress={activeAlert}>
              <View style={styles.subtitle}>
                <AppText text="قوانین و مقررات" color={colors.secondary} size={hp("1.6%")} style={{ textDecorationLine: "underline" }} />
              </View>
            </TouchableWithoutFeedback>

            <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title="قوانین و مقررات برنامه"
              titleStyle={{ fontFamily: "Dirooz", fontSize: hp("2.2%"), color: colors.darkBlue }}
              message="هنوز تعیین نشده است..."
              messageStyle={{
                fontFamily: "Dirooz",
                fontSize: hp("1.7%"),
                color: colors.secondary,
                alignSelf: "flex-end",
              }}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="تایید"
              confirmButtonTextStyle={{ fontFamily: "Dirooz", fontSize: hp("2%") }}
              alertContainerStyle={{ color: colors.light }}
              confirmButtonColor={colors.darkBlue}
              onConfirmPressed={hideAlert}
            />

            <View style={{ flex: 0.06 }} />

            <AwesomeAlert
              show={showProgress}
              showProgress={true}
              progressSize={wp("5%")}
              progressColor={colors.darkBlue}
              title="در حال انجام..."
              titleStyle={{ fontFamily: "Dirooz", fontSize: wp("3%"), color: colors.darkBlue }}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              alertContainerStyle={{ color: colors.light }}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowProgress(true);
                const checkValid = phoneInput.current?.isValidNumber(value);
                if (checkValid) {
                  ifPassengerExists();
                } else {
                  setShowProgress(false);
                  toast.show("شماره نامعتبر است", {
                    type: "normal",
                    duration: 3000,
                  });
                }
              }}
            >
              <AppButton
                borderRadius={wp("3%")}
                width={wp("70%")}
                height="100%"
                style={{
                  position: "absolute",
                }}
              />
              <AppText text="ادامه" color={colors.darkBlue} size={hp("3%")} style={{ textAlign: "center" }} />
            </TouchableOpacity>

            <View style={{ flex: 0.32 }} />
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0.08,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: wp("3%"),
    width: wp("70%"),
    alignSelf: "center",
  },
  buttons: {
    flex: 0.09,
    justifyContent: "center",
    alignItems: "center",
    marginTop: wp("3%"),
  },
  title: {
    flex: 0.03,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 0.04,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    flex: 0.03,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 0.16,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors["medium"],
  },
  image: {
    flex: 0.22,
    alignItems: "center",
  },
});

export default SignupScreen;

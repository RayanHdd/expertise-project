import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, TextInput, Animated } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AwesomeAlert from "react-native-awesome-alerts";
import PhoneInput from "react-native-phone-number-input";
import { SimpleAnimation } from "react-native-simple-animations";
import db_queries from "../constants/db_queries";
import { fetchData } from "../functions/db_functions";
import * as SQLite from "expo-sqlite";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import { sendSmsVerification } from "../api/verify";

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

  const _start = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const ifRecordExists = async () => {
    if (username !== "" && password !== "") {
      const data = await fetchData(db, db_queries.CHECK_IF_DRIVER_EXISTS, [username, password]);
      if (Object.values(data[0])[0] === 0) {
        console.log(false);
        toast.show("نام کاربری و/یا رمز عبور اشتباه است", {
          type: "normal",
          duration: 3000,
        });
      } else {
        navigation.navigate("DriverHome");
      }
    } else {
      const data = await fetchData(db, db_queries.CHECK_IF_MANAGER_EXISTS, [managerUsername, managerPassword]);
      if (Object.values(data[0])[0] === 0) {
        console.log(false);
        toast.show("نام کاربری و/یا رمز عبور اشتباه است", {
          type: "normal",
          duration: 3000,
        });
      } else {
        console.log(true);
        navigation.navigate("ManagerHome");
      }
    }
  };

  const activeAlert = () => {
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  const activeProgress = () => {
    setShowProgress(true);
  };

  const hideProgress = () => {
    setShowProgress(false);
  };

  useEffect(() => {
    setFormattedValue("");
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 0.05 }} />

        <View style={styles.image}>
          <Image style={{ width: "70%", height: "100%" }} source={require("../assets/images/logo.png")} />
        </View>

        <View style={{ flex: 0.02 }} />

        <View style={styles.title}>
          <AppText text="نوع کاربری" size={wp("3%")} color={colors.darkBlue} style={{ right: wp("15%") }} />
        </View>

        <View style={styles.buttons}>
          <TouchableWithoutFeedback
            onPress={() => {
              setActiveUser("passenger");
              // setUsername("");
              // setPassword("");
              // setManagerUsername("");
              // setManagerPassword("");
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
              <AppText
                text="مسافر"
                size={wp("3%")}
                color={colors.darkBlue}
                style={{ left: wp("5.5%"), top: wp("13%") }}
              />
              <AppIcon
                family="MaterialCommunityIcons"
                name="seat-passenger"
                size={wp("8%")}
                style={{ left: wp("5.2%") }}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              setActiveUser("driver");
              setManagerUsername("");
              setManagerPassword("");
              _start();
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
              <AppText
                text="راننده"
                size={wp("3%")}
                color={colors.darkBlue}
                style={{ left: wp("5.7%"), top: wp("13%") }}
              />
              <AppIcon family="MaterialCommunityIcons" name="taxi" size={wp("8%")} style={{ left: wp("4.5%") }} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              setActiveUser("manager");
              setUsername("");
              setPassword("");
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
              <AppText
                text="مدیر"
                size={wp("3%")}
                color={colors.darkBlue}
                style={{ left: wp("5.7%"), top: wp("13%") }}
              />
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
                  right: wp("28%"),
                  bottom: wp("24.5%"),
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
                <AppText
                  text="نام کاربری"
                  size={wp("3%")}
                  color={colors.darkBlue}
                  // style={{ right: wp("16%"), bottom: wp("20%") }}
                />
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  width: "75%",
                  height: "55%",
                  borderRadius: wp("2%"),
                  backgroundColor: colors.light,
                  padding: wp("3.2%"),
                  borderWidth: wp("0.2%"),
                  borderColor: colors.darkBlue,
                  // textAlignVertical: "top",
                  // textAlign: "auto",
                  // fontSize: wp("3%"),
                  // color: colors.darkBlue,
                  // fontFamily: "Dirooz",
                  shadowColor: colors.darkBlue,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 3,
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
                  value={username !== "" ? username : managerUsername}
                  placeholder="نام کاربری خود را وارد کنید"
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") {
                      if (username !== "") setUsername(username.slice(0, username.length - 1));
                      else setManagerUsername(managerUsername.slice(0, managerUsername.length - 1));
                    }
                  }}
                  onChangeText={(txt) => {
                    if (username !== "") setUsername(txt);
                    else setManagerUsername(txt);
                  }}
                  style={{
                    // width: "75%",
                    // height: "55%",
                    // borderRadius: wp("2%"),
                    // backgroundColor: colors.light,
                    // padding: wp("3.2%"),
                    // borderWidth: wp("0.2%"),
                    // borderColor: colors.darkBlue,
                    textAlignVertical: "top",
                    textAlign: "auto",
                    fontSize: wp("3.5%"),
                    color: colors.darkBlue,
                    fontFamily: "Dirooz",
                    // shadowColor: colors.darkBlue,
                    // shadowOffset: {
                    //   width: 0,
                    //   height: 2,
                    // },
                    // shadowOpacity: 0.23,
                    // shadowRadius: 2.62,
                    // elevation: 3,
                  }}
                />
              </Animated.View>
            </View>
            <View style={styles.input}>
              <Animated.View
                style={{
                  position: "absolute",
                  right: wp("26%"),
                  bottom: wp("24.5%"),
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
                <AppText
                  text="رمز عبور"
                  size={wp("3%")}
                  color={colors.darkBlue}
                  // style={{ right: wp("16%"), bottom: wp("20%") }}
                />
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  width: "75%",
                  height: "55%",
                  borderRadius: wp("2%"),
                  backgroundColor: colors.light,
                  padding: wp("3.2%"),
                  borderWidth: wp("0.2%"),
                  borderColor: colors.darkBlue,
                  // textAlignVertical: "top",
                  // textAlign: "right",
                  // fontSize: wp("3%"),
                  // color: colors.darkBlue,
                  // fontFamily: "Dirooz",
                  shadowColor: colors.darkBlue,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 3,
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
                  value={password !== "" ? password : managerPassword}
                  placeholder="رمز عبور خود را وارد کنید"
                  secureTextEntry={true}
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") {
                      if (password !== "") setPassword(password.slice(0, password.length - 1));
                      else setManagerPassword(managerPassword.slice(0, managerPassword.length - 1));
                    }
                  }}
                  onChangeText={(txt) => {
                    if (password !== "") setPassword(txt);
                    else setManagerPassword(txt);
                  }}
                  style={{
                    // width: "75%",
                    // height: "55%",
                    // borderRadius: wp("2%"),
                    // backgroundColor: colors.light,
                    // padding: wp("3.2%"),
                    // borderWidth: wp("0.2%"),
                    // borderColor: colors.darkBlue,
                    textAlignVertical: "top",
                    textAlign: "right",
                    fontSize: wp("3.5%"),
                    color: colors.darkBlue,
                    fontFamily: "Dirooz",
                    // shadowColor: colors.darkBlue,
                    // shadowOffset: {
                    //   width: 0,
                    //   height: 2,
                    // },
                    // shadowOpacity: 0.23,
                    // shadowRadius: 2.62,
                    // elevation: 3,
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
                    width: wp("3.8%"),
                    height: wp("3.8%"),
                    right: wp("15%"),
                    borderRadius: wp("0.8%"),
                    backgroundColor: colors.light,
                    borderWidth: wp("0.2%"),
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
                  <View
                    style={
                      {
                        // width: wp("3.8%"),
                        // height: wp("3.8%"),
                        // borderRadius: wp("0.8%"),
                        // backgroundColor: colors.light,
                        // borderWidth: wp("0.2%"),
                        // borderColor: colors.darkBlue,
                        // left: wp("33%"),
                      }
                    }
                  />
                </Animated.View>
                {checkMark ? (
                  <AppIcon
                    family="Entypo"
                    name="check"
                    color={colors.darkBlue}
                    size={wp("5%")}
                    style={{ right: wp("14.5%") }}
                  />
                ) : null}

                <Animated.View
                  style={{
                    position: "absolute",
                    right: wp("39%"),
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
                >
                  <AppText
                    text="ذخیره اطلاعات"
                    color={colors.secondary}
                    size={wp("3.2%")}
                    style={{ textDecorationLine: "underline" }}
                  />
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
            >
              {/* <AppText
                text="ذخیره اطلاعات"
                color={colors.secondary}
                size={wp("3.2%")}
                style={{ textDecorationLine: "underline" }}
              /> */}
            </Animated.View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                ifRecordExists();
                // const checkValid = phoneInput.current?.isValidNumber(value);
                // if (checkValid) {
                //   sendSmsVerification(formattedValue).then((sent) => {
                //     setShowProgress(false);
                //     console.log("Sent!");
                //     console.log(sent);
                //     navigation.navigate("ConfirmationCode", { phoneNumber: formattedValue });
                //   });
                // } else {
                //   setShowProgress(false);
                //   toast.show("شماره نامعتبر است", {
                //     type: "normal",
                //     duration: 3000,
                //   });
                // }
              }}
            >
              <Animated.View
                style={{
                  position: "absolute",
                  width: wp("60%"),
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
                <AppButton
                  borderRadius={wp("3%")}
                  width={wp("60%")}
                  height="100%"
                  style={
                    {
                      // position: "absolute",
                    }
                  }
                />
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  right: wp("34%"),
                  bottom: wp("9.5%"),
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
                <AppText text="ورود" color={colors.darkBlue} size={wp("4.5%")} />
              </Animated.View>
            </TouchableOpacity>
            <View style={{ flex: 0.18 }} />
          </>
        ) : (
          <>
            <View style={styles.input}>
              <AppText
                text="شماره تلفن همراه"
                size={wp("3%")}
                color={colors.darkBlue}
                style={{ right: wp("16%"), bottom: wp("24%") }}
              />
              <PhoneInput
                ref={phoneInput}
                defaultValue={null}
                placeholder="9123456789"
                containerStyle={{
                  width: "75%",
                  height: "55%",
                  borderRadius: wp("2%"),
                  backgroundColor: colors.light,
                  paddingRight: wp("5%"),
                }}
                textContainerStyle={{ fontSize: wp("4%"), color: colors.darkBlue }}
                textInputStyle={{ fontSize: wp("4%"), color: colors.darkBlue, letterSpacing: wp("0.35%") }}
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
                <AppText
                  text="قوانین و مقررات"
                  color={colors.secondary}
                  size={wp("3%")}
                  style={{ textDecorationLine: "underline" }}
                />
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

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowProgress(true);
                const checkValid = phoneInput.current?.isValidNumber(value);
                if (checkValid) {
                  sendSmsVerification(formattedValue).then((sent) => {
                    setShowProgress(false);
                    console.log("Sent!");
                    console.log(sent);
                    navigation.navigate("ConfirmationCode", { phoneNumber: formattedValue });
                  });
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
                width={wp("60%")}
                height="100%"
                style={{
                  position: "absolute",
                }}
              />
              <AppText text="ادامه" color={colors.darkBlue} size={wp("4.5%")} style={{ right: wp("26%") }} />
            </TouchableOpacity>

            <View style={{ flex: 0.34 }} />
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0.07,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: wp("3%"),
    width: wp("60%"),
    alignSelf: "center",
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // elevation: 3,
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

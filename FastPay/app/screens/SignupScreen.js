import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AwesomeAlert from "react-native-awesome-alerts";
import PhoneInput from "react-native-phone-number-input";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import { sendSmsVerification } from "../api/verify";

const SignupScreen = ({ navigation }) => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const phoneInput = useRef(null);

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
          <AppButton
            width="20%"
            height="80%"
            borderRadius={wp("2%")}
            style={{
              position: "absolute",
              left: wp("10%"),
            }}
          />
          <AppText text="مسافر" size={wp("3%")} color={colors.darkBlue} style={{ left: wp("16%"), top: wp("14%") }} />
          <AppIcon family="MaterialCommunityIcons" name="seat-passenger" size={wp("8%")} style={{ left: wp("16%") }} />

          <AppButton
            width="20%"
            height="80%"
            borderRadius={wp("2%")}
            style={{
              position: "absolute",
              left: wp("35%"),
            }}
          />
          <AppText text="راننده" size={wp("3%")} color={colors.darkBlue} style={{ left: wp("42%"), top: wp("14%") }} />
          <AppIcon family="MaterialCommunityIcons" name="taxi" size={wp("8%")} style={{ left: wp("41%") }} />

          <AppButton
            width="20%"
            height="80%"
            borderRadius={wp("2%")}
            style={{
              position: "absolute",
              left: wp("60%"),
            }}
          />
          <AppText text="مدیر" size={wp("3%")} color={colors.darkBlue} style={{ left: wp("67%"), top: wp("14%") }} />
          <AppIcon family="Fontisto" name="person" size={wp("6%")} style={{ left: wp("67.5%") }} />
        </View>

        <View style={{ flex: 0.09 }} />

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

        <View style={{ flex: 0.04 }} />

        <View style={{ flex: 0.32 }} />
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
    elevation: 3,
  },
  buttons: {
    flex: 0.09,
    justifyContent: "center",
    alignItems: "center",
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

import React, { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, TouchableOpacity, Text, View, StatusBar } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { toFarsiNumber } from "../functions/helperFunctions";

import BarcodeMask from "react-native-barcode-mask";
import AppIcon from "../components/Icon";
import colors from "../config/colors";
import AppButton from "../components/Button";
import AppText from "../components/Text";
const finderWidth = 280;
const finderHeight = 230;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

export default function BarCodeScanScreen({ navigation, route }) {
  const { wallet_charge, passenger_phone } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // const handleBarCodeScanned = (scanningResult) => {
  //   if (!scanned) {
  //     const { type, data, bounds: { origin } = {} } = scanningResult;
  //     // @ts-ignore
  //     console.log(origin);
  //     const { x, y } = origin;
  //     if (x >= viewMinX && y >= viewMinY && x <= viewMinX + finderWidth / 2 && y <= viewMinY + finderHeight / 2) {
  //       setScanned(true);
  //       alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  //     }
  //   }
  // };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      // const { type, data, bounds: { origin } = {} } = scanningResult;
      // // @ts-ignore
      // console.log(origin);
      // const { x, y } = origin;
      // if (x >= viewMinX && y >= viewMinY && x <= viewMinX + finderWidth / 2 && y <= viewMinY + finderHeight / 2) {
      //   setScanned(true);
      //   alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      // }

      // }
      setScanned(true);
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      navigation.navigate("Payment", {
        acceptor_code: toFarsiNumber(data),
        wallet_charge: wallet_charge,
        passenger_phone: passenger_phone,
      });
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        type={type}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "flex-end",
            }}
            onPress={() => {
              // setType(
              //   type === BarCodeScanner.Constants.Type.back
              //     ? BarCodeScanner.Constants.Type.front
              //     : BarCodeScanner.Constants.Type.back
              // );
              navigation.navigate("PassengerHome");
            }}
          >
            {/* <Text style={{ fontSize: 18, margin: 5, color: "white" }}> Flip </Text> */}
            {/* <Button
              title="CLOSE"
              onPress={() => {
                navigation.navigate("PassengerHome");
              }}
            /> */}
            {/* <TouchableOpacity> */}
            <AppIcon family="AntDesign" name="close" color={colors.light} size={wp("7%")} style={{ right: wp("4%") }} />
            {/* </TouchableOpacity> */}
          </TouchableOpacity>
        </View>
        <BarcodeMask edgeColor={colors.primary} showAnimatedLine />
        {scanned && (
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={{ bottom: wp("4%"), alignItems: "center", justifyContent: "center" }}
          >
            <AppButton width={wp("22%")} height={wp("12%")} borderRadius={wp("2.5%")} />
            <AppText text="اسکن دوباره" size={wp("3.5%")} color={colors.darkBlue} style={{ bottom: wp("3.5%") }} />
          </TouchableOpacity>
        )}
      </BarCodeScanner>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.darkBlue,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

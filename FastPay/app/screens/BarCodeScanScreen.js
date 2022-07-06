import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, StatusBar } from "react-native";
import BarcodeMask from "react-native-barcode-mask";
import { BarCodeScanner } from "expo-barcode-scanner";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import AppButton from "../components/Button";
import AppIcon from "../components/Icon";
import AppText from "../components/Text";
import colors from "../config/colors";
import { toFarsiNumber } from "../functions/helperFunctions";

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

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      navigation.navigate("Payment", {
        acceptor_code: toFarsiNumber(data),
        wallet_charge: wallet_charge,
        passenger_phone: passenger_phone,
      });
    }
  };

  if (hasPermission === null) {
    return (
      <Text style={{ color: "white", justifyContent: "center", alignItems: "center", fontSize: hp("5%") }}>
        Requesting for camera permission
      </Text>
    );
  }
  if (hasPermission === false) {
    return (
      <Text style={{ color: "white", justifyContent: "center", alignItems: "center", fontSize: hp("5%") }}>
        No access to camera
      </Text>
    );
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
              navigation.navigate("PassengerHome");
            }}
          >
            <AppIcon
              family="AntDesign"
              name="close"
              color="white"
              size={hp("3.8%")}
              style={{ right: wp("7%"), top: hp("3%") }}
            />
          </TouchableOpacity>
        </View>
        <BarcodeMask width={wp("70%")} height={hp("30%")} edgeColor={colors.primary} showAnimatedLine />
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

import React, { useState } from "react";
import * as Font from "expo-font";
import Apploading from "expo-app-loading";

const getFonts = () =>
  Font.loadAsync({
    Dirooz: require("../assets/fonts/Dirooz.ttf"),
  });

export default useFontLoader = () => {
  const [fontsloaded, setFontsLoaded] = useState(false);

  if (fontsloaded) return null;
  return (
    <Apploading
      startAsync={getFonts}
      onFinish={() => {
        setFontsLoaded(true);
      }}
      onError={console.warn}
    />
  );
};

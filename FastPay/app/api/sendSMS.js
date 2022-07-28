import axios from "axios";
import { parseString } from "react-native-xml2js";

import settings from "../config/settings";

const send = async (phoneNumber) => {
  try {
    const xmls =
      '<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Body> <Send xmlns="http://ParsGreen.com/"> <signature>' +
      settings.WEB_SERVICE_SIGNATURE +
      "</signature> <toMobile>" +
      phoneNumber +
      "</toMobile> <smsBody>" +
      settings.WEB_SERVICE_SMS_TEXT +
      "</smsBody> <retStr>" +
      "" +
      "</retStr> </Send> </soap:Body> </soap:Envelope>";

    const response = await axios.post(settings.WEB_SERVICE_URL, xmls, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "http://ParsGreen.com/Send",
      },
    });

    return response.status;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const sendVerificationCode = async (phoneNumber) => {
  try {
    const xmls =
      '<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Body> <SendOtp xmlns="http://ParsGreen.com/"> <signature>' +
      settings.WEB_SERVICE_SIGNATURE +
      "</signature> <mobile>" +
      phoneNumber +
      "</mobile> <Lang>" +
      settings.WEB_SERVICE_LANG +
      "</Lang> <otpType>" +
      settings.WEB_SERVICE_OTP_TYPE +
      "</otpType> <patternId>" +
      settings.WEB_SERVICE_PATTERN_ID +
      "</patternId> </SendOtp> </soap:Body> </soap:Envelope>";

    const response = await axios.post(settings.WEB_SERVICE_URL, xmls, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "http://ParsGreen.com/SendOtp",
      },
    });
    const responseXML = response.data;
    let code;
    parseString(responseXML, function (err, result) {
      code = result["soap:Envelope"]["soap:Body"][0]["SendOtpResponse"][0]["otpCode"][0];
    });
    return code;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  send,
  sendVerificationCode,
};

export const toFarsiNumber = (number) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return number
    .toString()
    .split("")
    .map((x) => farsiDigits[x])
    .join("");
};

export const toEnglishNumber = (num) => {
  const id = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return num
    ? num.toString().replace(/[^0-9.]/g, function (w) {
        return id[w] || w;
      })
    : null;
};

export const trimMoney = (number) => {
  let len = number.length;
  if (len <= 3) {
    return number;
  }

  let arr = [];
  for (let i = len; i >= 1; i -= 3) {
    arr.unshift(number.slice(i - 3, i));
  }
  return number.slice(0, len % 3) + arr.join("٬");
};

export const gregorian_to_jalali = (gy, gm, gd) => {
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  gy2 = gm > 2 ? gy + 1 : gy;
  days =
    365 * gy +
    parseInt((gy2 + 3) / 4) -
    parseInt((gy2 + 99) / 100) +
    parseInt((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * parseInt(days / 12053);
  days %= 12053;
  jy += 4 * parseInt(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += parseInt((days - 1) / 365);
    days = (days - 1) % 365;
  }
  jm = days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
  jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

  var resultY = jy.toString();
  var resultM = jm < 10 ? "0" + jm.toString() : jm.toString();
  var resultD = jd < 10 ? "0" + jd.toString() : jd.toString();
  if (resultM[0] === "0") {
    resultM = resultM[1];
  }
  if (resultD[0] === "0") {
    resultD = resultD[1];
  }
  return [resultY, resultM, resultD];
};

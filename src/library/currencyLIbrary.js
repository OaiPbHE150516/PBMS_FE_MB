import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const currencyLibrary = {
  formatCurrency: (number) => {
    // using loop to add comma to number, each 3 digits from right to left
    let result = "";
    let count = 0;
    let numberStr = number.toString();
    for (let i = numberStr.length - 1; i >= 0; i--) {
      count++;
      result = numberStr[i] + result;
      if (count % 3 === 0 && i !== 0) {
        result = "." + result;
      }
    }
    return result;
  },
  // remove all '.' and 'space' and 'đ' in string
  removeCurrencyFormat: (currency) => {
    return currency.replace(/\./g, "").replace(/ /g, "").replace(/đ/g, "");
  },
  // get vietnamese currency symbol
  getCurrencySymbol: () => {
    return "₫";
  },
  // convert string to money format vietnamese currency
  convertToMoneyFormat: (number) => {
    return currencyLibrary.formatCurrency(number) + " " + currencyLibrary.getCurrencySymbol();
  },

  // tìm số làm tròn gần nhất lớn hơn của số number, gap là 500, trả về chính nó nếu nó là số chia hết cho gap
  // ví dụ: 380 -> 500, 1200 -> 2500, 2500 -> 2500
  roundUpToNearestGap: (number, gap) => {
    return Math.ceil(number / gap) * gap;
  },
};

export default currencyLibrary;
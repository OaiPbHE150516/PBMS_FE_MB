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
  }
};

export default currencyLibrary;
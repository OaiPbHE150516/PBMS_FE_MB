import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

const dashboardServices = {
  getBalanceAllByDay: async (accountID) => {
    try {
      const response = await axios.get(
        API.DASHBOARD.BALANCE_GET_ALL_BYDAY + accountID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error getBalanceAllByDay data:", error);
    }
  },
  getBalanceAllByDayAWallet: async (accountID, walletID) => {
    // return if walletID is null or undefined
    if (!walletID) {
      return;
    }
    if (!accountID) return;
    try {
      const response = await axios.get(
        API.DASHBOARD.BALANCE_GET_ALL_BYDAY_A_WALLET +
          accountID +
          "/" +
          walletID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log(
        "Error getBalanceAllByDayAWallet dashboardServices data:",
        error
      );
    }
  },
  getTotalAmountByCategory: async (accountID, time, type) => {
    // log params
    console.log(
      "getTotalAmountByCategory accountID: ",
      accountID,
      " time: ",
      time,
      " type: ",
      type
    );
    try {
      const response = await axios.get(
        API.DASHBOARD.TOTAL_AMOUNT_BY_CATEGORY +
          type +
          "/" +
          accountID +
          "/" +
          time,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error getTotalAmountByCategory data:", error);
    }
  },
  // get total amount by type
  getTotalAmountByType: async (accountID, time) => {
    try {
      const response = await axios.get(
        API.DASHBOARD.TOTAL_AMOUNT_BY_TYPE + accountID + "/" + time,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error getTotalAmountByType data:", error);
    }
  },

};

export default dashboardServices;

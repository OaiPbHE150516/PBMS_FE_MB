import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

const dashboardServices = {
  getBalanceAllByDay: async (accountID) => {
    try {
      const response = await axios.get(API.DASHBOARD.BALANCE_GET_ALL_BYDAY + accountID, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error getBalanceAllByDay data:", error);
    }
  },
  getBalanceAllByDayAWallet: async (accountID, walletID) => {
    try {
      const response = await axios.get(API.DASHBOARD.BALANCE_GET_ALL_BYDAY_A_WALLET + accountID + "/" + walletID, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error getBalanceAllByDayAWallet dashboardServices data:", error);
    }
  },
};

export default dashboardServices;

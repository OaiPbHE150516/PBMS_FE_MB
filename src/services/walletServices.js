import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

const walletServices = {
  getAllWallet: async (accountid) => {
    try {
      const response = await axios.get(API.WALLET.GET_ALL_WALLET + accountid, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },

  getTotalBalance: async (accountid) => {
    try {
      // console.log(API.WALLET.GET_TOTAL_BALANCE + accountid);
      const response = await axios.get(
        API.WALLET.GET_TOTAL_BALANCE + accountid,
        {
          headers
        }
      );
      return response.data.totalBalance;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  getTotalBalanceEachWallet: async (accountid) => {
    try {
      const response = await axios.get(
        API.WALLET.GET_EACH_WALLET_BALANCE + accountid,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  createWallet: async (wallet) => {
    try {
      console.log("wallet", wallet);
      const response = await axios.post(API.WALLET.CREATE_WALLET, wallet, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
};
export default walletServices;

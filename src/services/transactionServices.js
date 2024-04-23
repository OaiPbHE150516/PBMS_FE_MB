import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

const transactionServices = {
  getTransactionWeekByDay: async (accountid, time) => {
    try {
      const urlapi =
        API.TRANSACTION.GET_TRANSACTION_BY_WEEK + accountid + "/" + time;
      console.log("urlapi: ", urlapi);
      const response = await axios.get(urlapi, { headers });
      return response.data;
    } catch (error) {
      console.log("Error getTransactionWeekByDay data:", error);
    }
  },
  getLastNumberExpensesTransaction: async (accountid, numberOfLastDay) => {
    try {
      const urlapi =
        API.TRANSACTION.GET_LASTNUMBERDAY_EXPENSES_TRANSACTION +
        accountid +
        "/" +
        numberOfLastDay;
      const response = await axios.get(urlapi, { headers });
      return response.data;
    } catch (error) {
      console.log("Error getLastNumberExpensesTransaction data:", error);
    }
  },

  // get transactions by time range and accountID
  getTransactionByTimeRange: async (data) => {
    try {
      console.log(data);
      const response = await axios.get(
        API.TRANSACTION.GET_TRANSACTION +
          data?.accountID +
          "/" +
          data?.timeRange,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error getTransactionByTimeRange data:", error);
    }
  },

  // get detail of a transaction by transactionID
  getTransactionDetail: async (data) => {
    try {
      // console.log("transactionID: ", data.transactionID);
      // console.log("accountID: ", data.accountID);
      const response = await axios.get(
        API.TRANSACTION.GET_TRANSACTION_DETAIL +
          data?.transactionID +
          "/" +
          data?.accountID,
        {
          headers
        }
      );
      // console.log("response: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error getTransactionDetail data:", error);
    }
  },

  // get recently transaction by accountID
  getRecentlyTransaction: async (data) => {
    try {
      const response = await axios.get(
        API.TRANSACTION.GET_RECENTLY_TRANSACTION +
          data.accountID +
          "/" +
          data.limit,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error getRecentlyTransaction data:", error);
    }
  },

  addTransactionNoInvoice: async (data) => {
    try {
      const response = await axios.post(
        API.TRANSACTION.ADD_TRANSACTION_NO_INVOICE,
        data,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error addTransactionNoInvoice data:", error);
    }
  },

  addTransactionWithInvoice: async (data) => {
    try {
      const response = await axios({
        method: "post",
        url: API.TRANSACTION.ADD_TRANSACTION_WITH_INVOICE,
        data: data,
        headers: {
          "Content-type": "application/json"
        }
      });
      console.log("response: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error addTransactionWithInvoice:", error);
    }
  }
};

export default transactionServices;

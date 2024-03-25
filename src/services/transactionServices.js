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
      console.error("Error fetching data:", error);
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
      console.error("Error fetching data:", error);
    }
  },
  addTransactionWithInvoice: async (data) => {
    try {
      const response = await axios.post(
        API.TRANSACTION.ADD_TRANSACTION_WITH_INVOICE,
        data,
        {
          headers
        }
      );
      console.log("response: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

export default transactionServices;

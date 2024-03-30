import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

const collabFundServices = {
  getAllCollabFund: async (accountID) => {
    try {
      const response = await axios.get(
        API.COLLABFUND.GET_ALL_COLLABFUND + accountID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  getCollabFundActivities: async (data) => {
    try {
      const response = await axios.get(
        API.COLLABFUND.GET_COLLABFUND_ACTIVITIES +
          data?.data?.collabFundID +
          "/" +
          data?.data?.accountID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  // create activity no transaction form
  createActivityNoTransaction: async (data) => {
    try {
      const formHeader = {
        "Content-Type": "multipart/form-data"
      };
      const response = await axios.post(
        API.COLLABFUND.CREATE_ACTIVITY_NO_TRANSACTION,
        data,
        {
          formHeader
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

export default collabFundServices;

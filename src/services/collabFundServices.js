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
      console.log("dataa: ", data);
      console.log("accoundID: ", data?.data?.accountID);
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
  }
};

export default collabFundServices;

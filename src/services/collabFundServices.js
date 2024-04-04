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
        API.COLLABFUND.GET_COLLABFUND_ACTIVITIES_V2 +
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
  // get participant list of collab fund by collab fund id and account id
  getCollabFundParticipants: async (data) => {
    try {
      const response = await axios.get(
        API.COLLABFUND.GET_ALL_COLLABFUND_PARTICIPANTS +
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
  // get divide money information by collab fund id and account id
  getDivideMoneyInfor: async (data) => {
    try {
      const response = await axios.get(
        API.COLLABFUND.GET_DIVIDI_MONEY_INFOR +
          data?.data?.collabFundID +
          "/" +
          data?.data?.accountID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching data:", error);
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
  },

  // create activity with transaction form ( default )
  createActivity: async (data) => {
    try {
      const formHeader = {
        "Content-Type": "multipart/form-data"
      };
      const response = await axios.post(API.COLLABFUND.CREATE_ACTIVITY, data, {
        formHeader
      });
      return response.data;
    } catch (error) {
      console.error("Error posting data createActivity:", error);
    }
  }
};

export default collabFundServices;

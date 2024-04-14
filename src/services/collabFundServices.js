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
      console.error("Error getAllCollabFund data:", error);
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
      console.error("Error getCollabFundActivities data:", error);
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
      console.error("Error getCollabFundParticipants data:", error);
    }
  },
  // get collab fund divide money history by collab fund id and account id
  getCollabFundDivideMoneyHistory: async (data) => {
    try {
      const response = await axios.get(
        API.COLLABFUND.GET_DIVIDE_MONEY_HISTORY +
          data?.data?.collabFundID +
          "/" +
          data?.data?.accountID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getCollabFundDivideMoneyHistory data:", error);
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
      console.log("Error getDivideMoneyInfor data:", error);
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
      console.error("Error createActivityNoTransaction data:", error);
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
  },

  // post method to divide money
  postDivideMoney: async (data) => {
    try {
      const jsonHeader = {
        "Content-Type": "application/json"
      };
      console.log(data);
      const response = await axios.post(
        API.COLLABFUND.POST_DIVIDE_MONEY,
        // "https://pbms-be-api-vqj42lqqmq-as.a.run.app/api/collabfund/divide-money",
        data.data,
        {
          headers: jsonHeader // Sử dụng 'headers' thay vì 'jsonHeader'
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error postDivideMoney data:", error);
    }
  },

  // search account by keyword
  searchAccountByKeyword: async (data) => {
    try {
      const response = await axios.get(API.ACCOUNT.SEARCH_KEYWORD + data, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error searchAccountByKeyword data:", error);
    }
  },

  // create collabfund
  createCollabFund: async (data) => {
    try {
      const response = await axios.post(API.COLLABFUND.CREATE_CF, data, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error createCollabFund data:", error);
    }
  },

  // upload image cover
  uploadImageCover: async (data) => {
    try {
      const formHeader = {
        "Content-Type": "multipart/form-data"
      };
      let fileURL = "";
      const formData = new FormData();
      const filename = data?.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append("file", {
        uri: data?.uri,
        name: filename,
        type
      });
      await axios({
        method: "post",
        url: API.COLLABFUND.UPLOAD_IMAGE_COVER,
        data: formData,
        headers: formHeader
      })
        .then((response) => {
          fileURL = response.data;
          // console.log("fileURL", fileURL);
        })
        .catch((error) => {
          console.error("Error uploadImageCover data:", error);
        });
      return fileURL;
    } catch (error) {
      console.error("Error uploadImageCover data:", error);
    }
  },

  // accept to collab fund
  acceptToCollabFund: async (data) => {
    try {
      console.log(data);
      const response = await axios.put(API.COLLABFUND.ACCEPT_CF_INVITATION, data, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error acceptToCollabFund data:", error);
    }
  },

  // reject to collab fund
  rejectToCollabFund: async (data) => {
    try {
      const response = await axios.put(API.COLLABFUND.REJECT_CF_INVITATION, data, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error rejectToCollabFund data:", error);
    }
  }
};

export default collabFundServices;

import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

const categoryServices = {
  getCategories: async (accountid) => {
    try {
      const urlapi = API.CATEGORY.GET_CATEGORIES + accountid;
      console.log("urlapi: ", urlapi);
      const response = await axios.get(urlapi, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

export default categoryServices;

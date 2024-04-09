import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

const categoryServices = {
  getCategories: async (accountid) => {
    try {
      const urlapi = API.CATEGORY.GET_CATEGORIES + accountid;
      // console.log("urlapi: ", urlapi);
      const response = await axios.get(urlapi, { headers });
      return response.data;
    } catch (error) {
      console.error("Error getCategories data:", error);
    }
  },
  createCategory: async (category) => {
    try {
      const newCategory = {
        accountID: category.accountID,
        nameVN: category.name,
        nameEN: category.name,
        parentCategoryID: category.parentID,
      };
      console.log("newCategory: ", newCategory);
      const response = await axios.post(API.CATEGORY.CREATE_CATEGORY, newCategory, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error createCategory data:", error);
    }
  },
};

export default categoryServices;

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
      console.log("Error getCategories data:", error);
    }
  },
  createCategory: async (category) => {
    try {
      const newCategory = {
        accountID: category.accountID,
        nameVN: category.name,
        nameEN: category.name,
        parentCategoryID: category.parentID
      };
      console.log("newCategory: ", newCategory);
      const response = await axios.post(
        API.CATEGORY.CREATE_CATEGORY,
        newCategory,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error createCategory data:", error);
    }
  },

  // delete category
  deleteCategory: async (data) => {
    try {
      const response = await axios.delete(
        API.CATEGORY.DELETE_CATEGORY + data?.categoryID + "/" + data.accountID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error deleteCategory data:", error);
    }
  },

  // update category
  updateCategory: async (data) => {
    try {
      console.log("data: ", data);
      const newCategory = {
        categoryID: data?.cate?.categoryID,
        accountID: data?.accountID,
        nameVN: data?.cate?.nameVN,
        nameEN: data?.cate?.nameVN,
        parentCategoryID: data?.cate?.parentCategoryID
      };
      console.log("newCategory: ", newCategory);
      const response = await axios.put(
        API.CATEGORY.UPDATE_CATEGORY,
        newCategory,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error updateCategory data:", error);
    }
  },

  // get all category
  getAllCategories: async (accountid) => {
    try {
      const urlapi = API.CATEGORY.GET_ALL_CATEGORY + accountid;
      // console.log("urlapi: ", urlapi);
      const response = await axios.get(urlapi, { headers });
      return response.data;
    } catch (error) {
      console.log("Error getCategories data:", error);
    }
  },
};

export default categoryServices;

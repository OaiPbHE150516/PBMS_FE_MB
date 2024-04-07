import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};
const budgetServices = {
  getAllBudget: async (accountID) => {
    try {
      const response = await axios.get(API.BUDGET.GET_ALL + accountID, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error("Error getAllBudget data:", error);
    }
  },
  getBudgetDetail: async (data) => {
    try {
      const response = await axios.get(
        API.BUDGET.GET_BUDGET_DETAIL + data?.budgetID + "/" + data?.accountID,
        {
          headers
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getBudgetDetail data:", error);
    }
  },
};

export default budgetServices;

import axios from "axios";
import { API } from "../../constants/api.constant";

const headers = {
  "Content-type": "application/json"
};

async function getTransactionWeekByDayS(accountid, time) {
  try {
    const urlapi =
      API.TRANSACTION.GET_TRANSACTION_BY_WEEK + accountid + "/" + time;
    console.log("urlapi: ", urlapi);
    const response = await axios.get(urlapi, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default { getTransactionWeekByDayS };

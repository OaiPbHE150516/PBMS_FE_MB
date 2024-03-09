import axios from "axios";
import { API } from "../constants/api.constant";

// const getAllAccounts = async () => {
//   try {
//     const response = await axios.get(API.GET_ALL_ACCOUNTS, config);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

const headers = {
  "Content-type": "application/json",
};

const signin = async (data) => {
  try {
    axios.create({
      baseURL: "https://pbms-be-api-vqj42lqqmq-as.a.run.app",
    });
    // const response = await axios.post(API.SIGN_IN, data, config);
    const response = await axios.get("/api/test/getAllAccount", { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default {
  //   getAllAccounts,
  signin,
};

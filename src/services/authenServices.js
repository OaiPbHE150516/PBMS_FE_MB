import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-type": "application/json",
};


const authenServices = {
  signin: async (data) => {
    try {
      const response = await axios.post(API.AUTHEN.SIGN_IN, data, { headers });
      console.log("response signin: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error authenServices:", error);
    }
  }
};
export default authenServices;
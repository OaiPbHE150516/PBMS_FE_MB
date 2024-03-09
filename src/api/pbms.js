import axios from "axios";

export default axios.create({
  baseURL: "https://pbms-be-api-vqj42lqqmq-as.a.run.app",
  headers: {
    "Content-type": "application/json",
  },
});
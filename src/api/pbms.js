import axios from "axios";

export default axios.create({
  baseURL: "https://pbms-be-api-vqj42lqqmq-as.a.run.app",
  // baseURL: "https://192.168.0.102:8081",
  headers: {
    "Content-type": "application/json",
  },
});
import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-Type": "multipart/form-data"
};

const fileServices = {
  upToScanInvoice: async (file) => {
    try {
      const urlapi = API.INVOICE.SCAN;
      console.log("urlapi: ", urlapi);
      const formData = new FormData();
      const filename = file.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      const filedata = {
        uri: file.uri,
        name: filename,
        type
      };
      console.log("filedata: ", filedata);
      formData.append("file", filedata);
    //   formData.append("file", {
    //     uri: file.uri,
    //     name: filename,
    //     type
    //   });
      const response = await axios.post(urlapi, formData, { headers });
      console.log("response: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

import axios from "axios";
import { API } from "../constants/api.constant";

const headers = {
  "Content-Type": "multipart/form-data"
};

const fileServices = {
  upToScanInvoice: async (asset) => {
    try {
      const header = {
        "Content-Type": "multipart/form-data"
      };
      const urlapi = API.INVOICE.SCAN + "test";
      const formData = new FormData();
      const filename = asset?.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      const filedata = {
        uri: asset?.uri,
        name: filename,
        type: type
      };
      formData.append("file", filedata);
      //   formData.append("file", {
      //     uri: file.uri,
      //     name: filename,
      //     type
      //   });
      const response = await axios.post(urlapi, formData, { header });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

export default fileServices;
import axios from "axios";
import { API } from "../constants/api.constant";

// const headers = {
//   "Content-Type": "multipart/form-data"
// };

const fileServices = {
  upToScanInvoice: async (asset) => {
    try {
      const header = {
        "Content-Type": "multipart/form-data"
      };
      const urlapi = API.INVOICE.SCAN;
      // const urlapi = API.INVOICE.SCAN;
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
  },
  uploadToInvoiceTransaction: async (asset) => {
    try {
      const header = {
        "Content-Type": "multipart/form-data"
      };
      const urlapi = API.FILE.UPLOAD_INVOICE_OF_TRANSACTION;
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
  },
  uploadToInvoiceTransactionFileName: async ({ asset, filenamecustom }) => {
    try {
      const header = {
        "Content-Type": "multipart/form-data"
      };
      // console.log("filenamecustom: ", filenamecustom);
      const urlapi =
        API.FILE.UPLOAD_INVOICE_OF_TRANSACTION_FILE_NAME +
        "?" +
        "filename" +
        "=" +
        filenamecustom;
      // console.log("api: ", urlapi);
      // console.log("asset: ", asset);

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

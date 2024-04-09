import axios from "axios";
import { API } from "../constants/api.constant";

import { Platform } from "react-native";

// const headers = {
//   "Content-Type": "multipart/form-data"
// };

const fileServices = {
  upToScanInvoice: async (asset) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      const header = {
        "Content-Type": "multipart/form-data"
      };
      const urlapi = API.INVOICE.SCAN_V4;
      // const urlapi = API.INVOICE.SCAN;
      const formData = new FormData();
      const filename = asset?.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let filedata = null;
      if (Platform.OS === "android") {
        // change uri 'file://' to 'content://' for android
        // const androidUri = asset?.uri.replace("file:///", "content://");
        filedata = {
          uri: asset?.uri,
          name: filename,
          type: type
        };
      } else {
        filedata = {
          uri: asset?.uri,
          name: filename,
          type: type
        };
      }
      console.log("filedata: ", filedata);
      formData.append("file", filedata);
      //   formData.append("file", {
      //     uri: file.uri,
      //     name: filename,
      //     type
      //   });
      const response = await axios.post(urlapi, formData, { config });
      return response.data;
    } catch (error) {
      console.error("Error upToScanInvoice data:", error);
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
      console.error("Error uploadToInvoiceTransaction data:", error);
    }
  },

  uploadToInvoiceTransactionFileName: async ({
    asset,
    filenamecustom,
    accountID
  }) => {
    try {
      const header = {
        "Content-Type": "multipart/form-data"
      };
      // console.log("filenamecustom: ", filenamecustom);
      const urlapi = API.FILE.UPLOAD_INVOICE_OF_TRANSACTION_FILE_NAME;
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
      formData.append("filename", filenamecustom);
      formData.append("accountID", accountID);
      const response = await axios.post(urlapi, formData, { header });
      return response.data;
    } catch (error) {
      console.error("uploadToInvoiceTransactionFileName data:", error);
    }
  },
  uploadToInvoiceTransactionFileNameV2: async ({
    asset,
    filenamecustom,
    accountID
  }) => {
    try {
      const urlapi = API.FILE.UPLOAD_INVOICE_OF_TRANSACTION_FILE_NAME;
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
      formData.append("filename", filenamecustom);
      formData.append("accountID", accountID);
      await axios({
        method: "post",
        url: urlapi,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          console.log(
            "Upload Progress: " +
              Math.round((progressEvent.loaded / progressEvent.total) * 100) +
              "%"
          );
        }
      })
        .then((response) => {
          if (response) {
            console.log("response.data: ", response.data);
            return response.data;
          }
        })
        .catch((error) => {
          console.error("uploadToInvoiceTransactionFileName data:", error);
        });
    } catch (error) {
      console.error("uploadToInvoiceTransactionFileName data:", error);
    }
  }
};

export default fileServices;

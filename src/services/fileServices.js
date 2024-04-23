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
      console.log("Error upToScanInvoice data:", error);
    }
  },

  uploadToScanInvoice: async (asset) => {
    try {
      const urlapi = API.INVOICE.SCAN_V4;
      const formData = new FormData();
      const filename = asset?.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let filedata = null;
      if (Platform.OS === "android") {
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
      formData.append("file", filedata);
      let dataReturn = null;
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
            console.log("uploadToScanInvoice response.data: ", response.data);
            dataReturn = response.data;
          }
        })
        .catch((error) => {
          console.log("uploadToScanInvoice data:", error);
        });
      return dataReturn;
    } catch (error) {
      console.log("Error upToScanInvoice data:", error);
    }
  },

  uploadToScanInvoiceV5: async (data) => {
    try {
      console.log("data: ", data);
      const urlapi = API.INVOICE.SCAN_V5;
      const formData = new FormData();
      const filename = data?.asset?.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let filedata = null;
      if (Platform.OS === "android") {
        filedata = {
          uri: data?.asset?.uri,
          name: filename,
          type: type
        };
      } else {
        filedata = {
          uri: data?.asset?.uri,
          name: filename,
          type: type
        };
      }
      formData.append("accountID", data?.accountID);
      formData.append("file", filedata);
      let dataReturn = null;
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
            console.log("uploadToScanInvoice response.data: ", response.data);
            dataReturn = response.data;
          }
        })
        .catch((error) => {
          console.log("uploadToScanInvoice data:", error);
        });
      return dataReturn;
    } catch (error) {
      console.log("Error upToScanInvoice data:", error);
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
      console.log("Error uploadToInvoiceTransaction data:", error);
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
      console.log("uploadToInvoiceTransactionFileName data:", error);
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
          console.log("uploadToInvoiceTransactionFileName data:", error);
        });
    } catch (error) {
      console.log("uploadToInvoiceTransactionFileName data:", error);
    }
  }
};

export default fileServices;

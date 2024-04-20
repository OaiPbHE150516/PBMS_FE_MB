import { Platform } from "react-native";

const fileLibrary = {
  getFileData: (file) => {
    const filename = file?.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let filedata = null;
    if (Platform.OS === "android") {
      filedata = {
        uri: file?.uri,
        name: filename,
        type: type
      };
    } else {
      filedata = {
        uri: file?.uri,
        name: filename,
        type: type
      };
    }
    return filedata;
  }
};

export default fileLibrary;
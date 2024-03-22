import React, { useState, useEffect, useRef, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Button,
  Modal,
  Image,
  Platform
} from "react-native";
import { setAssetsShowing } from "../../redux/mediaLibrarySlice";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";

const TabImagePicker = () => {
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  async function getImageFromPicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    console.log("result", result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      dispatch(
        setAssetsShowing({ asset: result.assets[0], isShowingAsset: "true" })
      );
    }
  }

  async function launchCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      dispatch(
        setAssetsShowing({ asset: result.assets[0], isShowingAsset: "true" })
      );
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getImageFromPicker();
      // launchCamera();
    }, 200);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )} */}
      <Button
        title="Pick an image from camera roll"
        onPress={() =>
          // launchCamera()
          getImageFromPicker()
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewImagePicker: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 100
  }
});
export default TabImagePicker;

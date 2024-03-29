import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  Image,
  Pressable
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import { useSelector, useDispatch } from "react-redux";
import { setAssetsShowing } from "../../redux/mediaLibrarySlice";

const SmallPopup = () => {
  return (
    <View style={styles.viewSmallPopup}>
      <Text>smallPopup</Text>
    </View>
  );
};

const TabCamera = ({}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [focus, setFocus] = useState(Camera.Constants.AutoFocus.on);
  const [camera, setCamera] = useState(null);
  const [newestAsset, setNewestAsset] = useState(null);

  useEffect(() => {
    (async () => {
      const { statusMediaLib } = await MediaLibrary.requestPermissionsAsync();
      setHasLibraryPermission(statusMediaLib === "granted");
      const { statusCamera } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(statusCamera === "granted");
      getNewestAsset();
    })();
  }, []);

  //   function handleContinue() {
  //     onDataFromChildCam({
  //       isCameraVisible: false
  //     });
  //   }

  const getNewestAsset = async () => {
    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      first: 1
    });
    console.log("getNewestAsset", assets.assets[0]);
    setNewestAsset(assets.assets[0]);
  };

  const handleFocusCamera = () => {
    setFocus(Camera.Constants.AutoFocus.off);
    setTimeout(() => {
      setFocus(Camera.Constants.AutoFocus.on);
    }, 50);
  };

  const handleFlashCamera = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.on
        ? Camera.Constants.FlashMode.off
        : Camera.Constants.FlashMode.on
    );
  };

  const handleTorchCamera = () => {
    if (flash === Camera.Constants.FlashMode.torch) {
      setFlash(Camera.Constants.FlashMode.on);
    } else {
      setFlash(Camera.Constants.FlashMode.torch);
    }
    // setFlash(
    //   type === Camera.Constants.FlashMode.torch
    //     ? Camera.Constants.FlashMode.on
    //     : Camera.Constants.FlashMode.torch
    // );
  };

  const handleFlipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const dispatch = useDispatch();

  const handleTakeShot = async () => {
    // takePicture();
    if (camera) {
      const photo = await camera.takePictureAsync();
      dispatch(setAssetsShowing({ asset: photo, isShowingAsset: "true" }));
    }
  };

  async function handleOpenImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });
    console.log("result", result);
    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      dispatch(
        setAssetsShowing({ asset: result.assets[0], isShowingAsset: "true" })
      );
    }
  }

  // const takePicture = async () => {
  //   if (camera) {
  //     const photo = await camera.takePictureAsync();
  //     const asset = await MediaLibrary.createAssetAsync(photo.uri);
  //     console.log("photo", photo);
  //     setImage(photo.uri);
  //     const album = await MediaLibrary.getAlbumAsync("Oai");
  //     if (album === null) {
  //       await MediaLibrary.createAlbumAsync("Oai", asset, false);
  //     } else {
  //       await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  //     }
  //   }
  // };
  return (
    <View style={styles.container}>
      <View style={styles.viewTabCamera}>
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={(ref) => {
            setCamera(ref);
          }}
          autoFocus={focus}
        >
          <Pressable
            onPress={() => handleFocusCamera()}
            style={styles.pressableOverlayCam}
          ></Pressable>
          {/* <SmallPopup /> */}
          <BlurView intensity={3} style={styles.modalViewButton}>
            <Pressable
              style={styles.pressableOtherButton}
              onPress={() => {
                handleOpenImagePicker();
              }}
            >
              {/* an image of newestasset */}
              {newestAsset && (
                <Image
                  source={{ uri: newestAsset.uri }}
                  style={[styles.pressableOtherButton, { borderRadius: 20 }]}
                />
              )}
              {/* <Icon
                name="bolt"
                size={28}
                color={
                  flash === Camera.Constants.FlashMode.on ? "white" : "gray"
                }
              /> */}
            </Pressable>
            <Pressable
              style={styles.pressableOtherButton}
              onPress={() => handleFlashCamera()}
            >
              <Icon
                name="bolt"
                size={28}
                color={
                  flash === Camera.Constants.FlashMode.on ? "white" : "gray"
                }
              />
            </Pressable>

            <Pressable
              style={styles.pressableTakeCamera}
              onPress={() => handleTakeShot()}
            >
              <Icon name="circle" size={80} color="white" />
            </Pressable>
            {/* <Pressable
              style={styles.pressableOtherButton}
              onPress={() => handleFocusCamera()}
            >
              <Icon name="expand" size={28} color="white" />
            </Pressable> */}
            <Pressable
              style={styles.pressableOtherButton}
              onPress={() => handleTorchCamera()}
            >
              <Icon
                name={
                  flash === Camera.Constants.FlashMode.torch
                    ? "wand-magic-sparkles"
                    : "wand-magic"
                }
                size={28}
                color="white"
              />
            </Pressable>
            <Pressable
              style={styles.pressableOtherButton}
              onPress={() => handleFlipCamera()}
            >
              <Icon name="camera-rotate" size={28} color="white" />
            </Pressable>
          </BlurView>
        </Camera>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pressableOtherButton: {
    width: 50,
    height: 50,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    // bottom: -10,
    marginHorizontal: 10,
  },
  pressableOverlayCam: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  pressableTakeCamera: {
    // width: 100,
    // height: 55,
    borderRadius: 50,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "darkgray",
    borderWidth: 1,
    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5
  },
  viewSmallPopup: {
    // flex: 1,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderColor: "red",
    borderWidth: 1,
    bottom: Dimensions.get("window").height * 0.15
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  viewTabCamera: {
    width: "100%",
    height: "100%"
  },
  camera: {
    flex: 1
  },
  modalViewButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.025,
    margin: 10,
    // borderWidth: 1,
    // borderColor: "darkgray",
    width: "100%"
    // backgroundColor: "red"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
export default TabCamera;

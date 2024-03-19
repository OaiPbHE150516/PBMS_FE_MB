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
  // const cameraRef = useRef(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { statusMediaLib } = await MediaLibrary.requestPermissionsAsync();
      setHasLibraryPermission(statusMediaLib === "granted");
      const { statusCamera } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(statusCamera === "granted");
    })();
  }, []);

  //   function handleContinue() {
  //     onDataFromChildCam({
  //       isCameraVisible: false
  //     });
  //   }

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

  const handleTakeShot = () => {
    takePicture();
  };

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      console.log("photo", photo);
      setImage(photo.uri);
      // check that we have album name "Expo" or not, if not, create it, then save photo to it, if yes, save photo to it
      const album = await MediaLibrary.getAlbumAsync("Oai");
      if (album === null) {
        await MediaLibrary.createAlbumAsync("Oai", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      // MediaLibrary.createAlbumAsync("Expo", asset)
      // .then(() => {
      //   Alert.alert("Photo saved to album!");
      // })
      // .catch((error) => {
      //   Alert.alert("An Error Occurred!", error);
      // });
    }
  };
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
              onPress={() => handleFlashCamera()}
            >
              <Icon name="bolt" size={28} color={flash === Camera.Constants.FlashMode.on ? "white" : "gray"} />
            </Pressable>
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
              style={styles.pressableTakeCamera}
              onPress={() => handleTakeShot()}
            >
              <Icon name="circle" size={80} color="white" />
            </Pressable>
            <Pressable
              style={styles.pressableOtherButton}
              onPress={() => handleFocusCamera()}
            >
              <Icon name="expand" size={28} color="white" />
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
    bottom: -10
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

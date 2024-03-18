import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  Image
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

const TestScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
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
      {/* {!!image && <Image source={{ uri: image }} style={{ flex: 1 }} />} */}
      {/* {!image ? ( */}
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flash}
        ref={(ref) => {
          setCamera(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <Button
            title="Flip"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          />
          <Button title="Take Picture" onPress={takePicture} />
          <Button
            title="Flash"
            onPress={() => {
              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.on
                  : Camera.Constants.FlashMode.off
              );
            }}
          />

          {/* a button to view all image of user */}
          <Button
            title="View Image"
            onPress={async () => {
              const album = await MediaLibrary.getAlbumAsync("Expo");
              const photos = await MediaLibrary.getAssetsAsync({
                album: album,
                first: 20
              });
              console.log("photos", photos);
            }}
          />
          <Button
            title="View Album"
            onPress={async () => {
              const albums = await MediaLibrary.getAlbumsAsync();
              console.log("albums", albums);
            }}
          />
          <Button
            title="View All"
            onPress={async () => {
              const media = await MediaLibrary.getAssetsAsync({ mediaType: 'photo', first: 100 });
              // setTimeout(() => {
              //   console.log('Danh sách ảnh:', media.assets);
              // }, 5000);
              console.log('Danh sách ảnh:', media.assets);
            }}
          />
        </View>
      </Camera>
      {/* ) : (
        <Image source={{ uri: image }} style={{ flex: 1 }} />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
    margin: 20
  }
});

export default TestScreen;

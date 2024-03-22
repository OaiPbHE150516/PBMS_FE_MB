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
import { BlurView } from "expo-blur";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome6";
import * as MediaLibrary from "expo-media-library";

import TabCamera from "./tabCamera";
import TabMediaLibrary from "./tabMediaLibrary";
import { setAssetsShowing } from "../../redux/mediaLibrarySlice";
import { VAR } from "../../constants/var.constant";
import { upToScanInvoice } from "../../redux/fileSlice";

const Tab = createMaterialTopTabNavigator();

// const Tab3 = () => {
//   const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//     </View>
//   );
// };

const ModalTakeCamera = ({ onDataFromChild }) => {
  const assetsShowing = useSelector(
    (state) => state.mediaLibrary?.assetsShowing ?? null
  );
  const invoiceScanning = useSelector((state) => state.file?.invoiceScanning);

  function handleCancel() {
    onDataFromChild({
      isCameraVisible: false,
      isInvoiceScanning: false
    });
  }
  const dispatch = useDispatch();

  async function handleSaveAssetToMediaLibrary({ asset }) {
    console.log("saveAssetToMediaLibrary", asset);

    const album = await MediaLibrary.getAlbumAsync(
      VAR.MEDIALIBRARY.DEFAULT_ALBUM_NAME
    );
    if (album === null) {
      console.log("album is null");
      const albumCreated = await MediaLibrary.createAlbumAsync(
        VAR.MEDIALIBRARY.DEFAULT_ALBUM_NAME,
        asset
      );
      console.log("albumCreated", albumCreated);
    } else {
      console.log("album is not null");
      const assetSaved = await MediaLibrary.createAssetAsync(asset.uri);
      console.log("assetSaved", assetSaved);
      const assetAdded = await MediaLibrary.addAssetsToAlbumAsync(
        [assetSaved],
        album,
        false
      );
      console.log("assetAdded", assetAdded);
    }
    dispatch(upToScanInvoice(asset));
    dispatch(setAssetsShowing({ asset: asset, isShowingAsset: "false" }));
    onDataFromChild({
      isCameraVisible: false,
      isInvoiceScanning: true
    });
  }

  function onDispatchCloseModalShowingAsset() {
    dispatch(setAssetsShowing({ asset: null, isShowingAsset: "false" }));
  }

  function handleOnCancelAssetShowing() {
    onDispatchCloseModalShowingAsset();
  }

  return (
    <View style={styles.modalView}>
      <View style={styles.modalViewCloseModal}>
        <Pressable
          style={styles.pressableCLoseModal}
          onPress={() => handleCancel()}
        >
          <Text style={styles.textStyle}>Hủy</Text>
          <Text style={styles.textStyle}>
            {assetsShowing?.asset?.filename ?? "Unknown filename"}
          </Text>
          <Text style={styles.textStyle}>{assetsShowing?.isShowingAsset}</Text>
          <Icon
            name="caret-down"
            size={20}
            color="white"
            style={styles.iconCloseModal}
          />
        </Pressable>
        <Modal
          visible={assetsShowing?.isShowingAsset === "true"}
          animationType="fade"
          transparent={true}
          width={100}
        >
          <BlurView intensity={50} tint="dark" style={styles.blurViewAnAsset}>
            <Image
              source={{ uri: assetsShowing?.asset?.uri }}
              style={styles.imageShowingAsset}
            />
            <View style={styles.viewModalShowingAssetPressable}>
              <Pressable
                style={styles.pressableModalCancelAsset}
                onPress={() => {
                  handleOnCancelAssetShowing();
                }}
              >
                <Text style={styles.textModalShowingAssetPressable}>Hủy</Text>
              </Pressable>
              <Pressable
                style={styles.pressableModalSaveAsset}
                onPress={() => {
                  handleSaveAssetToMediaLibrary({
                    asset: assetsShowing?.asset
                  });
                }}
              >
                <Text style={styles.textModalShowingAssetPressable}>Lưu</Text>
              </Pressable>
            </View>
          </BlurView>
        </Modal>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          swipeEnabled: true,
          lazy: true,

          tabBarIndicatorStyle: { backgroundColor: "tomato" },
          tabBarStyle: {
            alignSelf: "center",
            flexDirection: "row",
            width: Dimensions.get("window").width * 0.99,
            height: 40,
            justifyContent: "center",
            alignContent: "center"
          },
          tabBarItemStyle: {
            // width: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            alignContent: "center",
            flexDirection: "row",
            width: Dimensions.get("window").width * 0.45
          },
          tabBarLabelStyle: {
            fontSize: 17,
            fontFamily: "Inconsolata_500Medium",
            color: "darkgray",
            textTransform: "capitalize",
            letterSpacing: 1
          }
        }}
      >
        <Tab.Screen name="Camera" component={TabCamera} />
        {/* <Tab.Screen name="Tab 3" component={TabImagePicker} /> */}
        <Tab.Screen name="Thư viện (Only View)" component={TabMediaLibrary} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  imageShowingAsset: {
    width: "90%",
    height: "90%",
    alignSelf: "center",
    justifyContent: "space-around",
    resizeMode: "contain"
  },
  viewModalShowingAssetPressable: {
    justifyContent: "space-around",
    flexDirection: "row",
    height: "5%"
  },
  pressableModalSaveAsset: {
    backgroundColor: "#63ADF2",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "40%"
  },
  pressableModalCancelAsset: {
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "40%"
  },
  textModalShowingAssetPressable: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium"
  },
  blurViewAnAsset: {
    flex: 1
  },
  viewModalShowingAsset: {
    // flex: 1,
    // width: "50%",
    // // height: "50%",
    // borderColor: "green",
    // borderWidth: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  iconCloseModal: {},
  modalViewCloseModal: {
    position: "absolute",
    zIndex: 99,
    alignSelf: "center",
    bottom: 2,
    width: "90%"
    // height: 30
    // borderColor: "tomato",
    // borderWidth: 1
  },
  pressableCLoseModal: {
    borderRadius: 5,
    backgroundColor: "lightgrey",
    // flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    height: 20
  },
  viewTabCamera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    flex: 1
  },
  modalView: {
    height: "100%",
    width: "100%",
    // backgroundColor: "white",
    borderRadius: 20,
    // padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTextHeader: {
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Inconsolata_500Medium"
  },
  modalViewButton: {
    flexDirection: "row",
    justifyContent: "space-between"
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
    textAlign: "center",
    marginHorizontal: 5
  }
});

export default ModalTakeCamera;

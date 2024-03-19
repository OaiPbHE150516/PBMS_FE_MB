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
  Pressable,
  Modal
} from "react-native";
import * as MediaLibrary from "expo-media-library";

const ViewModalAssetsInAlbum = ({ props, onHandlePressableAnAssetToP }) => {
  const [assetsInAlbum, setAssetsInAlbum] = useState(null);
  const albumData = props;
  const [assetSize, setAssetSize] = useState(0);

  const getAssetsInAlbum = async (albumName) => {
    const album = await MediaLibrary.getAlbumAsync(albumName);
    const assets = await MediaLibrary.getAssetsAsync({
      album: album,
      first: 200
    });
    setAssetsInAlbum(assets);
    // console.log("assets", assets);
  };

  const calculateSizeOfAssets = () => {
    const width = Dimensions.get("window").width - 20;
    setAssetSize(width / 2);
  };

  const onHandlePressableAnAsset = ({ item }) => {
    onHandlePressableAnAssetToP(item);
  };

  useEffect(() => {
    getAssetsInAlbum(albumData?.title);
    calculateSizeOfAssets();
  }, []);

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTextHeader}>
        Hello World! {albumData?.title}
      </Text>
      <View style={styles.viewFlatlist}>
        <FlatList
          data={assetsInAlbum?.assets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onHandlePressableAnAsset({ item });
              }}
            >
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: assetSize,
                  height: assetSize,
                  margin: 1
                }}
              />
            </Pressable>
          )}
          numColumns={2}
          onEndReached={() => {
            console.log("onEndReached");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTextHeader: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium"
  },
  anAssetStyle: {
    margin: 1
  },
  viewFlatlist: {
    flex: 1,
    // backgroundColor: "white",
    width: "95%",
    height: "95%"
  },
  modalView: {
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    // flex: 1,
    // borderWidth: 1,
    // borderColor: "yellow",
    width: "98%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  }
});
export default ViewModalAssetsInAlbum;

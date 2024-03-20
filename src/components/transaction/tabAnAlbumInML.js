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
import { BlurView } from "expo-blur";

import * as MediaLibrary from "expo-media-library";
import ViewModalAssetsInAlbum from "../medialibray/viewModalAssetsInAlbum";

const TabAnAlbumInML = ({ album, handleOnAlbumInML }) => {
  const [coverAssets, setCoverAssets] = useState(null);
  const [isModalAssetsInAlbumVisible, setIsModalAssetsInAlbumVisible] =
    useState(false);
  const [isShowingAsset, setIsShowingAsset] = useState(false);

  const getCoverAssets = async () => {
    if (album) {
      if (album.title === "Gần đây") {
        try {
          const assets = await MediaLibrary.getAssetsAsync({
            mediaType: "photo",
            first: 100
          });
          //   // sort assets by creationTime
          //   assets.assets.sort((a, b) => {
          //     return b.creationTime - a.creationTime;
          //   });
          setCoverAssets(assets);
        } catch (error) {
          console.error("Error fetching cover assets:", error);
        }
      } else {
        try {
          const assets = await MediaLibrary.getAssetsAsync({
            album: await MediaLibrary.getAlbumAsync(album?.title),
            first: 10
          });
          setCoverAssets(assets);
        } catch (error) {
          console.error("Error fetching cover assets:", error);
        }
      }
    }
  };

  const onHandlePressableAnAlbum = () => {
    return () => {
      setIsModalAssetsInAlbumVisible(!isModalAssetsInAlbumVisible);
    };
  };

  const onHandlePressableAnAssetToP = (item) => {
    // console.log("onHandlePressableAnAssetToP", item);
    setIsModalAssetsInAlbumVisible(!isModalAssetsInAlbumVisible);
    handleOnAlbumInML(item); // callback of parent TabMediaLibrary
  };

  useEffect(() => {
    getCoverAssets();
  }, []);

  return (
    <View style={styles.viewAnAlbumItem}>
      <View style={styles.viewAnAlbumHeader}>
        <Text style={styles.textTitle}>{album?.title}</Text>
        <Text style={styles.textAssetCount}>{album?.assetCount}</Text>
      </View>
      <Pressable
        style={styles.pressableAnAlbum}
        onPress={onHandlePressableAnAlbum()}
      ></Pressable>
      <FlatList
        style={styles.flatListAnAlbumItem}
        data={coverAssets?.assets}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item?.uri }} style={styles.anImageStyle} />
        )}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        horizontal={true}
      />
      {/* a modal to show all assets in an album */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalAssetsInAlbumVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModalAssetsInAlbumVisible(!isModalAssetsInAlbumVisible);
        }}
      >
        <BlurView intensity={50} tint="dark" style={styles.centeredView}>
          <ViewModalAssetsInAlbum
            props={(al = album)}
            onHandlePressableAnAssetToP={onHandlePressableAnAssetToP}
          />
          <Pressable
            style={styles.pressableCloseModal}
            onPress={() =>
              setIsModalAssetsInAlbumVisible(!isModalAssetsInAlbumVisible)
            }
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center"
    // borderWidth: 1,
    // borderColor: "green"
    // backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  pressableCloseModal: {
    width: 100,
    height: 25,
    borderRadius: 50,
    backgroundColor: "lightgray",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  pressableAnAlbum: {
    flex: 1,
    // borderColor: "darkgray",
    // borderWidth: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 99
  },
  textTitle: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium",
    textAlign: "left",
    marginVertical: 5
  },
  textAssetCount: {
    fontSize: 20,
    fontFamily: "Inconsolata_300Light",
    textAlign: "left"
  },
  viewAnAlbumHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "flex-start",
    alignItems: "flex-start",
    padding: 0,
    // backgroundColor: "#f5fcff",
    // borderColor: "darkgray",
    // borderWidth: 1,
    alignSelf: "stretch",
    marginHorizontal: 10
  },
  anImageStyle: {
    width: Dimensions.get("screen").width * 0.35,
    height: Dimensions.get("screen").width * 0.35,
    marginHorizontal: 1,
    marginVertical: 1
    // marginLeft: -10,
  },
  viewAnAlbumItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff"
  },
  flatListAnAlbumItem: {
    flex: 1,
    width: Dimensions.get("screen").width * 0.9,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 10
    // borderColor: "darkgray",
    // borderWidth: 1
    // height: 200
  }
});

export default TabAnAlbumInML;

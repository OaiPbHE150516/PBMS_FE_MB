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
  RefreshControl
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import TabAnAlbumInML from "./tabAnAlbumInML";
import { useSelector, useDispatch } from "react-redux";
import { setAssetsShowing } from "../../redux/mediaLibrarySlice";

// // fuction to get assets in a specific album by name
// const getAssets = async (albumName) => {
//   const album = await MediaLibrary.getAlbumAsync(albumName);
//   const assets = await MediaLibrary.getAssetsAsync({ album: album, first: 10 });
//   console.log("assets", assets);
// };

const TabMediaLibrary = ({}) => {
  const [hasLibraryPermission, setHasLibraryPermission] = useState(null);
  const [media, setMedia] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const assetShowing = useSelector(
    (state) => state.mediaLibrary?.assetsShowing ?? null
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAlbums();
    getNewestAssets();
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  // function to get async albums
  const getAlbums = async () => {
    const albumHasName = await MediaLibrary.getAlbumsAsync();
    setAlbums(albumHasName);
  };

  //function to get newest assets
  const getNewestAssets = async () => {
    // console.log("getNewestAssets");
    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      first: 1
    });
    const closeAlbum = {
      id: "closeAlbum",
      title: "Gần đây",
      assetCount: assets.totalCount,
      coverAssets: assets.assets,
      endTime: assets.assets[0].creationTime,
      folderName: null,
      localtionNames: [],
      startTime: assets.assets[0].creationTime,
      type: "album"
    };
    if (!albums || !albums?.find((album) => album?.id === "closeAlbum")) {
      setAlbums((prevAlbums) => [closeAlbum, ...prevAlbums]);
    }
    // const albumHasName = await MediaLibrary.getAlbumsAsync();
    // // push albumsHasName to albums
    // setAlbums((beforeAlbums) => [...beforeAlbums, albumHasName]);
  };

  const dispatch = useDispatch();

  // function to handle from child TabAnAlbumInML callback
  const handleOnAlbumInML = (data) => {
    console.log("handleDataFromChildc", data);
    dispatch(setAssetsShowing({ asset: data, isShowingAsset: "true" }));
    console.log("assetShowing", assetShowing);
  };

  useEffect(() => {
    (async () => {
      const { statusMediaLib } = await MediaLibrary.requestPermissionsAsync();
      setHasLibraryPermission(statusMediaLib === "granted");
      getAlbums();
      getNewestAssets();
    })();
  }, []);

  return refreshing ? null : (
    <View style={styles.container}>
      <FlatList
        style={styles.flatListStyle}
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TabAnAlbumInML album={item} handleOnAlbumInML={handleOnAlbumInML} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewAnAlbum: {
    flexDirection: "row",
    borderColor: "green",
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 5
  },
  container: {
    flex: 1,
    borderColor: "darkgray",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  flatListStyle: {
    flex: 1,
    borderColor: "red",
    borderWidth: 1,
    width: "100%"
  }
});

export default TabMediaLibrary;

import React, { useState, useEffect, useRef, memo } from "react";
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
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Switch,
  RefreshControl,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

const FlatListActivities = ({ collabFund }) => {
  const account = useSelector((state) => state.authen?.account);
  const [nowCollabFundActivities, setNowCollabFundActivities] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCollabFundActivities = async () => {
    try {
      const data = await collabFundServices.getCollabFundActivities({
        data: {
          collabFundID: collabFund?.collabFundID,
          accountID: account?.accountID
        }
      });
      console.log("data: ");
      setNowCollabFundActivities(data);
    } catch (error) {
      console.error("Error fetching collab fund activities:", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchCollabFundActivities();
    }
  }, [account]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCollabFundActivities();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const AnActivityItem = ({ item }) => {
    return (
      <View style={styles.viewAnActivityItem}>
        <View style={styles.viewAnPaticianAvatar}>
          <Image
            source={{
              uri: item?.account?.pictureURL
            }}
            style={{ width: 30, height: 30, borderRadius: 30 }}
          />
        </View>
        <View style={styles.viewAnActivityItemContent}>
          <Text style={styles.textActivityAccountName}>
            {item?.account?.accountName}
          </Text>
          <Text style={styles.textActivityNote}>{item?.note}</Text>
          {/* <View
            style={{
              width: "auto",
              height: item?.filename !== "" ? 300 : 0
              // borderWidth: 1,
              // borderColor: "green"
            }}
          >
            {item?.filename === "" ? null : (
              <Image
                source={{ uri: item?.filename }}
                style={{ width: "auto", height: 300 }}
                // defaultSource={require("../../../assets/images/placeholder.png")}
                // loadingIndicatorSource={require("../../../assets/images/placeholder.png")}
              />
            )}
          </View> */}
        </View>
        <View style={styles.viewAnActivityItemTimeAmount}>
          <Text style={styles.textActivityTime}>{item?.createTimeString}</Text>
          {item?.transaction ? (
            <Text style={styles.textActivityAmount}>
              {"-"}
              {item?.transaction?.totalAmountStr}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flatListActivitiesContent}
      inverted
      extraData={nowCollabFundActivities || []}
      data={nowCollabFundActivities || []}
      keyExtractor={(item) => item?.collabFundActivityID}
      renderItem={({ item }) => <AnActivityItem item={item} />}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      contentInset={{ top: 0, bottom: 200, left: 0, right: 0 }}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
};

const styles = StyleSheet.create({
  textActivityTime: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular"
  },
  textActivityAmount: {
    fontSize: 20,
    fontFamily: "OpenSans_500Medium",
    color: "firebrick",
    textAlign: "right"
  },

  textActivityAccountName: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    marginVertical: 2,
    marginHorizontal: 2
  },
  textActivityNote: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular",
    marginVertical: 2,
    marginHorizontal: 2
  },
  flatListActivitiesContent: {
    // height: Dimensions.get("window").height * 0.2,
    // height: 500,
    // height: "auto",
    width: "100%",
    // flex: 1
    // borderWidth: 1,
    // borderColor: "red"
  },
  viewAnActivityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "gray",
    borderBottomWidth: 0.25,
    borderBottomColorColor: "darkgray",
    borderRadius: 8,
    padding: 4,
    width: "100%",
    minHeight: "10%",
    height: "auto",
    marginVertical: 5
    // maxHeight: 200
  },
  viewAnPaticianAvatar: {
    width: "10%",
    // borderWidth: 1,
    // borderColor: "red",
    height: "100%"
  },
  viewAnActivityItemContent: {
    width: "60%",
    height: "100%"
    // borderWidth: 1,
    // borderColor: "blue"
  },
  viewAnActivityItemTimeAmount: {
    width: "30%",
    height: "100%",
    flexDirection: "column",
    // justifyContent: "space-between",
    alignItems: "flex-end",
    alignContent: "flex-start",
    // borderWidth: 1,
    // borderColor: "green",
    paddingHorizontal: 2
  }
});

export default FlatListActivities;

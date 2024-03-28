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
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Switch,
  RefreshControl,
  Modal,
  Platform
} from "react-native";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getCollabFundActivities } from "../../redux/collabFundSlice";

const CfActivitiesComponent = ({ route }) => {
  const { collabFund } = route.params;
  const account = useSelector((state) => state.authen?.account);

  const collabFundActivities = useSelector(
    (state) => state.collabFund?.collabFundActivities
  );

  const [nowCollabFundActivities, setNowCollabFundActivities] = useState([]);

  const dispatch = useDispatch();

  const fetchCollabFundActivities = () => {
    try {
      dispatch(
        getCollabFundActivities({
          data: {
            collabFundID: collabFund?.collabFundID,
            accountID: account?.accountID
          }
        })
      );
    } catch (error) {
      console.log("fetchCollabFundActivities error: ", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchCollabFundActivities();
      setNowCollabFundActivities(collabFundActivities);
    }
  }, [account]);

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
        </View>
        {/* view time have 15% */}
        <View style={styles.viewAnActivityItemTimeAmount}>
          <Text style={styles.textActivityTime}>{item?.createTimeString}</Text>
          {item?.transaction ? (
            <Text style={styles.textActivityAmount}>{item?.transaction?.totalAmount}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.viewContainer}>
      <View style={styles.viewActivitiesContent}>
        <FlatList
          data={nowCollabFundActivities || collabFundActivities}
          keyExtractor={(item) => item?.collabFundActivityID}
          renderItem={({ item }) => <AnActivityItem item={item} />}
        />
      </View>
      <View style={styles.viewActivitiesAction}>
        <Button title="Add Activity" onPress={() => {}} />
      </View>
    </View>
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
  textActivityNote: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular",
    marginVertical: 2,
    marginHorizontal: 2
  },
  textActivityAccountName: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    marginVertical: 2,
    marginHorizontal: 2
  },
  viewAnActivityItemTimeAmount: {
    width: "30%",
    height: "auto",
    justifyContent: "space-between",
    alignItems: "flex-end"
    // borderWidth: 1,
    // borderColor: "green"
  },
  viewAnActivityItemContent: {
    width: "60%",
    height: "100%"
    // borderWidth: 1,
    // borderColor: "blue"
  },
  viewAnPaticianAvatar: {
    width: "10%",
    // borderWidth: 1,
    // borderColor: "red",
    height: "100%"
  },
  viewActivitiesContent: {
    borderWidth: 1,
    borderColor: "gray",
    minHeight: "80%",
    height: "90%",
    maxHeight: "95%",
    borderRadius: 8,
    paddingHorizontal: 2
  },
  viewActivitiesAction: {},
  viewContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center"
  },
  viewAnActivityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 4,
    width: "100%",
    minHeight: "10%",
    height: "auto",
    marginVertical: 5
    // maxHeight: 200
  }
});
export default CfActivitiesComponent;

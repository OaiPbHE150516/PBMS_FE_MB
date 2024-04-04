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
  Platform,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

const CfPaticianComponent = ({ route }) => {
  const { collabFund } = route.params;
  const account = useSelector((state) => state.authen?.account);

  const [nowParticipants, setNowParticipants] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (account) {
      fetchCollabFundParticipants();
    }
  }, [account]);

  async function fetchCollabFundParticipants() {
    try {
      const data = {
        data: {
          collabFundID: collabFund?.collabFundID,
          accountID: account?.accountID
        }
      };
      const response = await collabFundServices.getCollabFundParticipants(data);
      setNowParticipants(response);
    } catch (error) {
      console.error("Error fetching data collab fund participants:", error);
    }
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCollabFundParticipants();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const AnParticipantItem = ({ item }) => {
    return (
      <View
        style={[
          styles.viewParticipantItem,
          styles.shadowCard,
          { borderWidth: item?.isFundholder ? 0.5 : 0 }
        ]}
      >
        <Image
          source={{
            uri:
              item?.pictureURL !== " " &&
              item?.pictureURL !== null &&
              item?.pictureURL !== undefined &&
              item?.pictureURL !== ""
                ? item?.pictureURL
                : "https://picsum.photos/200/300"
          }}
          style={styles.participantImage}
        />
        <View style={styles.viewParticipantItemInfor}>
          <Text style={styles.participantName}>{item?.accountName}</Text>
          <Text style={styles.participantEmail}>{item?.emailAddress}</Text>
        </View>
        <View style={styles.viewParticipantItemAction}>
          <Text style={styles.textParticipantLasttime}>
            {item?.lastTimeStr}
          </Text>
          <Pressable onPress={() => {}}>
            <Icon name="ellipsis" size={20} color="black" />
          </Pressable>
        </View>
      </View>
    );
  };

  const FlatListParticipants = ({ data, title }) => {
    return (
      <View style={styles.viewAFlatListParticipants}>
        <Text style={styles.textTitleOfFlatList}>{title}</Text>
        {data?.length === 0 ? (
          <Text style={styles.textNoData}>{"..."}</Text>
        ) : (
          <FlatList
            data={data || []}
            scrollEnabled={false}
            renderItem={({ item }) => <AnParticipantItem item={item} />}
            keyExtractor={(item) => item?.accountID}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <FlatListParticipants
        data={nowParticipants?.active}
        title={"Đang hoạt động"}
      />
      <FlatListParticipants
        data={nowParticipants?.pending}
        title={"Đang chờ"}
      />
      <FlatListParticipants
        data={nowParticipants?.inactive}
        title={"Không hoạt động"}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textParticipantLasttime: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular"
    // color: "gray"
  },
  viewParticipantItemAction: {
    flexDirection: "column",
    // borderWidth: 1,
    flex: 1,
    justifyContent: "space-around",
    alignContent: "flex-end",
    alignItems: "flex-end"
  },
  textNoData: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular_Italic",
    alignSelf: "center",
    color: "gray"
  },
  textTitleOfFlatList: {
    fontSize: 20,
    fontFamily: "Inconsolata_600SemiBold",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 5
  },
  viewAFlatListParticipants: {
    justifyContent: "center",
    // alignItems: "center",
    alignContent: "center"
  },
  viewParticipantItemInfor: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: 10
    // width: "100%"
  },
  viewParticipantItem: {
    flexDirection: "row",
    marginHorizontal: 2,
    marginVertical: 2,
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: "98%",
    flex: 1
    // borderWidth: 1,
    // borderColor: "red",
    // alignSelf: "center"
  },
  participantImage: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  participantEmail: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular"
  },
  participantName: {
    fontSize: 22,
    fontFamily: "Inconsolata_500Medium"
  },
  shadowCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 8,
    borderBottomWidth: 0.25,
    borderBottomColor: "darkgray"
  }
});

export default CfPaticianComponent;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Image,
  Switch
} from "react-native";
// node_modules library
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import currencyLibrary from "../../library/currencyLIbrary";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getAllCollabFund } from "../../redux/collabFundSlice";

// components
import CollabFundDetail from "./collabFundDetail";

const Stack = createStackNavigator();

const CollabFundScreen = () => {
  const account = useSelector((state) => state.authen?.account);
  const [tempCollabFundList, setTempCollabFundList] = useState([]);
  const collabFunds = useSelector((state) => state.collabFund?.collabFunds);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (account) {
      dispatch(getAllCollabFund(account.accountID));
      setTempCollabFundList(collabFunds);
    }
  }, [account]);

  function handleCollabFundItemOnPress(collabFund) {
    navigation.navigate("CollabFundDetail", {
      collabFund: collabFund,
      otherParam: "anything you want here"
    });
  }

  const AnCollabFundItem = ({ collabFund }) => {
    return (
      <ImageBackground
        source={{ uri: collabFund?.imageURL }}
        style={styles.imageBackgroundAnCollabFundItem}
        imageStyle={{ borderRadius: 10, resizeMode: "cover" }}
      >
        <Pressable
          style={styles.pressableAnCollabFundItem}
          onPress={() => {
            handleCollabFundItemOnPress(collabFund);
          }}
        >
          <BlurView
            intensity={10}
            tint="systemThinMaterialDark"
            style={styles.blurViewAnCollabFundItem}
          >
            {/* Information */}
            <View style={styles.viewCollabFundItemInfor}>
              <Text style={styles.textCollabFundItemName}>
                {collabFund?.name}
              </Text>
              <View style={styles.viewCollabFundItemPartiesName}>
                {collabFund?.accountInCollabFunds?.map(
                  (accountInCollabFund) => {
                    return (
                      <Image
                        key={accountInCollabFund?.accountID}
                        source={{ uri: accountInCollabFund?.pictureURL }}
                        style={styles.imageAccountInCollabFund}
                      />
                    );
                  }
                )}
              </View>
              <Text style={styles.textCollabFundItemNote}>
                {"Note: "}
                {collabFund?.description}
              </Text>
              <View style={styles.viewCollabFundItemStatus}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                />
                <Text style={styles.textAnCollabFundItemStatus}>
                  {"Trạng thái"}
                </Text>
              </View>
            </View>
            {/* Action */}
            <View style={styles.viewCollabFundItemAction}>
              <Text style={styles.textCollabFundItemBalance}>
                {collabFund?.totalAmountStr}
              </Text>
              <Pressable
                style={styles.pressableAnCollabFundItemDetail}
                onPress={() => {}}
              >
                <Icon name="angle-right" size={20} color="white" />
              </Pressable>
            </View>
          </BlurView>
        </Pressable>
      </ImageBackground>
    );
  };

  const CollabFundListScreen = () => {
    return (
      <View style={styles.containerCollabFundList}>
        <Text style={styles.textCollabFundListHeader}>
          {"Ngân sách hợp tác"}
        </Text>
        <FlatList
          data={tempCollabFundList || collabFunds}
          keyExtractor={(item) => item?.collabFundID}
          renderItem={({ item }) => <AnCollabFundItem collabFund={item} />}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="CollabFundList"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="CollabFundList" component={CollabFundListScreen} />
        <Stack.Screen name="CollabFundDetail" component={CollabFundDetail} />
        {/* <Stack.Screen name="ScreenA" component={ScreenA} />
        <Stack.Screen name="ScreenB" component={ScreenB} /> */}
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  textCollabFundListHeader: {
    fontSize: 30,
    fontFamily: "Inconsolata_500Medium",
    color: "black"
  },
  textAnCollabFundItemStatus: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular",
    color: "white"
  },
  pressableAnCollabFundItemDetail: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 5
  },
  imageAccountInCollabFund: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginHorizontal: 2
  },
  viewCollabFundItemStatus: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center"
  },
  textCollabFundItemNote: {
    fontSize: 17,
    fontFamily: "Inconsolata_400Regular",
    color: "white"
  },
  viewCollabFundItemPartiesName: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5
  },
  viewCollabFundItemAction: {
    width: "30%",
    justifyContent: "space-between",
    alignItems: "flex-end",
    alignContent: "flex-end"
  },
  viewCollabFundItemInfor: {
    width: "70%",
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "space-between"
  },
  textCollabFundItemBalance: {
    fontSize: 20,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "right",
    color: "white"
  },
  // viewCollabFundItemHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   alignContent: "center",
  //   width: "100%"
  // },
  textCollabFundItemName: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium",
    color: "white",
    marginTop: 5,
    marginBottom: "10%"
  },
  imageBackgroundAnCollabFundItem: {
    width: "100%",
    minHeight: 100,
    height: "auto",
    maxHeight: 170,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    borderWidth: 0.25,
    borderColor: "darkgray",
    marginVertical: 5,
    borderRadius: 10
  },
  blurViewAnCollabFundItem: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "space-between"
  },
  pressableAnCollabFundItem: {
    width: "100%",
    height: "100%"
    // alignItems: "center",
    // justifyContent: "flex-start",
    // borderRadius: 10,
    // // marginVertical: 10,
    // padding: 10
    // backgroundColor: "rgba(0,0,0,0.2)"
  },
  containerCollabFundList: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: 10
    // borderWidth: 10,
    // borderColor: "red"
  },
  container: {
    // flex: 1,
    width: "100%",
    height: "100%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "darkgray"
  }
});

export default CollabFundScreen;

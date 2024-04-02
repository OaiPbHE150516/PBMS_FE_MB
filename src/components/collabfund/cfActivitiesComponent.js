import React, { useState, useEffect, useRef, useMemo } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome6";
import * as ImagePicker from "expo-image-picker";
import FastImage from "react-native-fast-image";

// redux
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

// components
// import FlatListActivities from "./flatListActivitiesComp";
import FlatListTransactionToAddCF from "./flatlistTransactionToAddCF";

const CfActivitiesComponent = ({ route }) => {
  const { collabFund } = route.params;
  const account = useSelector((state) => state.authen?.account);
  const [keyboardHeight, setKeyboardHeight] = useState(170);

  const [image, setImage] = useState(null);
  const [
    transactionToAddCollabFundActivity,
    setTransactionToAddCollabFundActivity
  ] = useState({});

  const [isAddTransactionViewsVisible, setIsAddTransactionViewsVisible] =
    useState(false);

  const [nowCollabFundActivities, setNowCollabFundActivities] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalMediaCameraVisible, setIsModalMediaCameraVisible] =
    useState(false);

  const [isModalAddTransactionVisible, setIsModalAddTransactionVisible] =
    useState(false);

  const textInputRef = useRef(null);

  const dispatch = useDispatch();

  async function handleOnSendChat({ text }) {
    try {
      const data = new FormData();
      data.append("collabFundID", collabFund?.collabFundID);
      data.append("accountID", account?.accountID);
      data.append("note", text);
      if (image) {
        console.log("image: ", image);
        // data.append("file", image);

        const filename = image?.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        const filedata = {
          uri: image?.uri,
          name: filename,
          type: type
        };
        data.append("file", filedata);
      } else {
        data.append("file", null);
      }
      // transactionid
      if (transactionToAddCollabFundActivity) {
        data.append(
          "transactionID",
          transactionToAddCollabFundActivity?.transactionID
        );
      }
      console.log("handleOnSendChat data: ", data);
      const response = await collabFundServices
        .createActivity(data)
        .then((res) => {
          // console.log("res: ", res);
          fetchCollabFundActivities();
          setImage(null);
          textInputRef?.current?.clear();
          setTransactionToAddCollabFundActivity({});
          setIsAddTransactionViewsVisible(false);
        })
        .catch((error) => {
          Alert.alert("Lỗi", "Không thể gửi hoạt động, vui lòng thử lại!");
          console.error("Error handleOnSendChat data:", error);
        });
      // console.log("response: ", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function handleOnPickMedia() {
    console.log("Pick Media");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0]);
      setIsModalMediaCameraVisible(!isModalMediaCameraVisible);
    }
  }

  async function handleOnLaunchCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
      setIsModalMediaCameraVisible(!isModalMediaCameraVisible);
    }
  }

  async function handleAddTransaction() {
    try {
      // console.log("handleAddTransaction");
    } catch (error) {
      console.error("Error handleAddTransaction data:", error);
    }
  }

  const fetchCollabFundActivities = async () => {
    try {
      await collabFundServices
        .getCollabFundActivities({
          data: {
            collabFundID: collabFund?.collabFundID,
            accountID: account?.accountID
          }
        })
        .then((response) => {
          console.log(response);
          setNowCollabFundActivities(response);
        });
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

  function onCallbackAddTransaction({ data }) {
    console.log("data: ", data);
    setIsModalAddTransactionVisible(!isModalAddTransactionVisible);
    setTransactionToAddCollabFundActivity(data);
    setIsAddTransactionViewsVisible(true);
  }

  function onPressRemoveTransactionSelected() {
    setTransactionToAddCollabFundActivity({});
    setIsAddTransactionViewsVisible(false);
  }

  const AnActivityItem = ({ item }) => {
    return (
      <View
        style={[
          styles.viewAnActivityItem,
          { height: item?.filename === "" ? 50 : 300 }
        ]}
      >
        <View style={styles.viewAnPaticianAvatar}>
          <Image
            source={{
              uri: item?.account?.pictureURL
              // priority: FastImage.priority.normal
            }}
            // resizeMode={FastImage.resizeMode.contain}
            style={{ width: 30, height: 30, borderRadius: 30 }}
          />
        </View>
        <View style={styles.viewAnActivityItemContent}>
          <Text style={styles.textActivityAccountName}>
            {item?.account?.accountName}
          </Text>
          <Text style={styles.textActivityNote}>{item?.note}</Text>

          {item?.filename === "" ? null : (
            <Image
              source={{
                uri: item?.filename
              }}
              style={{ width: "auto", height: 250 }}
              // defaultSource={require("../../../assets/images/placeholder.png")}
              // loadingIndicatorSource={require("../../../assets/images/placeholder.png")}
            />
          )}
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

  const ATransactionSelected = ({ transaction }) => {
    return (
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          handleAddTransaction();
          setIsModalAddTransactionVisible(!isModalAddTransactionVisible);
        }}
        style={styles.view_ViewTransactionSelected}
      >
        <View style={styles.view_ViewTransactionSelected_Date}>
          <Text style={styles.text_ViewTransactionSelected_Date}>
            {transaction?.dayOfWeekStrMdl + " " + transaction?.dateShortStr}
          </Text>
          <Pressable
            onPress={() => onPressRemoveTransactionSelected()}
            style={{}}
          >
            <Icon name="xmark" size={25} color="darkgray" />
          </Pressable>
        </View>
        <View style={styles.view_ViewTransactionSelected_Infor}>
          <View style={styles.view_ATransactionInDay_Time}>
            <Text style={styles.text_ATransactionInDay_Time}>
              {transaction?.timeStr}
            </Text>
          </View>
          <View style={styles.view_ATransactionInDay_Cate}>
            <Text style={styles.text_ATransactionInDay_Normal}>
              {transaction?.category?.nameVN}
            </Text>
          </View>
          <View style={styles.view_ATransactionInDay_Note}>
            <Text style={styles.text_ATransactionInDay_Note}>
              {transaction?.note}
            </Text>
          </View>
          <View style={styles.view_ATransactionInDay_TotalAmount}>
            <Text style={styles.text_ATransactionInDay_TotalAmount}>
              {transaction?.totalAmountStr}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.viewContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? keyboardHeight : 0}
    >
      <View style={styles.viewActivitiesContent}>
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
        />
      </View>
      <View style={styles.viewActivitiesAction}>
        {!isAddTransactionViewsVisible ? null : (
          <ATransactionSelected
            transaction={transactionToAddCollabFundActivity}
          />
        )}
        {/* <View style={{ width: "100%" }}> */}
        <View style={styles.viewActionUserInfor}>
          <Image
            source={{
              uri: account?.pictureURL
            }}
            style={{ width: 40, height: 40, borderRadius: 40 }}
          />
        </View>
        <View style={styles.viewActionUserChat}>
          <TextInput
            ref={textInputRef}
            key={account?.accountID}
            style={styles.textInputActionUserChat}
            placeholder="Nhập nội dung..."
            placeholderTextColor={"darkgray"}
            returnKeyType="send"
            returnKeyLabel="send"
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={(event) => {
              handleOnSendChat({ text: event.nativeEvent.text });
              console.log("event.nativeEvent.text: ", event.nativeEvent);
            }}
            multiline={true}
            blurOnSubmit={true}
            numberOfLines={2}
            // couldn't use value and onChangeText because of the bug of TextInput, Image in FlatList will be re-rendered
            // value={setNewActivity?.note}
            // onChangeText={
            //   (text) => setNewActivity({ ...newActivity, note: text })
            // }
            // onChangeText={(text) => console.log("text: ", text)}
          />
        </View>
        <View style={styles.viewActionUserActionable}>
          {!image ? null : (
            <View
              style={{
                width: "auto",
                height: "auto",
                borderWidth: 1,
                borderColor: "red",
                position: "absolute",
                alignSelf: "auto",
                top: -(Dimensions.get("window").height * 0.3 + 25),
                left: -Dimensions.get("window").width * 0.1
              }}
            >
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: Dimensions.get("window").width * 0.35,
                  height: Dimensions.get("window").height * 0.3,
                  resizeMode: "cover"
                }}
              />
              <Pressable
                style={styles.pressableRemoveImage}
                onPress={() => setImage(null)}
              >
                <Icon
                  name="xmark"
                  size={25}
                  color="white"
                  style={{ alignSelf: "center" }}
                />
              </Pressable>
            </View>
          )}
          <Pressable
            style={styles.pressableActionUserActionable}
            onPressIn={() => {
              Keyboard.dismiss();
              handleAddTransaction();
              setIsModalAddTransactionVisible(!isModalAddTransactionVisible);
            }}
          >
            <Icon name="money-bill-transfer" size={25} color="darkgray" />
          </Pressable>
          <Pressable
            style={styles.pressableActionUserActionable}
            onPressIn={() => {
              setIsModalMediaCameraVisible(!isModalMediaCameraVisible);
            }}
          >
            <Icon name="file-image" size={25} color="darkgray" />
          </Pressable>
        </View>
        <Modal
          visible={isModalMediaCameraVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.viewModalBackground}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() =>
                setIsModalMediaCameraVisible(!isModalMediaCameraVisible)
              }
            ></Pressable>
            <View style={styles.viewModalMediaCamera}>
              <Pressable
                style={styles.pressableActionUserActionable}
                onPressIn={() => {
                  handleOnPickMedia();
                  // setIsModalMediaCameraVisible(!isModalMediaCameraVisible);
                }}
              >
                <Icon name="images" size={35} color="darkgray" />
                <Text style={styles.textLabelActionable}>{"Thư viện"}</Text>
              </Pressable>
              <Pressable
                style={styles.pressableActionUserActionable}
                onPressIn={() => {
                  handleOnLaunchCamera();
                  // setIsModalMediaCameraVisible(!isModalMediaCameraVisible);
                }}
              >
                <Icon name="camera" size={35} color="darkgray" />
                <Text style={styles.textLabelActionable}>{"Máy ảnh"}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          visible={isModalAddTransactionVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.viewModalBackground}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() =>
                setIsModalAddTransactionVisible(!isModalAddTransactionVisible)
              }
            />
            <View style={styles.viewModalAddTransaction}>
              <Text>{"Thêm giao dịch vào ngân sách hợp tác"}</Text>
              <FlatListTransactionToAddCF callback={onCallbackAddTransaction} />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  text_ViewTransactionSelected_Date: {
    fontFamily: "Inconsolata_400Regular",
    fontSize: 20
  },
  view_ATransactionInDay_Time: {
    flex: 1
  },
  text_ATransactionInDay_Time: {
    fontFamily: "Inconsolata_500Medium",
    fontSize: 20
  },
  view_ATransactionInDay_Cate: {
    flex: 2
  },
  text_ATransactionInDay_Normal: {
    fontFamily: "Inconsolata_400Regular",
    fontSize: 18
  },
  view_ATransactionInDay_Note: {
    flex: 2
  },
  text_ATransactionInDay_Note: {
    fontFamily: "Inconsolata_400Regular",
    fontSize: 18
  },
  view_ATransactionInDay_TotalAmount: {
    flex: 2
  },
  text_ATransactionInDay_TotalAmount: {
    textAlign: "right",
    fontFamily: "OpenSans_500Medium",
    fontSize: 20
  },
  view_ViewTransactionSelected_Infor: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center"
  },
  view_ViewTransactionSelected_Date: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 10
  },
  view_ViewTransactionSelected: {
    width: "100%",
    height: "auto",
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "white",
    bottom: 50,
    zIndex: 10,
    flexDirection: "column",
    padding: 5
  },
  viewModalAddTransaction: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    padding: 5,
    minHeight: "85%",
    height: "auto",
    maxHeight: "95%",
    // marginBottom: 20,
    borderRadius: 10
  },
  viewModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  viewModalMediaCamera: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    padding: 5,
    // marginBottom: 20,
    borderRadius: 10
  },
  textLabelActionable: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular",
    marginVertical: 10,
    alignSelf: "flex-end"
  },
  // flatListActivitiesContent
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
    height: "100%",
    width: "100%",
    flex: 1
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
    // minHeight: "10%",
    // height: "auto",
    // height: 50,
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
  },
  pressableRemoveImage: {
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  pressableActionUserActionable: {
    padding: 5,
    // marginHorizontal: 2,
    borderRadius: 5,
    // backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center"
    // width: 35,
    // height: 35
  },
  viewActionUserActionable: {
    width: "auto",
    flex: 1,
    height: "100%",
    // borderWidth: 1,
    // borderColor: "green",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center"
  },
  viewActivitiesContent: {
    // borderWidth: 10,
    // borderColor: "green",
    minHeight: "80%",
    height: "92%",
    maxHeight: "95%",
    borderRadius: 8,
    paddingHorizontal: 2,
    justifyContent: "flex-end",
    overflowY: "auto"
    // height: 600,
    // flex: 1
  },
  viewActivitiesAction: {
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "red",
    borderRadius: 8,
    marginTop: 5,
    padding: 2,
    width: "100%",
    height: 50,
    justifyContent: "space-between"
    // flex: 1
  },
  textInputActionUserChat: {
    width: "100%",
    height: "100%",
    padding: 5,
    fontSize: 18,
    fontFamily: "Inconsolata_400Regular"
  },
  viewActionUserChat: {
    width: "65%",
    height: "90%",
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 10,
    marginHorizontal: 2
  },
  textUserInforName: {
    fontSize: 15,
    fontFamily: "Inconsolata_500Medium",
    flexWrap: "wrap"
  },
  viewActionUserInfor: {
    width: "auto",
    height: "100%",
    // borderWidth: 1,
    // borderColor: "blue",
    flexDirection: "row",
    marginHorizontal: 2
  },

  viewContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    paddingVertical: 5
  }
});
export default CfActivitiesComponent;

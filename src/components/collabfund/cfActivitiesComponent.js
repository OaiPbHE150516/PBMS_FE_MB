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
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/FontAwesome6";
import * as ImagePicker from "expo-image-picker";

// redux
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

// components
import FlatListActivities from "./flatListActivitiesComp";

const CfActivitiesComponent = ({ route }) => {
  const { collabFund } = route.params;
  const account = useSelector((state) => state.authen?.account);
  const [keyboardHeight, setKeyboardHeight] = useState(170);
  const [newActivity, setNewActivity] = useState({
    collabFundID: collabFund?.collabFundID,
    accountID: account?.accountID,
    note: "",
    file: null
  });
  const [image, setImage] = useState(null);

  const [newActivityNote, setNewActivityNote] = useState("");

  const dispatch = useDispatch();

  function handleOnSendChat({ text }) {
    // setNewActivity({ ...newActivity, note: text });
    console.log("text: ", text);
  }

  async function handleOnPickMedia() {
    console.log("Pick Media");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function handleOnLaunchCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.viewContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? keyboardHeight : 0}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 170 : 0}
    >
      <View style={styles.viewActivitiesContent}>
        <FlatListActivities collabFund={collabFund} />
      </View>
      <View style={styles.viewActivitiesAction}>
        {/* <Button title="Add Activity" onPress={() => {}} /> */}
        <View style={styles.viewActionUserInfor}>
          <Image
            source={{
              uri: account?.pictureURL
            }}
            style={{ width: 40, height: 40, borderRadius: 40 }}
          />
          {/* <Text style={styles.textUserInforName}>{account?.accountName}</Text> */}
        </View>
        <View style={styles.viewActionUserChat}>
          <TextInput
            key={account?.accountID}
            style={styles.textInputActionUserChat}
            placeholder="Nhập nội dung..."
            placeholderTextColor={"darkgray"}
            returnKeyType="send"
            returnKeyLabel="send"
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={(event) => {
              handleOnSendChat({ text: event.nativeEvent.text });
              // handleOnSendChat();
            }}
            multiline={true}
            blurOnSubmit={true}
            numberOfLines={2}
            // couldn't use value and onChangeText because of the bug of TextInput, Image in FlatList will be re-rendered
            // value={setNewActivity?.note}
            // onChangeText={
            //   (text) => setNewActivity({ ...newActivity, note: text })
            // }
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
                source={{ uri: image }}
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
              handleOnSendChat();
            }}
          >
            <Icon name="paper-plane" size={25} color="darkgray" />
          </Pressable>
          <Pressable
            style={styles.pressableActionUserActionable}
            onPressIn={() => {
              handleOnPickMedia();
            }}
          >
            <Icon name="file-image" size={25} color="darkgray" />
          </Pressable>
          <Pressable
            style={styles.pressableActionUserActionable}
            onPressIn={() => {
              handleOnLaunchCamera();
            }}
          >
            <Icon name="camera" size={25} color="darkgray" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  pressableRemoveImage: {
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  pressableActionUserActionable: {
    padding: 5,
    // marginHorizontal: 2,
    borderRadius: 5,
    // backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: 35,
    height: 35
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
    // flex: 1
  },
  viewActivitiesAction: {
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "darkgray",
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
    width: "60%",
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

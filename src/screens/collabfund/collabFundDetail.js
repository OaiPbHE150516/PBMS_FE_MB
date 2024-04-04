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
  Animated,
  Image
} from "react-native";
// node_modules library
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import currencyLibrary from "../../library/currencyLIbrary";

// redux
import { useSelector, useDispatch } from "react-redux";

// components
import CfActivitiesComponent from "../../components/collabfund/cfActivitiesComponent";
import CfHistoryComponent from "../../components/collabfund/cfHistoryComponent";
import CfPaticianComponent from "../../components/collabfund/cfParticianComponent";
import DevideMoneyInfor from "../../components/collabfund/devideMoneyInfor";

const TabCollabFund = createMaterialTopTabNavigator();

const CollabFundDetail = ({ route, navigation }) => {
  const { collabFund, otherParam } = route.params;
  const tabWidth = Dimensions.get("window").width * 0.98;

  const [modalVisible, setModalVisible] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const modalHeight = screenHeight * 0.2;

  // const translateY = new Animated.Value(-modalHeight);

  // useEffect(() => {
  //   if (modalVisible) {
  //     Animated.timing(translateY, {
  //       toValue: 0,
  //       duration: 100,
  //       useNativeDriver: true
  //     }).start();
  //   } else {
  //     Animated.timing(translateY, {
  //       toValue: -modalHeight,
  //       duration: 100,
  //       useNativeDriver: true
  //     }).start();
  //   }
  // }, [modalVisible]);

  async function handleModalVisible() {
    setModalVisible(!modalVisible);
  }

  // const ViewMoreDetail = () => {
  //   return (
  //     <View style={styles.viewModalMoreDetail}>
  //       <View style={styles.viewModalMoreDetailDivideMoneyContent}>
  //         <Text>{"Thông tin chi tiết"}</Text>
  //       </View>
  //       <View style={styles.viewModalMoreDetailAction}>
  //         <Pressable onPress={() => {}}>
  //           <Text>{"Chia tiền"}</Text>
  //         </Pressable>
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.view_Modal_DivideMoney}>
          <Pressable
            style={{ height: "30%"}}
            onPressOut={() => setModalVisible(!modalVisible)}
          >
          </Pressable>
          <View style={styles.view_Modal_DivideMoney_Content}>
            <DevideMoneyInfor collabFund={collabFund} />
          </View>
        </View>
      </Modal>
      <View style={styles.viewHeaderDetail}>
        <Pressable
          style={styles.pressableBackToList}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={20} color="blue" />
        </Pressable>
        <Text style={styles.textCollabFundName}>{collabFund?.name}</Text>
        <Pressable
          style={styles.pressableMoreCFAction}
          onPress={() => handleModalVisible()}
        >
          <Icon name="bars" size={20} color="black" />
        </Pressable>
        {/* <Text>otherParam: {JSON.stringify(otherParam)}</Text> */}
      </View>

      <TabCollabFund.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: {
            alignSelf: "flex-end",
            flexDirection: "row",
            width: tabWidth
          },
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            alignContent: "center",
            flexDirection: "row",
            width: tabWidth / 3
          },
          tabBarLabelStyle: {
            fontSize: 18,
            fontFamily: "Inconsolata_500Medium",
            color: "darkgray",
            textTransform: "none",
            letterSpacing: 0,
            width: tabWidth / 3
          },
          tabBarIndicatorStyle: {
            backgroundColor: "tomato"
          },
          swipeEnabled: true
        }}
      >
        <TabCollabFund.Screen
          name="Hoạt động"
          component={CfActivitiesComponent}
          initialParams={{ collabFund: collabFund }}
        />
        <TabCollabFund.Screen
          name="Thành viên"
          component={CfPaticianComponent}
          initialParams={{ collabFund: collabFund }}
        />
        <TabCollabFund.Screen
          name="Lịch sử"
          component={CfHistoryComponent}
          initialParams={{ collabFund: collabFund }}
        />
      </TabCollabFund.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  view_Modal_DivideMoney: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
    // alignContent: "flex-end",
    // borderWidth: 10,
    // borderColor: "red"
  },
  view_Modal_DivideMoney_Content: {
    // flex: 2,
    // position: "absolute",
    width: "100%",
    bottom: 0,
    // height: "auto",
    // flex: 1,
    height: "80%",
    // alignSelf: "flex-end",
    // alignContent: "flex-end",
    // alignItems: "flex-end"
  },
  viewModalMoreDetailDivideMoneyContent: {
    borderWidth: 0.5,
    borderColor: "darkgray",
    flex: 5
  },
  viewModalMoreDetailAction: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "lightblue",
    flex: 1
  },
  viewModalMoreDetail: {
    backgroundColor: "white",
    width: "100%",
    zIndex: 10,
    flex: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "darkgray"
  },
  textCollabFundName: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium",
    color: "black"
  },
  pressableBackToList: {
    position: "absolute",
    left: 10,
    zIndex: 1,
    width: "40%"
    // borderWidth: 1,
  },
  pressableMoreCFAction: {
    position: "absolute",
    right: 10,
    zIndex: 1,
    width: "40%",
    alignItems: "flex-end"
    // borderWidth: 1,
  },
  viewHeaderDetail: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // alignSelf: "flex-start",
    width: "100%",
    padding: 10,
    backgroundColor: "lightblue"
    // borderWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
    // borderWidth: 1,
    // borderColor: "red"
  }
});

export default CollabFundDetail;

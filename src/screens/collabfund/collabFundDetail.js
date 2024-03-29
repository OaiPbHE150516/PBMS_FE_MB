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

const TabCollabFund = createMaterialTopTabNavigator();

const CollabFundDetail = ({ route, navigation }) => {
  const { collabFund, otherParam } = route.params;
  const tabWidth = Dimensions.get("window").width * 0.98;

  return (
    <View style={styles.container}>
      <View style={styles.viewHeaderDetail}>
        <Pressable
          style={styles.pressableBackToList}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={20} color="blue" />
        </Pressable>
        <Text style={styles.textCollabFundName}>{collabFund?.name}</Text>
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
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    // borderWidth: 1,
    // borderColor: "red"
  }
});

export default CollabFundDetail;

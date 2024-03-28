import React, { useState, useEffect, useRef } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { SimpleGrid } from "react-native-super-grid";

// components
import AccountManagerComponent from "../components/myaccount/accountManagerComponent";
import CategoryManagerScreen from "./categories/categoryManagerScreen";
import WalletsManagerScreen from "./wallets/walletsManagerScreen";
import ReportScreen from "./reports/reportScreen";
import SettingsGeneralScreen from "./settings/settingsGeneralScreen";
import SettingsDataScreen from "./settings/settingsDataScreen";
// PrivacyPolicyScreen, TermsOfUseScreen, HelpScreen, SuggestToDeveScreen
import PrivacyPolicyScreen from "./others/privacyPolicyScreen";
import TermsOfUseScreen from "./others/termsOfUseScreen";
import HelpScreen from "./others/helpScreen";
import SuggestToDeveScreen from "./suggest/suggestToDeveScreen";

// redux
import { getCategories } from "../redux/categorySlice";

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate("Settings")}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const AccountManagerPressable = ({ navigation }) => {
  const account = useSelector((state) => state.authen?.account);
  return (
    <Pressable
      style={styles.pressableAccountManager}
      onPress={() => navigation.navigate("AccountManagerComponent")}
    >
      <View style={styles.accountInfor}>
        <Image
          source={{ uri: account?.pictureURL }}
          style={styles.imageAvatar}
        />
        <Text style={styles.textAccountManager}>{account?.accountName}</Text>
        <Text
          style={{
            fontSize: 17,
            fontFamily: "OpenSans_300Light_Italic",
            color: "gray"
          }}
        >
          {account?.emailAddress}
        </Text>
      </View>
      <View style={styles.viewHorizontalAccountManager}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Icon name="user" size={25} color="black" style={styles.sigleIcon} />
          <Text style={styles.textAccountManager}>{"Quản lý tài khoản"}</Text>
        </View>
        <Icon
          name="chevron-right"
          size={15}
          color="darkgray"
          style={styles.sigleIcon}
        />
      </View>
    </Pressable>
  );
};

const AnItemInGrid = ({ item, navigation }) => {
  function handleItemOnPress(item) {
    // console.log("item: ", item);
    navigation.navigate(item.screen);
  }

  return (
    <Pressable
      style={styles.AnItemInGrid}
      onPress={() => handleItemOnPress(item)}
    >
      <View
        style={[styles.viewAnIconOfItemGrid, { backgroundColor: item.color }]}
      >
        <Icon
          name={item.icon}
          size={30}
          color="white"
          style={{
            borderRadius: 50,
            padding: 5
          }}
          borderRadius={50}
        />
      </View>
      <Text style={styles.textAnItemNameInGrid}>{item.name}</Text>
    </Pressable>
  );
};

const dataGridFeature = [
  {
    id: 1,
    name: "Hạng mục",
    icon: "list",
    color: "mediumvioletred",
    screen: "CategoryManagerScreen"
  },
  {
    id: 2,
    name: "Ví tiền",
    icon: "wallet",
    color: "lightgreen",
    screen: "WalletsManagerScreen"
  },
  {
    id: 3,
    name: "Báo cáo",
    icon: "chart-simple",
    color: "lightskyblue",
    screen: "ReportScreen"
  },
  {
    id: 4,
    name: "Nhắc nhở",
    icon: "note-sticky",
    color: "goldenrod",
    screen: "NotificationsScreen"
  },
  {
    id: 5,
    name: "Dự kiến",
    icon: "business-time",
    color: "mediumslateblue",
    screen: "SettingsScreen"
  },
  {
    id: 6,
    name: "Mua sắm",
    icon: "cart-shopping",
    color: "lightcoral",
    screen: "ShoppingScreen"
  }
];

const SimpleGridFeature = ({ navigation }) => {
  return (
    <View style={styles.simpleGridFeature}>
      <Text style={styles.textHeaderGrid}>{"Tính năng"}</Text>
      <SimpleGrid
        itemDimension={Dimensions.get("window").width / 5}
        data={dataGridFeature}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnItemInGrid item={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

const dataListOtherSettings = [
  {
    id: 1,
    name: "Cài đặt chung",
    icon: "gear",
    color: "lightgray",
    screen: "SettingsGeneralScreen"
  },
  {
    id: 2,
    name: "Cài đặt dữ liệu",
    icon: "database",
    color: "lightgray",
    screen: "SettingsDataScreen"
  },
  {
    id: 3,
    name: "Giới thiệu bạn bè",
    icon: "share",
    color: "lightgray",
    screen: "ShareWithFriendsScreen"
  },
  {
    id: 4,
    name: "Đánh giá ứng dụng",
    icon: "star",
    color: "lightgray",
    screen: "RateAppScreen"
  },
  {
    id: 5,
    name: "Góp ý với nhà phát triển",
    icon: "comment",
    color: "lightgray",
    screen: "SuggestToDeveScreen"
  },
  {
    id: 6,
    name: "Chính sách bảo mật",
    icon: "user-shield",
    color: "lightgray",
    screen: "PrivacyPolicyScreen"
  },
  {
    id: 7,
    name: "Điều khoản sử dụng",
    icon: "file-alt",
    color: "lightgray",
    screen: "TermsOfUseScreen"
  },
  {
    id: 8,
    name: "Trợ giúp",
    icon: "info",
    color: "lightgray",
    screen: "HelpScreen"
  }
];

const AnItemInList = ({ item, navigation }) => {
  function handleItemOnPress(item) {
    // console.log("item: ", item);
    navigation.navigate(item.screen);
  }

  return (
    <Pressable
      style={styles.AnItemInList}
      onPress={() => handleItemOnPress(item)}
    >
      <View
        style={[styles.viewAnIconOfItemList, { backgroundColor: item.color }]}
      >
        <Icon
          name={item.icon}
          size={22}
          color="white"
          style={{
            borderRadius: 50,
            padding: 5
          }}
        />
      </View>
      <Text style={styles.textAnItemNameInList}>{item.name}</Text>
    </Pressable>
  );
};

const ListSettings = ({ navigation }) => {
  return (
    <View style={styles.viewFlatListOtherSetting}>
      <Text style={styles.textHeaderGrid}>{"Cài đặt khác"}</Text>
      <FlatList
        scrollEnabled={false}
        data={dataListOtherSettings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnItemInList item={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const MyAccount = () => {
  const account = useSelector((state) => state.authen?.account);
  const categories = useSelector((state) => state.category?.categories);
  // console.log("account: ", account);
  const dispatch = useDispatch();

  useEffect(() => {
    if (account !== null) {
      if (categories === null) {
        console.log("dispatch getCategories");
        dispatch(getCategories(account?.accountID));
      }
    }
  }, [account, categories]);


  function MainScreen({ navigation }) {
    return (
      <ScrollView
        overScrollMode={"never"}
        disableIntervalMomentum={true}
        style={styles.viewMainScreen}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
      >
        <AccountManagerPressable navigation={navigation} />
        <SimpleGridFeature navigation={navigation} />
        {/* <View style={styles.viewFlatListOtherSetting}>
          <Text style={styles.textHeaderGrid}>{"Cài đặt khác"}</Text>
          <FlatList
            scrollEnabled={false}
            data={dataListOtherSettings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AnItemInList item={item} />}
          />
        </View> */}
        <ListSettings navigation={navigation} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.viewStyle}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen
          name="AccountManagerComponent"
          component={AccountManagerComponent}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />

        {/* Simple Grid Feature */}
        <Stack.Screen
          name="CategoryManagerScreen"
          component={CategoryManagerScreen}
        />
        <Stack.Screen
          name="WalletsManagerScreen"
          component={WalletsManagerScreen}
        />
        <Stack.Screen name="ReportScreen" component={ReportScreen} />

        {/* Others Settings */}
        <Stack.Screen
          name="SettingsGeneralScreen"
          component={SettingsGeneralScreen}
        />
        <Stack.Screen
          name="SettingsDataScreen"
          component={SettingsDataScreen}
        />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <Stack.Screen name="TermsOfUseScreen" component={TermsOfUseScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  textAnItemNameInList: {
    fontSize: 22,
    fontFamily: "Inconsolata_400Regular"
  },
  viewAnIconOfItemList: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "auto",
    height: "auto",
    borderRadius: 15,
    // marginVertical: 5,
    // padding: 3,
    width: 50,
    marginHorizontal: 10
  },
  AnItemInList: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    width: "auto",
    height: "auto",
    padding: 5,
    marginVertical: 5,
    borderBottomColor: "darkgray",
    borderBottomWidth: 0.25
  },
  viewFlatListOtherSetting: {
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    shadowColor: "darkgray",
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginVertical: 10
  },
  textHeaderGrid: {
    fontSize: 25,
    fontFamily: "Inconsolata_600SemiBold",
    color: "black",
    marginHorizontal: 10,
    marginVertical: 2
    // borderWidth: 0.25,
    // borderColor: "darkgray",
  },
  textAnItemNameInGrid: {
    fontSize: 18,
    fontFamily: "Inconsolata_400Regular"
    // color: "black"
  },
  viewAnIconOfItemGrid: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "auto",
    height: "auto",
    borderRadius: 10,
    marginVertical: 5,
    padding: 3
  },
  AnItemInGrid: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "auto",
    height: "auto"
  },
  simpleGridFeature: {
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    shadowColor: "darkgray",
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  },
  accountInfor: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginVertical: 30
  },
  imageAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginHorizontal: 10,
    marginVertical: 5
  },
  sigleIcon: {
    marginHorizontal: 8
  },
  viewHorizontalAccountManager: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "darkgray",
    height: 40,
    alignContent: "center",
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "darkgray",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.5,
    elevation: 5
  },
  textAccountManager: {
    fontSize: 24,
    fontFamily: "Inconsolata_400Regular",
    marginHorizontal: 10
  },
  pressableAccountManager: {
    // borderWidth: 1,
    // borderColor: "black",
    backgroundColor: "white",
    // width: "100%",
    flex: 1,
    marginVertical: 10,
    padding: 5,
    borderWidth: 0.25,
    borderColor: "darkgray",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // borderRadius: 15,
    shadowColor: "darkgray",
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  },
  viewMainScreen: {
    flex: 1
    // height: "50%",
    // justifyContent: "flex-start",
    // alignItems: "center"
    // borderWidth: 1,
    // borderColor: "black"
  },
  viewStyle: {
    // flex: 1,
    width: "100%",
    height: "90%"
    // borderWidth: 1,
    // borderColor: "black"
  }
});

export default MyAccount;

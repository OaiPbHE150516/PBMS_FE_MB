import React, { useState, useEffect, useRef, Component } from "react";
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
  PanResponder
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getCategories } from "../../redux/categorySlice";

import TabCategoryInModalComponent from "./tabCategoryInModalComponent";

const TabCategory = createMaterialTopTabNavigator();

const ModalCategoryComponent = () => {
  const categories = useSelector((state) => state.category.categories);
  const account = useSelector((state) => state.authen.account);
  const dispatch = useDispatch();
  useEffect(() => {
    if (account !== null) {
      if (categories === null) dispatch(getCategories(account?.accountID));
    }
  }, [account]);

  const Tab1 = () => {
    return categories !== null ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TabCategoryInModalComponent props={{ category: categories[0] }} />
      </View>
    ) : null;
  };
  const Tab2 = () => {
    return categories !== null ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TabCategoryInModalComponent props={{ category: categories[1] }} />
      </View>
    ) : null;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.modalView}>
        <Text style={styles.modalTextHeader}>Chọn hạng mục</Text>
        <TabCategory.Navigator
          style={{ margin: 10, flex: 1 }}
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarStyle: {
              alignSelf: "flex-end",
              flexDirection: "row",
              // flex: 1,
              width: Dimensions.get("window").width * 0.95
              // backgroundColor: "tomato"
            },
            tabBarItemStyle: {
              // width: "100%",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              alignContent: "center",
              flexDirection: "row"
            },
            tabBarLabelStyle: {
              fontSize: 18,
              fontFamily: "Inconsolata_500Medium",
              color: "darkgray",
              textTransform: "none",
              letterSpacing: 0
            },
            tabBarIndicatorStyle: {
              backgroundColor: "tomato"
            },
            swipeEnabled: true
          }}
        >
          <TabCategory.Screen name="Khoản thu" component={Tab1} />
          <TabCategory.Screen name="Khoản chi" component={Tab2} />
        </TabCategory.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTextHeader: {
    fontSize: 30,
    // fontWeight: "bold",
    fontFamily: "Inconsolata_500Medium",
    marginTop: 10
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "80%",
    width: "100%",
    bottom: -20
  }
});

export default ModalCategoryComponent;

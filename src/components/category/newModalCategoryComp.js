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
  Image,
  KeyboardAvoidingView
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// redux library
import { useSelector, useDispatch } from "react-redux";

// services
import categoryServices from "../../services/categoryServices";

// components
import NewTabCategoryComponent from "../../components/category/newTabCategoryComp";

const TabCategory = createMaterialTopTabNavigator();

const NewModalCategoryComponent = ({ selected, callback }) => {
  const account = useSelector((state) => state.authen.account);
  const [categories, setCategories] = useState([]);

  function fetchCategoriesData() {
    categoryServices
      .getCategories(account?.accountID)
      .then((response) => {
        setCategories(response);
        console.log("categories: ", response);
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
        Alert.alert("Lỗi khi lấy dữ liệu hạng mục: ", error);
      });
  }

  useEffect(() => {
    fetchCategoriesData();
  }, [account]);

  function handleCallbackACategory(data) {
    // console.log("handleCallbackACategory data: ", data);
    callback(data);
  }

  const TabIncome = () => {
    return (
      categories && (
        <View style={styles.view_ATabCategory}>
          <NewTabCategoryComponent
            props={{ category: categories[0] }}
            callback={handleCallbackACategory}
            selected={selected}
          />
        </View>
      )
    );
  };

  const TabExpense = () => {
    return (
      categories && (
        <View style={styles.view_ATabCategory}>
          <NewTabCategoryComponent
            props={{ category: categories[1] }}
            callback={handleCallbackACategory}
            selected={selected}
          />
        </View>
      )
    );
  };

  // return hello world
  return (
    <View style={styles.container}>
      {/* <Pressable
        onPress={() => {
          callback("data");
        }}
      >
        <Text>Close</Text>
      </Pressable> */}
      <View style={styles.view_Header}>
        <View style={styles.view_Header_Text}>
          <Text style={styles.modalTextHeader}>{"Chọn hạng mục"}</Text>
        </View>
        <Pressable
          onPress={() => {
            fetchCategoriesData();
          }}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1
            },
            styles.pressable_Reload
          ]}
        >
          <Icon name="arrow-rotate-right" size={25} color="#2d3436" />
        </Pressable>
      </View>
      <TabCategory.Navigator screenOptions={screenOptions}>
        <TabCategory.Screen name="Khoản Chi" component={TabExpense} />
        <TabCategory.Screen name="Khoản Thu" component={TabIncome} />
      </TabCategory.Navigator>
      {/* <View style={{
        height: 50,

      }}>

      </View> */}
    </View>
  );
};

const screenOptions = {
  tabBarScrollEnabled: true,
  tabBarStyle: {
    alignSelf: "flex-end",
    flexDirection: "row",
    // width: "100%",
    // flex: 1,
    width: Dimensions.get("window").width * 0.98,
    backgroundColor: "white"
    // backgroundColor: "tomato"
  },
  tabBarItemStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "row"
  },
  tabBarLabelStyle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inconsolata_500Medium",
    color: "#636e72",
    textTransform: "none",
    letterSpacing: 0.5
  },
  tabBarIndicatorStyle: {
    backgroundColor: "tomato"
  },
  swipeEnabled: true
};

const styles = StyleSheet.create({
  pressable_Reload: {
    // borderWidth: 1,
    marginHorizontal: 15,
    padding: 5,
    borderRadius: 5,
    right: 0,
    position: "absolute"
  },
  view_Header_Text: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // borderWidth: 1,
    position: "absolute"
  },
  view_Header: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    padding: 10
    // borderWidth: 1
  },
  modalTextHeader: {
    fontSize: 30,
    // fontWeight: "bold",
    fontFamily: "OpenSans_500Medium",
    marginTop: 10
  },
  view_ATabCategory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    // borderWidth: 1,
    // borderColor: "red",
    padding: 2
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingBottom: 20
  }
});

export default NewModalCategoryComponent;

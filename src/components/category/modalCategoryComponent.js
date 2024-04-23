import React, { useState, useEffect, useRef, Component } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getCategories } from "../../redux/categorySlice";
import categoryServices from "../../services/categoryServices";
import TabCategoryInModalComponent from "./tabCategoryInModalComponent";

const TabCategory = createMaterialTopTabNavigator();

const ModalCategoryComponent = ({ onDataFromChild, selectedCategory }) => {
  // const categories = useSelector((state) => state.category.categories);
  const account = useSelector((state) => state.authen.account);
  const dispatch = useDispatch();

  const [nowCategories, setNowCategories] = useState([]);

  async function fetchCategoryData() {
    try {
      await categoryServices
        .getCategories(account?.accountID)
        .then((response) => {
          setNowCategories(response);
        })
        .catch((error) => {
          console.log("Error fetching category data:", error);
          Alert.alert("Lỗi khi lấy dữ liệu hạng mục: ", error);
        });
    } catch (error) {
      console.log("Error fetching category data:", error);
      Alert.alert("Lỗi khi lấy dữ liệu hạng mục: ", error);
    }
  }

  useEffect(() => {
    if (account !== null) {
      fetchCategoryData();
    }
  }, [account]);

  function onCallback(data) {
    onDataFromChild({
      isCategoryVisible: false,
      category: data
    });
  }

  const Tab1 = () => {
    return nowCategories !== null ? (
      <View style={styles.view_ATabCategory}>
        <TabCategoryInModalComponent
          props={{ category: nowCategories[0] }}
          callback={onCallback}
        />
      </View>
    ) : null;
  };
  const Tab2 = () => {
    return nowCategories !== null ? (
      <View style={styles.view_ATabCategory}>
        <TabCategoryInModalComponent
          props={{ category: nowCategories[1] }}
          callback={onCallback}
        />
      </View>
    ) : null;
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTextHeader}>Chọn hạng mục</Text>
      <TabCategory.Navigator
        // style={{ margin: 10, flex: 1 }}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: {
            alignSelf: "flex-end",
            flexDirection: "row",
            // width: "100%",
            // flex: 1,
            width: Dimensions.get("window").width * 0.9
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
        <TabCategory.Screen name="Khoản chi" component={Tab2} />
        <TabCategory.Screen name="Khoản thu" component={Tab1} />
      </TabCategory.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  view_ATabCategory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "red",
    padding: 10
  },
  viewActionModal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 5
  },
  buttonActionModal: {
    // backgroundColor: "lightblue",
    borderWidth: 1,
    borderColor: "darkgray",
    height: 40,
    width: "40%",
    marginHorizontal: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContinueModal: {
    backgroundColor: "lightblue"
  },
  buttonCloseModal: {
    backgroundColor: "white"
  },
  textButtonCloseModal: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
  },
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
    height: "100%",
    width: "100%"
    // bottom: -20
  }
});

export default ModalCategoryComponent;

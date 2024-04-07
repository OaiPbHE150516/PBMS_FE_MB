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
  Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/FontAwesome6";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// components
import ModalCategoryComponent from "../../components/category/modalCategoryComponent";
import TabCategoryInModalComponent from "../../components/category/tabCategoryInModalComponent";

// redux
import { getCategories, createCategory } from "../../redux/categorySlice";

// services
import categoryServices from "../../services/categoryServices";

const TabCategory = createMaterialTopTabNavigator();

const CategoryManagerScreen = () => {
  // const categories = useSelector((state) => state.category?.categories);
  const account = useSelector((state) => state.authen?.account);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isModalAddCateVisible, setIsModalAddCateVisible] = useState(false);
  const [cateParentList, setCateParentList] = useState([]);

  const [newCate, setNewCate] = useState({
    name: "",
    parentID: null,
    accountID: account?.accountID
  });

  const [nowCategories, setNowCategories] = useState([]);

  // async function fetchDataCategories
  async function fetchDataCategories() {
    try {
      await categoryServices.getCategories(account?.accountID).then((res) => {
        console.log("fetchDataCategories res: ", res);
        setNowCategories(res);
      });
    } catch (error) {
      console.log("fetchDataCategories error: ", error);
      Alert.alert("Thông báo", "Lỗi khi lấy dữ liệu hạng mục");
    }
  }

  useEffect(() => {
    if (account !== null) {
      fetchDataCategories();
      // if (categories === null) {
      //   dispatch(getCategories(account?.accountID));
      // }
    }
  }, [account]);

  const Tab1 = () => {
    // if (nowCategories === null) {
    //   return (
    //     <View
    //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    //     >
    //       <ActivityIndicator size="large" color="tomato" />
    //     </View>
    //   );
    // }
    return (
      nowCategories[0] && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TabCategoryInModalComponent
            props={{ category: nowCategories[0], action: false }}
          />
        </View>
      )
    );
  };
  const Tab2 = () => {
    // if (nowCategories === null) {
    //   return (
    //     <View
    //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    //     >
    //       <ActivityIndicator size="large" color="tomato" />
    //     </View>
    //   );
    // }
    return (
      nowCategories[1] && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TabCategoryInModalComponent
            props={{ category: nowCategories[1], action: false }}
          />
        </View>
      )
    );
  };

  const handleAddCategory = () => {
    setIsModalAddCateVisible(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  function handleCreateCategory() {
    console.log("newCate: ", newCate);
    if (
      newCate?.name === "" ||
      newCate?.parentID === null ||
      newCate?.name.length > 30
    ) {
      Alert.alert(
        "Thông báo",
        "Tên hạng mục không được để trống hoặc quá 30 ký tự"
      );
      return;
    }
    dispatch(createCategory(newCate));
    Alert.alert("Thông báo", "Thêm hạng mục thành công");
    setNewCate({
      ...newCate,
      name: "",
      parentID: cateParentList[0]?.categoryID
    });
    setIsModalAddCateVisible(!isModalAddCateVisible);
  }

  function handleFocusScreen(index) {
    if (nowCategories && nowCategories[index]) {
      const listParent = [
        nowCategories[index],
        ...nowCategories[index]?.children
      ];
      // console.log("listParent: ", listParent);
      setCateParentList(listParent);
      setNewCate({
        ...newCate,
        parentID: nowCategories[index]?.categoryID,
        type: index + 1
      });
    }
  }

  const AnCateParentItem = ({ item }) => {
    function onHandleItemOnPress(item) {
      console.log("item: ", item);
      setNewCate({ ...newCate, parentID: item.categoryID });
      dispatch(getCategories(account?.accountID));
    }
    return (
      <Pressable
        style={styles.pressableCateItem}
        onPress={() => {
          onHandleItemOnPress(item);
        }}
      >
        <Text style={styles.textCateItem}>{item.nameVN}</Text>
        {item.categoryID === newCate?.parentID ? (
          <Icon name="check" size={20} color="darkgray" />
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.modalView}>
      <View style={styles.viewHeader}>
        <Pressable
          style={styles.pressableBack}
          onPress={() => {
            handleBack();
          }}
        >
          <Icon name="chevron-left" size={22} color="#3498db" />
        </Pressable>
        <Text style={styles.modalTextHeader}>{"Hạng mục thu / chi"}</Text>
      </View>
      <TabCategory.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: {
            alignSelf: "flex-end",
            flexDirection: "row",
            width: Dimensions.get("window").width * 0.95
          },
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            alignContent: "center",
            flexDirection: "row",
            width: "50%"
          },
          tabBarLabelStyle: {
            fontSize: 18,
            fontFamily: "Inconsolata_500Medium",
            color: "darkgray",
            textTransform: "none",
            letterSpacing: 0,
            width: Dimensions.get("window").width * 0.5
          },
          tabBarIndicatorStyle: {
            backgroundColor: "tomato"
          },
          swipeEnabled: true
        }}
      >
        <TabCategory.Screen
          name="Khoản chi"
          component={Tab2}
          listeners={{
            focus: () => {
              handleFocusScreen(1);
            }
          }}
        />
        <TabCategory.Screen
          name="Khoản thu"
          component={Tab1}
          listeners={{
            focus: () => {
              handleFocusScreen(0);
            }
          }}
        />
      </TabCategory.Navigator>
      <View style={styles.viewActionModal}>
        <Pressable
          style={[styles.buttonContinueModal, styles.buttonActionModal]}
          onPressIn={() => {
            handleAddCategory();
          }}
        >
          <Text style={styles.textPressableAction}>{"Thêm hạng mục"}</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalAddCateVisible}
      >
        <View style={styles.viewModaAddCate}>
          <View style={styles.modalAddCate}>
            <Text style={styles.modalAddCateTextHeader}>{"Thêm hạng mục"}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={"Nhập tên hạng mục"}
              placeholderTextColor={"darkgray"}
              value={newCate?.name}
              onChangeText={(text) => setNewCate({ ...newCate, name: text })}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inconsolata_500Medium",
                alignSelf: "flex-start",
                marginHorizontal: 10
              }}
            >
              {"Chọn hạng mục cha"}
            </Text>
            <View style={styles.viewFlatListParentCate}>
              {cateParentList === null ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text> {"Loading"}</Text>
                  <ActivityIndicator size="large" color="tomato" />
                </View>
              ) : (
                <FlatList
                  data={cateParentList}
                  renderItem={({ item }) => <AnCateParentItem item={item} />}
                />
              )}
            </View>
            <View style={styles.viewActionModal}>
              <Pressable
                style={[styles.buttonCloseModal, styles.buttonActionModal]}
                onPress={() => setIsModalAddCateVisible(!isModalAddCateVisible)}
              >
                <Text style={styles.textPressableAction}>{"Hủy"}</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonContinueModal, styles.buttonActionModal]}
                onPress={() => handleCreateCategory()}
              >
                <Text style={styles.textPressableAction}>{"Lưu"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  textCateItem: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular"
  },
  pressableCateItem: {
    height: 40,
    marginVertical: 5,
    paddingVertical: 2,
    paddingHorizontal: 10,
    paddingRight: "20%",
    marginHorizontal: 5,
    borderBottomColor: "darkgray",
    borderBottomWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center"
  },
  viewFlatListParentCate: {
    width: "100%",
    height: "auto",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: "center"
    // alignItems: "center",
  },
  modalAddCateTextHeader: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium"
  },
  textInput: {
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 5,
    width: "100%",
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    fontFamily: "Inconsolata_400Regular",
    fontSize: 20
  },
  viewModaAddCate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  modalAddCate: {
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
    height: "auto",
    maxHeight: "80%",
    width: "95%",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  viewHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  pressableBack: {
    alignSelf: "flex-start",
    margin: 2,
    position: "absolute",
    top: 2,
    left: 8,
    flex: 1,
    // borderWidth: 1,
    width: "20%"
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
  textPressableAction: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular"
  },
  modalTextHeader: {
    fontSize: 30,
    // fontWeight: "bold",
    fontFamily: "Inconsolata_500Medium"
    // marginTop: 10
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
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

export default CategoryManagerScreen;

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
import {
  TextInput as PaperTextInput,
  Chip as PaperChip
} from "react-native-paper";

// components
import NewTabCategoryComponent from "../../components/category/newTabCategoryComp";

// redux
import { getCategories, createCategory } from "../../redux/categorySlice";

// services
import categoryServices from "../../services/categoryServices";

const TabCategory = createMaterialTopTabNavigator();

const CategoryManagerScreen = () => {
  // const categories = useSelector((state) => state.category?.categories);
  const account = useSelector((state) => state.authen?.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // services state
  const [cateParentList, setCateParentList] = useState([]);
  const [newCate, setNewCate] = useState({
    name: "",
    parentID: null,
    accountID: account?.accountID
  });
  const [editCate, setEditCate] = useState({});
  const [nowCategories, setNowCategories] = useState([]);

  // screen state
  const [isModalAddCateVisible, setIsModalAddCateVisible] = useState(false);
  const [isShowMenuModal, setIsShowMenuModal] = useState(false);
  const [isShowModalEditCate, setIsShowModalEditCate] = useState(false);
  const [focusScreen, setFocusScreen] = useState(0);

  // const variables
  const MAX_LENGTH_CATE_NAME = 30;

  async function fetchDataCategories() {
    try {
      await categoryServices.getCategories(account?.accountID).then((res) => {
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
      handleFocusScreen(focusScreen);
    }
  }, [account, shouldFetchData]);

  useEffect(() => {
    handleFocusScreen(focusScreen);
  }, [focusScreen, shouldFetchData]);

  function onCallbackCategory(data) {
    console.log("data: ", data);
    // setIsShowModalEditCate(!isShowModalEditCate);
  }

  function onCallbackLongPressCategory(data) {
    if (cateParentList?.length === 0 || cateParentList === null) return;
    console.log("onCallbackLongPressCategory data: ", data);
    setEditCate(data);
    setIsShowModalEditCate(!isShowModalEditCate);
  }

  const handleBack = () => {
    navigation.goBack();
  };

  function handleReloadCategories() {
    setNowCategories([]);
    fetchDataCategories();
  }

  function handleCreateCategory() {
    console.log("newCate: ", newCate);
    if (
      newCate?.name === "" ||
      newCate?.parentID === null ||
      newCate?.name.length > MAX_LENGTH_CATE_NAME
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
    handleReloadCategories();
  }

  async function handleFocusScreen(index) {
    if (nowCategories[index]) {
      setCateParentList([nowCategories[index]]);
      setNewCate({
        ...newCate,
        parentID: nowCategories[index]?.categoryID,
        type: index + 1
      });
    }
  }

  function onHandleItemOnPress(item) {
    console.log("item: ", item);
    if (isShowModalEditCate) {
      setEditCate({ ...editCate, parentCategoryID: item.categoryID });
    }
    if (isModalAddCateVisible) {
      setNewCate({ ...newCate, parentID: item.categoryID });
    }
    // dispatch(getCategories(account?.accountID));
  }

  function handleCancelEditCate() {
    setIsShowModalEditCate(!isShowModalEditCate);
    setEditCate(null);
  }

  function handleCancelAddCate() {
    setIsModalAddCateVisible(!isModalAddCateVisible);
    setNewCate({
      ...newCate,
      name: "",
      parentID: cateParentList[0]?.categoryID
    });
  }

  function handleDeleteCate(categoryID) {
    console.log("categoryID: ", categoryID);
    Alert.alert("Thông báo", "Bạn có chắc chắn muốn xóa hạng mục này?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "Xóa",
        onPress: () => {
          deleteCategory(categoryID);
          setIsShowModalEditCate(!isShowModalEditCate);
        }
      }
    ]);
  }

  async function deleteCategory(categoryID) {
    try {
      await categoryServices.deleteCategory({
        categoryID: categoryID,
        accountID: account?.accountID
      });
      Alert.alert("Thông báo", "Xóa hạng mục thành công");
      setIsShowModalEditCate(!isShowModalEditCate);
      handleReloadCategories();
    } catch (error) {
      console.log("deleteCategory error: ", error);
      Alert.alert("Thông báo", "Lỗi khi xóa hạng mục");
    }
  }

  async function handleUpdateCategory() {
    console.log("editCate: ", editCate);
    if (
      editCate?.nameVN === "" ||
      editCate?.nameVN.length > MAX_LENGTH_CATE_NAME
    ) {
      Alert.alert(
        "Thông báo",
        "Tên hạng mục không được để trống hoặc quá " +
          MAX_LENGTH_CATE_NAME +
          " ký tự"
      );
      return;
    }
    try {
      await categoryServices.updateCategory({
        cate: editCate,
        accountID: account?.accountID
      });
      Alert.alert("Thông báo", "Cập nhật hạng mục thành công");
      setIsShowModalEditCate(!isShowModalEditCate);
      handleReloadCategories();
    } catch (error) {
      console.log("handleUpdateCategory error: ", error);
      Alert.alert("Thông báo", "Lỗi khi cập nhật hạng mục");
    }
  }

  const Tab1 = () => {
    return (
      nowCategories[0] && (
        <View style={styles.view_TabCategory}>
          <NewTabCategoryComponent
            props={{ category: nowCategories[0], action: false }}
            callback={onCallbackCategory}
            callbackLongPress={onCallbackLongPressCategory}
            isHasFooter={true}
          />
        </View>
      )
    );
  };
  const Tab2 = () => {
    return (
      nowCategories[1] && (
        <View style={styles.view_TabCategory}>
          <NewTabCategoryComponent
            props={{ category: nowCategories[1], action: false }}
            callback={onCallbackCategory}
            callbackLongPress={onCallbackLongPressCategory}
            isHasFooter={true}
          />
        </View>
      )
    );
  };

  const AnCateParentItem = ({ item, depth = 0 }) => {
    return (
      <View style={styles.viewCateItem}>
        <Pressable
          style={({ pressed }) => [
            styles.pressableCateItem,
            {
              marginLeft: 20 * depth,
              width: Dimensions.get("window").width * 0.9 - 30 * depth,
              height: 40,
              backgroundColor: pressed ? "lightgray" : null
            }
          ]}
          onPress={() => {
            onHandleItemOnPress(item);
          }}
          // disable when item is editing or item have children is editing
          disabled={
            (isShowModalEditCate && item.categoryID === editCate?.categoryID) ||
            (isShowModalEditCate &&
              item.parentCategoryID === editCate?.categoryID)
          }
        >
          {item?.isRoot ? (
            <Icon
              style={styles.iconCateItem}
              name="folder-tree"
              size={15}
              color="black"
            />
          ) : (
            <Icon
              style={styles.iconCateItem}
              name="angle-right"
              size={15}
              color="black"
            />
          )}

          <Text style={styles.textCateItem}>{item.nameVN}</Text>
          {isModalAddCateVisible && item.categoryID === newCate?.parentID ? (
            <Icon
              style={styles.iconCateItemSelected}
              name="check"
              size={20}
              color="darkgray"
            />
          ) : null}
          {isShowModalEditCate &&
          item.categoryID === editCate?.parentCategoryID ? (
            <Icon
              style={styles.iconCateItemSelected}
              name="check"
              size={20}
              color="darkgray"
            />
          ) : null}
        </Pressable>
        {item.children &&
          item.children.length > 0 &&
          item.children.map((child) => (
            <AnCateParentItem
              key={child.categoryID}
              item={child}
              depth={depth + 1}
            />
          ))}
      </View>
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
        <View style={styles.view_TextHeader}>
          <Text style={styles.text_ScreenHeader}>{"Hạng mục thu / chi"}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            // styles.pressable_Menu,
            {
              opacity: pressed ? 0.5 : 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
              alignContent: "flex-end"
            }
          ]}
          onPress={() => {
            handleReloadCategories();
          }}
        >
          <Icon name="arrow-rotate-right" size={22} color="#2d3436" />
        </Pressable>
        <Pressable
          style={styles.pressable_Menu}
          onPress={() => {
            setIsModalAddCateVisible(!isModalAddCateVisible);
          }}
          disabled={cateParentList?.length === 0 || cateParentList === null}
        >
          <Icon name="ellipsis-vertical" size={22} color="#2d3436" />
        </Pressable>
      </View>
      <View style={{}}>
        <TabCategory.Navigator screenOptions={screenOptions}>
          <TabCategory.Screen
            name="Khoản chi"
            component={Tab2}
            listeners={{
              focus: () => {
                setFocusScreen(1);
              }
            }}
          />
          <TabCategory.Screen
            name="Khoản thu"
            component={Tab1}
            listeners={{
              focus: () => {
                setFocusScreen(0);
              }
            }}
          />
        </TabCategory.Navigator>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalAddCateVisible}
      >
        <View style={styles.view_Modal_Background}>
          {/* a pressable to close modal */}
          <Pressable
            style={styles.pressable_CloseModal}
            onPress={() => handleCancelAddCate()}
          />
          <View style={styles.modalAddCate}>
            <Text style={styles.modalAddCateTextHeader}>{"Thêm hạng mục"}</Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <PaperTextInput
                mode="outlined"
                style={styles.textInput}
                label={"Tên hạng mục"}
                placeholderTextColor={"darkgray"}
                value={newCate?.name}
                onChangeText={(text) => setNewCate({ ...newCate, name: text })}
              />
            </View>

            <Text style={styles.text_PickParentCate}>
              {"Chọn hạng mục cha"}
            </Text>
            <View style={styles.viewFlatListParentCate}>
              <FlatList
                data={cateParentList || []}
                keyExtractor={(item) => item.categoryID}
                renderItem={({ item }) => (
                  <AnCateParentItem item={item} depth={0} />
                )}
              />
              <View style={styles.viewActionModal}>
                <Pressable
                  style={[styles.buttonCloseModal, styles.buttonActionModal]}
                  onPress={() => handleCancelAddCate()}
                >
                  <Text style={styles.textPressableAction}>{"Hủy"}</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttonContinueModal, styles.buttonActionModal]}
                  onPress={() => handleCreateCategory()}
                >
                  <Text style={styles.textPressableAction}>{"Thêm"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowModalEditCate}
      >
        <View style={styles.view_Modal_Background}>
          <Pressable
            style={styles.pressable_CloseModal}
            onPress={() => {
              handleCancelEditCate();
            }}
          />
          <View style={styles.modalAddCate}>
            <Text style={styles.modalAddCateTextHeader}>{"Sửa hạng mục"}</Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <PaperTextInput
                mode="outlined"
                style={styles.textInput}
                label={"Tên hạng mục"}
                placeholderTextColor={"darkgray"}
                value={editCate?.nameVN}
                onChangeText={(text) =>
                  setEditCate({ ...editCate, nameVN: text })
                }
              />
              <Pressable
                style={({ pressed }) => [
                  styles.pressable_DeleteCate,
                  { opacity: pressed ? 0.2 : 1 }
                ]}
                onPress={() => handleDeleteCate(editCate?.categoryID)}
              >
                <Icon name="trash" size={20} color="#b2bec3" />
              </Pressable>
            </View>
            <Text style={styles.text_PickParentCate}>
              {"Chọn hạng mục cha"}
            </Text>
            <View style={styles.viewFlatListParentCate}>
              <FlatList
                data={cateParentList || []}
                keyExtractor={(item) => item.categoryID}
                renderItem={({ item }) => (
                  <AnCateParentItem item={item} depth={0} />
                )}
              />
              <View style={styles.viewActionModal}>
                <Pressable
                  style={[styles.buttonCloseModal, styles.buttonActionModal]}
                  onPress={() => handleCancelEditCate()}
                >
                  <Text style={styles.textPressableAction}>{"Hủy"}</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttonContinueModal, styles.buttonActionModal]}
                  onPress={() => handleUpdateCategory()}
                >
                  <Text style={styles.textPressableAction}>{"Lưu"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const screenOptions = {
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
};

const styles = StyleSheet.create({
  pressable_DeleteCate: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    flex: 0.2
  },
  pressable_CloseModal: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  text_PickParentCate: {
    fontSize: 20,
    fontFamily: "OpenSans_500Medium",
    alignSelf: "flex-start",
    marginHorizontal: 10,
    marginVertical: 5
  },
  view_TabCategory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white"
    // height: "70%"
  },
  viewCateItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: "column"
    // borderWidth: 2,
    // borderColor: "red"
  },
  iconCateItemSelected: {
    marginHorizontal: 10,
    marginRight: 20,
    right: -75
  },
  iconCateItem: {
    marginHorizontal: 10,
    marginRight: 20
  },
  textCateItem: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular"
  },
  pressableCateItem: {
    marginVertical: 3,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#b2bec3",
    borderLeftColor: "#b2bec3",
    borderLeftWidth: 1,
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center"
  },
  viewFlatListParentCate: {
    width: "100%",
    // flex: 1,
    height: "80%",
    // maxHeight: "80%",
    // borderWidth: 1,
    // borderColor: "darkgray",
    borderRadius: 5,
    // marginVertical: 10,
    justifyContent: "center"
    // alignItems: "center",
  },
  modalAddCateTextHeader: {
    fontSize: 25,
    fontFamily: "OpenSans_500Medium",
    marginVertical: 10
  },
  textInput: {
    borderRadius: 5,
    flex: 1,
    height: 40,
    // marginVertical: 10,
    fontFamily: "Inconsolata_400Regular",
    fontSize: 20,
    backgroundColor: "white"
  },
  view_Modal_Background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  modalAddCate: {
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
    height: "auto",
    maxHeight: "90%",
    width: "100%",
    borderRadius: 5,
    // paddingVertical: 10,
    paddingHorizontal: 5
  },
  view_TextHeader: {
    // width: "60%",
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
    // alignSelf: "center",
    // borderWidth: 1,/p
  },
  pressable_Menu: {
    // borderWidth: 1,
    // borderColor: "darkgray",
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    right: 0,
    marginHorizontal: 10
  },
  viewHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around"
    // backgroundColor: "#fab1a0",
    // alignItems: "center",
    // alignContent: "center"
  },
  pressableBack: {
    alignSelf: "flex-start",
    margin: 2,
    // position: "absolute",
    top: 2,
    left: 8,
    flex: 1,
    // borderWidth: 1,
    width: "20%"
  },
  viewActionModal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
    // marginVertical: 20,
    // marginHorizontal: 5
    // backgroundColor: "red",
    // borderWidth: 10
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
    fontFamily: "OpenSans_400Regular"
  },
  text_ScreenHeader: {
    fontSize: 25,
    // fontWeight: "bold",
    fontFamily: "OpenSans_500Medium"
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

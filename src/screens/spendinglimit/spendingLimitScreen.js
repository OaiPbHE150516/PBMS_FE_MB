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
import { ProgressBar } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  TextInput as PaperTextInput,
  Chip as PaperChip,
  Snackbar as PaperSnackbar
} from "react-native-paper";

// redux
import { useDispatch, useSelector } from "react-redux";

// libraries
import datetimeLibrary from "../../library/datetimeLibrary";

// components

// services
import budgetServices from "../../services/budgetServices";
import categoryServices from "../../services/categoryServices";

const SpendingLimitScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  // screen variables
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalMenuVisible, setModalMenuVisible] = useState(false);
  const [isModalShowingAddBudget, setIsModalShowingAddBudget] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowCategory, setIsShowCategory] = useState(false);
  const [budgetTimeType, setBudgetTimeType] = useState("week"); // week, month
  const [fontSizeAmountBudget, setFontSizeAmountBudget] = useState(20);
  const [targetAmount, setTargetAmount] = useState("");
  const [budgetTimeRangeString, setBudgetTimeRangeString] = useState("");

  // services variables
  const [listSpendingLimit, setListSpendingLimit] = useState([]);
  const [nowCategories, setNowCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budgetAdd, setBudgetAdd] = useState({
    accountID: "",
    budgetName: "",
    targetAmount: 0,
    beginDate: "",
    endDate: "",
    budgetTypeID: 0,
    note: "",
    createTime: "",
    categoryIDs: []
  });

  // const variables
  const TYPE_WEEK = "week";
  const TYPE_MONTH = "month";
  const TYPE_INFINITY = "infinity";

  async function fetchAllSpendingLimit() {
    await budgetServices
      .getAllBudget(account?.accountID)
      .then((response) => {
        setListSpendingLimit(response);
      })
      .catch((error) => {
        console.log("Error fetchAllSpendingLimit data:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu danh sách hạn mức chi");
      });
  }

  async function fetchDataCategories() {
    try {
      await categoryServices.getCategories(account?.accountID).then((res) => {
        setNowCategories(res[1]?.children);
      });
    } catch (error) {
      console.log("fetchDataCategories error: ", error);
      Alert.alert("Thông báo", "Lỗi khi lấy dữ liệu hạng mục");
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchAllSpendingLimit();
      fetchDataCategories();
    }
  }, [isFocused, shouldFetchData]);

  useEffect(() => {
    if (isFocused) {
      switch (budgetTimeType) {
        case TYPE_WEEK:
          let timeWeek = datetimeLibrary.getTimeWeekBefore(0)[3];
          setBudgetTimeRangeString("Tuần này: " + timeWeek);
          break;
        case TYPE_MONTH:
          let timeMonth = datetimeLibrary.getTimeThisMonthByNumMonth(0)[3];
          setBudgetTimeRangeString("Tháng này: " + timeMonth);
          break;
        case TYPE_INFINITY:
          setBudgetTimeRangeString("Hôm nay");
          break;
        default:
          break;
      }
    }
  }, [budgetTimeType]);

  function handleSelectedCategory(category) {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
      // setNowCategories((prevCategories) =>
      //   prevCategories.filter((item) => item !== category)
      // );
    } else {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
      // setNowCategories((prevCategories) => [...prevCategories, category]);
    }
  }

  function handleCloseModalAddBudget() {
    setIsModalShowingAddBudget(false);
    setIsShowCategory(false);
    setSelectedCategories([]);
    setBudgetAdd({
      accountID: "",
      budgetName: "",
      targetAmount: 0,
      beginDate: "",
      endDate: "",
      budgetTypeID: 0,
      note: "",
      createTime: "",
      categoryIDs: []
    });
    setTargetAmount("");
    fetchDataCategories();
  }

  async function handleAddBudget() {
    console.log("handleAddBudget: ");
    let targetAmountAdd = convertStringToNumber(targetAmount);
    let beginData = new Date();
    let endData = new Date();
    let budgetTypeID = 0;
    switch (budgetTimeType) {
      case TYPE_WEEK:
        beginData = datetimeLibrary.getTimeWeekBefore(0)[4];
        endData = datetimeLibrary.getTimeWeekBefore(0)[5];
        budgetTypeID = 1;
        break;
      case TYPE_MONTH:
        beginData = datetimeLibrary.getTimeThisMonthByNumMonth(0)[5];
        endData = datetimeLibrary.getTimeThisMonthByNumMonth(0)[6];
        budgetTypeID = 2;
        break;
      case TYPE_INFINITY:
        beginData = new Date();
        endData = new Date();
        budgetTypeID = 0;
        break;
      default:
        break;
    }
    let categoryIDs = selectedCategories.map((item) => item.categoryID);
    let newBudget = {
      accountID: account?.accountID,
      budgetName: budgetAdd.budgetName,
      targetAmount: targetAmountAdd,
      beginDate: beginData,
      endDate: endData,
      budgetTypeID: budgetTypeID,
      note: budgetAdd.note,
      createTime: new Date(),
      categoryIDs: categoryIDs
    };
    console.log("newBudget: ", newBudget);
    addBudget(newBudget)
      .catch((error) => {
        console.log("Error addBudget data:", error);
        Alert.alert("Lỗi", "Không thể thêm hạn mức chi");
      })
      .finally(() => {
        handleCloseModalAddBudget();
        Alert.alert("Thông báo", "Thêm hạn mức chi thành công");
      });
  }

  async function addBudget(data) {
    try {
      const response = await budgetServices.createBudget(data);
      console.log("addBudget response: ", response);
      if (response) {
        handleCloseModalAddBudget();
        fetchAllSpendingLimit();
      }
    } catch (error) {
      console.log("Error addBudget data:", error);
      Alert.alert("Lỗi", "Không thể thêm hạn mức chi");
    }
  }

  function handleChangeTextTargetAmount(text) {
    setTargetAmount(convertNumberToString(text));
  }

  // function convert number to string with '.' separator
  function convertNumberToString(number) {
    return number
      .toString()
      .replace(/\./g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function convertStringToNumber(string) {
    let returnData = string.toString().replace(/\./g, "");
    console.log("convertStringToNumber returnData: ", returnData);
    return returnData;
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAllSpendingLimit().then(() => {
      setIsRefreshing(false);
    });
  };

  const ASpendingLimit = ({ item }) => {
    return (
      <View style={styles.budgetItem}>
        <View style={[styles.view_ABudget_Infor, { justifyContent: "center" }]}>
          <Text style={styles.text_budgetName}>{item.budgetName}</Text>
        </View>
        <View style={styles.view_ABudget_Infor}>
          <Text style={styles.text_datestr}>{item.beginDateStr}</Text>
          <Text style={styles.text_datestr}>{item.endDateStr}</Text>
        </View>
        <View style={styles.view_ABudget_Progressbar}>
          <ProgressBar
            progress={item.percentProgress / 100}
            // color={"red"}
            // use switch case to change color, base on percentProgress
            color={
              item.percentProgress < 50
                ? "green" // green
                : item.percentProgress < 80
                  ? "#fdcb6e" // yellow
                  : "#d63031" // red
            }
          />
        </View>
        <View style={styles.view_ABudget_Infor}>
          {item.percentProgress > 40 && (
            <View style={styles.view_remainAmountStr}>
              <Text style={styles.text_remainAmountStr}>
                {item.remainAmountStr}
              </Text>
            </View>
          )}
          {item.percentProgress <= 60 && (
            <View
              style={[
                styles.view_CurrentAmount,
                {
                  left: item.percentProgressStr
                }
              ]}
            >
              <Text
                style={[
                  styles.text_currentAmountStr,
                  {
                    color:
                      item.percentProgress < 50
                        ? "green" // green
                        : item.percentProgress < 60
                          ? "#fdcb6e" // yellow
                          : "#d63031" // red
                  }
                ]}
              >
                {item.currentAmountStr}
              </Text>
            </View>
          )}
          <View style={styles.view_TargetAmount}>
            <Text style={styles.text_targetAmount}>{item.targetAmountStr}</Text>
          </View>
        </View>
        <View
          style={[
            styles.view_Row100Width,
            {
              flexDirection: "column",
              marginVertical: 2
            }
          ]}
        >
          <Text style={styles.text_15Inconsolata_400Regular}>
            {"Hạng mục: "}
            {item.categories.map((cate) => cate.nameVN).join(", ")}
          </Text>
          {/* item?.note */}
          <Text style={styles.text_15Inconsolata_400Regular}>
            {"Ghi chú: " + item.note}
          </Text>
        </View>
      </View>
    );
  };

  const AnCateParentItem = ({ item, depth = 0 }) => {
    return (
      <View style={styles.viewCateItem}>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? "rgba(0,0,0,0.1)"
                : selectedCategories.includes(item)
                  ? "#b2bec3"
                  : "white",
              marginLeft: depth * 10,
              height: 35,
              width: Dimensions.get("window").width * 0.9 - 30 * depth
            },
            styles.pressableCateItem
          ]}
          onPress={() => {
            handleSelectedCategory(item);
          }}
        >
          <Icon
            style={styles.iconCateItem}
            name="angle-right"
            size={15}
            color="black"
          />
          <Text
            style={{
              fontSize: 18,
              fontFamily: "OpenSans_400Regular"
            }}
          >
            {item.nameVN}
          </Text>
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

  // return hello world in center screen
  return (
    <View style={styles.container}>
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
          <Text style={styles.modalTextHeader}>{"Quản lý hạn mức chi"}</Text>
        </View>
        <Pressable
          style={styles.pressable_Menu}
          onPress={() => {
            setModalMenuVisible(true);
          }}
        >
          <Icon name="ellipsis-vertical" size={22} color="#2d3436" />
        </Pressable>
      </View>
      <FlatList
        style={styles.flatList_Budgets}
        data={listSpendingLimit}
        renderItem={ASpendingLimit}
        keyExtractor={(item) => item.budgetID}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalMenuVisible}
      >
        <View style={styles.view_Modal_Background}>
          <Pressable
            style={styles.pressable_CloseModal}
            onPress={() => {
              setModalMenuVisible(false);
            }}
          />
          <View style={styles.view_ModalMenu}>
            <Pressable
              onPress={() => {
                setIsModalShowingAddBudget(true);
                setModalMenuVisible(false);
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "white"
                },
                styles.pressable_AMenu_Option
              ]}
            >
              <Text style={styles.text_AMenu_Option}>{"Thêm hạn mức chi"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalShowingAddBudget}
      >
        <View style={styles.view_Modal_Background}>
          <Pressable
            style={styles.pressable_CloseModal}
            onPress={() => {
              handleCloseModalAddBudget();
            }}
          />
          <Pressable
            style={styles.view_ModalAddBudget}
            // keyboard dismiss
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={styles.view_Modal_Header}>
              <Text style={styles.text_Modal_Header}>{"Thêm hạn mức chi"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View>
                <PaperTextInput
                  label="Tên hạn mức chi"
                  placeholder="Nhập tên hạn mức chi, ví dụ: Tiền ăn uống"
                  mode="outlined"
                  outlineColor="black"
                  value={budgetAdd.budgetName}
                  onChangeText={(text) => {
                    setBudgetAdd({ ...budgetAdd, budgetName: text });
                  }}
                  style={[
                    styles.textinput_AddBudget,
                    {
                      fontSize: 20,
                      fontFamily: "OpenSans_500Medium"
                    }
                  ]}
                  fontSize={20}
                  fontFamily="OpenSans_500Medium"
                  error={budgetAdd.budgetName === "" && targetAmount !== ""}
                />
              </View>
              <View>
                <PaperTextInput
                  label="Số tiền hạn mức"
                  // placeholder="Nhập số tiền bạn muốn dành cho hạn mức chi này, ví dụ: 500.000 đ"
                  keyboardType={
                    Platform.OS === "ios" ? "number-pad" : "numeric"
                  }
                  value={targetAmount}
                  onChangeText={(text) => {
                    handleChangeTextTargetAmount(text);
                  }}
                  mode="outlined"
                  outlineColor="black"
                  style={[
                    styles.textinput_AddBudget,
                    {
                      fontSize: fontSizeAmountBudget,
                      fontFamily: "OpenSans_500Medium"
                    }
                  ]}
                  onBlur={() => {
                    // if it has value, no need to change font size
                    if (targetAmount === "") {
                      setFontSizeAmountBudget(20);
                    }
                  }}
                  onFocus={() => {
                    setFontSizeAmountBudget(26);
                  }}
                  fontSize={fontSizeAmountBudget}
                  fontFamily="OpenSans_500Medium"
                  error={targetAmount === "" && budgetAdd.budgetName !== ""}
                />
              </View>
              <View>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "white",
                      height: "auto"
                    },
                    styles.pressable_SelectCategory
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsShowCategory(!isShowCategory);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column"
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "OpenSans_400Regular"
                      }}
                    >
                      {"Chọn hạng mục chi tiêu"}
                    </Text>
                    <View
                      style={{
                        flexWrap: "wrap",
                        flexDirection: "row"
                      }}
                    >
                      {selectedCategories.length >= 1 &&
                        selectedCategories.map((item) => (
                          <PaperChip
                            key={item.categoryID}
                            mode="outlined"
                            style={{ margin: 5 }}
                            onPress={() => {
                              handleSelectedCategory(item);
                            }}
                          >
                            {item.nameVN}
                          </PaperChip>
                        ))}
                    </View>
                  </View>
                  <Icon
                    name="angle-down"
                    size={18}
                    color="#2d3436"
                    style={{
                      right: 10,
                      position: "absolute"
                    }}
                  />
                </Pressable>
                {isShowCategory && (
                  <FlatList
                    style={styles.view_ShowCategory}
                    data={nowCategories}
                    keyExtractor={(item) => item.categoryID}
                    renderItem={({ item }) => (
                      <AnCateParentItem item={item} depth={0} />
                    )}
                  />
                )}
              </View>
              {!isShowCategory && (
                <View style={styles.view_Row100Width}>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed
                          ? "#b2bec3"
                          : budgetTimeType === TYPE_WEEK
                            ? "#dfe6e9"
                            : "white"
                      },
                      styles.pressable_SelectBudgetTimeType
                    ]}
                    onPress={() => {
                      setBudgetTimeType(TYPE_WEEK);
                    }}
                  >
                    <Icon name="calendar-week" size={20} color="#636e72" />
                    <Text style={styles.text_SelectBudgetTimeType}>
                      {"Tuần này"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed
                          ? "#b2bec3"
                          : budgetTimeType === TYPE_MONTH
                            ? "#dfe6e9"
                            : "white"
                      },
                      styles.pressable_SelectBudgetTimeType
                    ]}
                    onPress={() => {
                      setBudgetTimeType(TYPE_MONTH);
                    }}
                  >
                    <Icon name="calendar" size={20} color="#636e72" />
                    <Text style={styles.text_SelectBudgetTimeType}>
                      {"Tháng này"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed
                          ? "#b2bec3"
                          : budgetTimeType === TYPE_INFINITY
                            ? "#dfe6e9"
                            : "white"
                      },
                      styles.pressable_SelectBudgetTimeType
                    ]}
                    onPress={() => {
                      setBudgetTimeType(TYPE_INFINITY);
                    }}
                  >
                    <Icon name="calendar-xmark" size={20} color="#636e72" />
                    <Text style={styles.text_SelectBudgetTimeType}>
                      {"Hôm nay"}
                    </Text>
                  </Pressable>
                </View>
              )}
              {!isShowCategory && (
                <View style={styles.view_Row100Width}>
                  <Text style={styles.text_BudgetTimeType_Describe}>
                    {"Bắt đầu từ " + budgetTimeRangeString}
                  </Text>
                </View>
              )}
              {!isShowCategory && (
                <View style={styles.view_Row100Width}>
                  <PaperTextInput
                    label="Ghi chú"
                    placeholder="Nhập ghi chú, ví dụ: Hạn mức chi tiêu T7"
                    mode="outlined"
                    outlineColor="black"
                    value={budgetAdd.note}
                    onChangeText={(text) => {
                      setBudgetAdd({ ...budgetAdd, note: text });
                    }}
                    style={styles.textinput_AddBudgetNote}
                    multiline={true}
                    numberOfLines={4}
                    height={100}
                  />
                </View>
              )}
              {!isShowCategory && (
                <View
                  style={[
                    styles.view_Row100Width,
                    { justifyContent: "space-around", flexDirection: "row" }
                  ]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? "#b2bec3" : "white"
                      },
                      styles.pressable_AddBudget
                    ]}
                    onPress={() => {
                      handleCloseModalAddBudget();
                    }}
                  >
                    <Text style={styles.text_BudgetTimeType_Describe}>
                      {"Hủy"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? "#b2bec3" : "#dfe6e9"
                      },
                      styles.pressable_AddBudget
                    ]}
                    onPress={() => {
                      handleAddBudget();
                    }}
                  >
                    <Text style={styles.text_BudgetTimeType_Describe}>
                      {"Thêm"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  text_15Inconsolata_400Regular: {
    fontSize: 16,
    fontFamily: "Inconsolata_400Regular",
    marginHorizontal: 5,
    marginTop: 2
  },
  pressable_AddBudget: {
    width: "35%",
    height: 35,
    borderWidth: 0.25,
    borderColor: "#636e72",
    borderRadius: 5,
    marginTop: 30,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    padding: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  text_BudgetTimeType_Describe: {
    fontSize: 18,
    fontFamily: "OpenSans_400Regular"
  },
  textinput_AddBudgetNote: {
    flex: 1,
    fontSize: 18,
    fontFamily: "OpenSans_400Regular",
    backgroundColor: "white"
  },
  view_Row100Width: {
    flexDirection: "row",
    width: "100%"
  },
  view_ShowCategory: {
    borderWidth: 0.5,
    borderColor: "#b2bec3",
    borderRadius: 10,
    padding: 5,
    height: "75%"
  },
  text_SelectBudgetTimeType: {
    fontSize: 18,
    fontFamily: "OpenSans_400Regular",
    marginHorizontal: 5
  },
  pressable_SelectBudgetTimeType: {
    margin: 5,
    padding: 10,
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b2bec3",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "auto"
  },
  viewCateItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: "column"
    // borderWidth: 2,
    // borderColor: "red"
  },
  iconCateItem: {
    marginHorizontal: 10,
    marginRight: 20
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
  pressable_SelectCategory: {
    // paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 5,
    marginVertical: 10,
    // margin: 5,
    borderRadius: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#b2bec3",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },
  textinput_AddBudget: {
    marginBottom: 2,
    backgroundColor: "white"
  },
  text_Modal_Header: {
    fontSize: 20,
    fontFamily: "OpenSans_600SemiBold"
  },
  view_Modal_Header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // borderBottomWidth: 0.5,
    // borderBottomColor: "#b2bec3",
    padding: 5
  },
  view_ModalAddBudget: {
    width: "100%",
    height: "80%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    flexDirection: "column",
    justifyContent: "flex-start"
    // alignItems: "center",
    // alignContent: "center"
  },
  text_AMenu_Option: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold"
  },
  pressable_AMenu_Option: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#b2bec3",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  view_ModalMenu: {
    width: "100%",
    minHeight: "30%",
    height: "auto",
    maxHeight: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    flexDirection: "column"
  },
  pressable_CloseModal: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  view_Modal_Background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  pressable_Menu: {
    // borderWidth: 1,
    // borderColor: "darkgray",
    width: "20%",
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    right: 0,
    marginHorizontal: 10,
    // borderWidth: 1,
    zIndex: 10
  },
  pressableBack: {
    alignSelf: "flex-start",
    margin: 2,
    position: "absolute",
    top: 2,
    left: 8,
    flex: 1,
    // borderWidth: 1,
    width: "20%",
    zIndex: 15
  },
  viewHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    borderBottomColor: "darkgray",
    borderBottomWidth: 0.5,
    paddingVertical: 5
  },
  view_TextHeader: {
    width: "100%",
    // flex: 6,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // borderWidth: 1,
    // borderColor: "red",
    alignSelf: "center",
    position: "absolute"
    // alignSelf: "center",
    // borderWidth: 1,/p
  },
  modalTextHeader: {
    fontSize: 25,
    // fontWeight: "bold",
    fontFamily: "OpenSans_500Medium"
    // marginTop: 10
  },
  flatList_Budgets: {
    width: "100%"
  },
  view_remainAmountStr: {
    position: "absolute",
    zIndex: 2,
    left: 0
  },
  text_remainAmountStr: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    color: "#d63031",
    textAlign: "left"
  },
  text_ViewAll: {
    color: "#0984e3",
    fontSize: 15,
    fontFamily: "OpenSans_600SemiBold"
  },
  pressable_ViewAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 5,
    // borderWidth: 1,
    width: "50%"
  },
  text_currentAmountStr: {
    fontSize: 16,
    fontFamily: "OpenSans_600SemiBold"
  },
  text_budgetName: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    alignSelf: "center"
  },
  text_Header: {
    fontSize: 15,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "center"
  },
  view_Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5
    // borderBottomWidth: 1,
    // borderBottomColor: "lightgray"
  },
  view_CurrentAmount: {
    position: "absolute",
    zIndex: 1
  },
  view_TargetAmount: {
    right: 0,
    flex: 1
  },
  text_targetAmount: {
    fontSize: 20,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "right"
  },
  text_datestr: {
    fontSize: 14,
    fontFamily: "OpenSans_300Light"
  },
  view_ABudget_Infor: {
    flexDirection: "row",
    justifyContent: "space-between"
    // borderWidth: 0.5
  },
  view_ABudget_Progressbar: {
    width: "100%",
    marginTop: 2,
    marginBottom: 4
  },
  budgetItem: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "darkgray",
    width: "100%"
    // height: 100
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    height: "100%"
  }
});

export default SpendingLimitScreen;

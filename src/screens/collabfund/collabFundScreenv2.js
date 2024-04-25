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
  Switch,
  Keyboard,
  RefreshControl
} from "react-native";
// node_modules library
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import {
  TextInput as PaperTextInput,
  Chip as PaperChip
} from "react-native-paper";

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import currencyLibrary from "../../library/currencyLIbrary";

// redux
import { useSelector, useDispatch } from "react-redux";
// import { getAllCollabFund } from "../../redux/collabFundSlice";
import collabFundServices from "../../services/collabFundServices";

// components
import CollabFundDetail from "./collabFundDetail";
import NotiNoData from "../../components/noti/notiNoData";

const Stack = createStackNavigator();

const CollabFundScreen = () => {
  const account = useSelector((state) => state.authen?.account);
  const [tempCollabFundList, setTempCollabFundList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const isFocused = useIsFocused();

  const [isModelMenuVisible, setIsModelMenuVisible] = useState(false);
  const [isModalGuildlineCFVisible, setIsModalGuildlineCFVisible] =
    useState(false);

  const [isModalNewCFVisible, setIsModalNewCFVisible] = useState(false);

  const [newCF, setNewCF] = useState({});
  const [imageCover, setImageCover] = useState(null);

  const [currentSearchText, setCurrentSearchText] = useState("");
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const [accountsSelected, setAccountsSelected] = useState([]);

  const [isAddingNewCF, setIsAddingNewCF] = useState(false);

  // const
  const widthScreen = Dimensions.get("window").width;
  const heightScreen = Dimensions.get("window").height;
  const ACCOUNT_STATE_PENDING = 3;
  const ACCOUNT_STATE_ACTIVE = 1;

  // data for guildline CF
  const [indexGuildlineCF, setIndexGuildlineCF] = useState(0);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  function handleError(error) {
    console.log("Error CollabFundScreen data:", error);
    Alert.alert(
      "Lối khi lấy dữ liệu quỹ hợp tác từ server",
      "Vui lòng thử lại sau",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]
    );
  }

  async function fetchCollabFundsData() {
    try {
      const response = await collabFundServices.getAllCollabFund(
        account?.accountID
      );
      const promises = response.map(async (element) => {
        const data = {
          collabFundID: element.collabFundID
        };
        try {
          const totalAmountResponse =
            await collabFundServices.getTotalAmount(data);
          element.totalAmount = totalAmountResponse?.totalAmount;
          element.totalAmountStr = totalAmountResponse?.totalAmountStr;
        } catch (error) {
          handleError(error);
        }
        return element;
      });
      const updatedResponse = await Promise.all(promises);
      // console.log("List collab fund: ", updatedResponse);
      setTempCollabFundList(updatedResponse);
    } catch (error) {
      handleError(error);
    } finally {
      // setTimeout(() => {
      setIsRefreshing(false);
      // }, 2000);
    }
  }

  // async function getTotalAmount(collabFundID) {
  //   try {
  //     const data = {
  //       collabFundID: collabFundID
  //     };
  //     const response = await collabFundServices.getTotalAmount(data);
  //     return response;
  //   } catch (error) {
  //     console.log("Error getTotalAmount data:", error);
  //   }
  // }

  // async function handleMapTotalAmountToCollabFundList(listCollabFunds) {
  //   try {
  //     listCollabFunds.forEach(async (element) => {
  //       // console.log("Element: ", element);
  //       // let totalAmountData = getTotalAmount(element?.collabFundID);
  //       // element.totalAmount = totalAmountData?.totalAmount;
  //       // element.totalAmountStr = totalAmountData?.totalAmountStr;
  //       // if (element.collabFundID === 89) {
  //         const data = {
  //           collabFundID: element.collabFundID
  //         };
  //         await collabFundServices.getTotalAmount(data).then((response) => {
  //           element.totalAmount = response?.totalAmount;
  //           element.totalAmountStr = response?.totalAmountStr;
  //         });
  //         console.log("Element: ", element);
  //       // }
  //     });
  //     console.log("List collab fund: ", listCollabFunds);
  //     return listCollabFunds;
  //   } catch (error) {
  //     console.log("Error handleMapTotalAmountToCollabFundList data:", error);
  //   }
  // }

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCollabFundsData();
  };

  useEffect(() => {
    if (isFocused) {
      console.log("CollabFundScreen isFocused: ", isFocused);
      if (account) {
        fetchCollabFundsData();
      }
    }
  }, [isFocused]);

  function handleCollabFundItemOnPress(collabFund) {
    navigation.navigate("CollabFundDetail", {
      collabFund: collabFund,
      otherParam: "anything you want here"
    });
  }

  function handleAcceptCollabFund(collabFund) {
    console.log("Accept collab fund: ", collabFund);
    // update collab fund state to active
    try {
      const data = {
        collabFundID: collabFund?.collabFundID,
        accountMemberID: account?.accountID
      };
      collabFundServices.acceptToCollabFund(data).finally(() => {
        // alert chấp nhận thành công
        // Alert.alert("Chấp nhận tham gia chi tiêu chung thành công", "", [
        //   {
        //     text: "OK",
        //     onPress: () => console.log("handleAcceptCollabFund OK Pressed")
        //   }
        // ]);
        onRefresh();
      });
    } catch (error) {}
  }

  function handleRejectCollabFund(collabFund) {
    console.log("Reject collab fund: ", collabFund);
    // delete collab fund
    try {
      const data = {
        collabFundID: collabFund?.collabFundID,
        accountMemberID: account?.accountID
      };
      collabFundServices.rejectToCollabFund(data).finally(() => {
        // alert từ chối thành công
        // Alert.alert("Từ chối tham gia chi tiêu chung thành công", "", [
        //   {
        //     text: "OK",
        //     onPress: () => console.log("handleRejectCollabFund OK Pressed")
        //   }
        // ]);
        onRefresh();
      });
    } catch (error) {}
  }

  const AnCollabFundItem = ({ collabFund }) => {
    return (
      <ImageBackground
        source={{
          uri: collabFund?.imageURL
            ? collabFund?.imageURL
            : "https://picsum.photos/200/200"
        }}
        style={styles.imageBackgroundAnCollabFundItem}
        imageStyle={{ borderRadius: 10, resizeMode: "cover" }}
      >
        <Pressable
          style={styles.pressableAnCollabFundItem}
          onPress={() => {
            handleCollabFundItemOnPress(collabFund);
          }}
          disabled={
            collabFund?.accountState?.activeStateID === ACCOUNT_STATE_PENDING
          }
        >
          <BlurView
            intensity={10}
            tint="systemThinMaterialDark"
            style={styles.blurViewAnCollabFundItem}
          >
            {/* Information */}
            <View style={styles.viewCollabFundItemInfor}>
              <Text style={styles.textCollabFundItemName}>
                {collabFund?.name}
              </Text>
              <View style={styles.viewCollabFundItemPartiesName}>
                {collabFund?.accountInCollabFunds?.map(
                  (accountInCollabFund) => {
                    return (
                      <Image
                        key={accountInCollabFund?.accountID}
                        source={{
                          uri: accountInCollabFund?.pictureURL
                            ? accountInCollabFund?.pictureURL
                            : "https://picsum.photos/200/200"
                        }}
                        style={styles.imageAccountInCollabFund}
                      />
                    );
                  }
                )}
              </View>
              <Text style={styles.textCollabFundItemNote}>
                {"Note: "}
                {collabFund?.description}
              </Text>
              {/* <View style={styles.viewCollabFundItemStatus}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                />
                <Text style={styles.textAnCollabFundItemStatus}>
                  {"Trạng thái"}
                </Text>
              </View> */}
            </View>
            {/* Action */}
            <View style={styles.viewCollabFundItemAction}>
              <Text style={styles.textCollabFundItemBalance}>
                {collabFund?.totalAmountStr}
              </Text>
              {collabFund?.accountState?.activeStateID ===
                ACCOUNT_STATE_PENDING && (
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: "auto"
                  }}
                >
                  <Pressable
                    style={styles.pressable_AnCollabFundItemAction_Reject}
                    onPress={() => {
                      handleRejectCollabFund(collabFund);
                    }}
                  >
                    <Icon name="xmark" size={40} color="#e17055" />
                  </Pressable>
                  <Pressable
                    style={styles.pressable_AnCollabFundItemAction_Accept}
                    onPress={() => {
                      handleAcceptCollabFund(collabFund);
                    }}
                  >
                    <Icon name="check" size={40} color="#00b894" />
                  </Pressable>
                </View>
              )}
              <Pressable
                style={styles.pressableAnCollabFundItemDetail}
                onPress={() => {}}
              >
                <Icon name="angle-right" size={20} color="white" />
              </Pressable>
            </View>
          </BlurView>
        </Pressable>
      </ImageBackground>
    );
  };

  function handleMenuPress() {
    setIsModelMenuVisible(true);
  }

  function handleResetCreateNewCF() {
    setIsModalNewCFVisible(false);
    setNewCF("");
    setAccountsSelected([]);
    setCurrentSearchText("");
    setSearchResult([]);
    setIsShowSearchResult(false);
    setImageCover(null);
  }

  async function handlePressNewCF() {
    console.log("New CF pressed");
    setIsAddingNewCF(true);
    if (!isModalNewCFVisible) {
      setIsModalNewCFVisible(true);
      return;
    }

    // check newCF data, name is required, accountsSelected is required
    if (!newCF?.name) {
      Alert.alert("Tên nhóm chi tiêu chung không được để trống", "", [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]);
      return;
    }
    if (accountsSelected.length === 0) {
      Alert.alert("Chưa chọn người tham gia", "", [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]);
      return;
    }

    // create new CF
    // 1. upload image cover to get imageURL
    try {
      console.log("Image cover: ", imageCover);
      await collabFundServices
        .uploadImageCover(imageCover)
        .then((response) => {
          // console.log("Upload image cover response: ", response);
          // setNewCF({ ...newCF, imageURL: response });
          const data = {
            accountID: account?.accountID,
            name: newCF?.name,
            description: newCF?.description ?? "",
            imageURL: response ?? "https://picsum.photos/512/512",
            accountIDs: accountsSelected.map((item) => item.accountID)
          };
          console.log("Data create CF: ", data);
          console.log("Accounts selected: ", data.accountIDs);
          collabFundServices.createCollabFund(data).finally(() => {
            // alert tạo thành công
            Alert.alert("Tạo chi tiêu chung thành công", "", [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed")
              }
            ]);
            setIsModalNewCFVisible(false);
            setIsModelMenuVisible(false);
            onRefresh();
          });
        })
        .catch((error) => {
          console.log("Error upload image cover data:", error);
          Alert.alert("Lỗi khi tải ảnh bìa", "Vui lòng thử lại sau", [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed")
            }
          ]);
        });
      handleResetNewCF();
      setIsAddingNewCF(false);
    } catch (error) {}
    // 2. create new CF with imageURL
  }

  function handleResetNewCF() {
    setNewCF({});
    setImageCover(null);
    setCurrentSearchText("");
    setAccountsSelected([]);
  }

  function handlePressGuildCF() {
    console.log("Guild CF pressed");
    setIsModalGuildlineCFVisible(true);
  }

  async function handlePickImage() {
    console.log("Pick image");
    // Kiểm tra quyền trước khi truy cập vào album ảnh
    const mediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (mediaPermission.status !== "granted") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        Alert.alert("Permission not granted");
        return;
      }
    }

    // Truy cập vào album ảnh nếu quyền đã được cấp
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      setImageCover(result.assets[0]);
    }
  }

  async function handleLaunchCamera() {
    console.log("Launch camera");
    // Kiểm tra quyền trước khi chụp ảnh
    const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        Alert.alert("Permission not granted");
        return;
      }
    }

    // Chụp ảnh nếu quyền đã được cấp
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      setImageCover(result.assets[0]);
    }
  }

  function handleOnFocusSearch() {
    setIsShowSearchResult(true);
  }

  function handleOnBlurSearch() {
    // setCurrentSearchText("");
    // setSearchResult([]);
    // setIsShowSearchResult(false);
  }

  function handleOnChangeTextSearch(text) {
    setCurrentSearchText(text);
  }

  // function hanleSelectedAnAccount(account) {
  //   // console.log("Selected account: ", account);
  //   // add selected account to accountsSelected if not exist in accountsSelected
  //   if (accountsSelected.length === 0) {
  //     setAccountsSelected([...accountsSelected, account]);
  //   } else {
  //     let isExist = false;
  //     accountsSelected.forEach((item) => {
  //       if (item.accountID === account.accountID) {
  //         isExist = true;
  //       }
  //     });
  //     if (!isExist) {
  //       setAccountsSelected([...accountsSelected, account]);
  //       // update search result
  //       let tempSearchResult = searchResult.filter(
  //         (item) => item.accountID !== account.accountID
  //       );
  //       setSearchResult(tempSearchResult);
  //     }
  //   }
  // }
  function hanleSelectedAnAccount(account) {
    if (
      accountsSelected.length === 0 ||
      !accountsSelected.some((item) => item.accountID === account.accountID)
    ) {
      setAccountsSelected((prevAccounts) => [...prevAccounts, account]);
      // update search result
      setSearchResult((prevSearchResult) =>
        prevSearchResult.filter((item) => item.accountID !== account.accountID)
      );
    }
  }

  function hanleDeleteAnAccountSelected(account) {
    // console.log("Delete account: ", account);
    let tempAccountsSelected = accountsSelected.filter(
      (item) => item.accountID !== account.accountID
    );
    setAccountsSelected(tempAccountsSelected);
    // update search result
    let tempSearchResult = searchResult;
    tempSearchResult.push(account);
  }

  function handleOnPressSelectedAccount(account) {
    console.log("onPressSelectedAccount: ", account);
  }

  function handleCancelSearch() {
    setIsShowSearchResult(false);
    setCurrentSearchText("");
    // hide keyboard
    Keyboard.dismiss();
  }

  useEffect(() => {
    if (currentSearchText) {
      setIsShowSearchResult(true);
      searchAccountByKeyword(currentSearchText);
    }
  }, [currentSearchText]);

  async function searchAccountByKeyword(keyword) {
    try {
      keyword = keyword.trim();
      if (!keyword) {
        return;
      }
      setSearchResult([]);
      const data = await collabFundServices.searchAccountByKeyword(keyword);
      const filteredData = data
        .filter((item) => item.accountID !== account?.accountID)
        .filter(
          (item) =>
            !accountsSelected.some(
              (selected) => selected.accountID === item.accountID
            )
        );
      setSearchResult(filteredData);
    } catch (error) {
      console.log("Error searchAccountByKeyword data:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : "Lỗi khi tìm kiếm người tham gia quỹ hợp tác";
      Alert.alert("Lỗi khi tìm kiếm người tham gia quỹ hợp tác", errorMessage, [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]);
    }
  }

  const CollabFundListScreen = () => {
    return (
      <View style={styles.containerCollabFundList}>
        <View style={styles.view_ScreenHeader}>
          <Text style={styles.textCollabFundListHeader}>
            {"Chi tiêu chung"}
          </Text>
          <Pressable
            onPress={() => {
              handlePressGuildCF();
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.25 : 1
              },
              styles.pressable_ModalMenuContent_GuildLineCF
            ]}
          >
            {/* <Text style={styles.text_GuildlineCF}>{"H.dẫn t.năng"}</Text> */}
            <Icon name="circle-info" size={25} color="#0984e3" />
          </Pressable>
          <Pressable
            onPress={() => {
              handleMenuPress();
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.25 : 1
              },
              styles.pressable_MenuPress
            ]}
          >
            <Icon name="bars" size={30} color="gray" />
          </Pressable>
        </View>
        <FlatList
          style={styles.flatlist_collabfund}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          extraData={tempCollabFundList}
          data={tempCollabFundList}
          keyExtractor={(item) => item?.collabFundID}
          renderItem={({ item }) => <AnCollabFundItem collabFund={item} />}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    );
  };

  const dataGuildlineCF = [
    {
      id: "1",
      title: "Hướng dẫn tạo chi tiêu chung",
      topContent:
        "1. Nhóm chi tiêu chung giúp bạn quản lý chi tiêu chung với người khác",
      bottomContent:
        "2. Bạn có thể tạo chi tiêu chung mới bằng cách nhấn vào nút 'Tạo chi tiêu chung'",
      imageURL: "https://picsum.photos/500/1000"
    },
    {
      id: "2",
      title: "Hướng dẫn tham gia chi tiêu chung",
      topContent:
        "1. Bạn có thể tham gia vào nhóm chi tiêu chung bằng cách nhấn vào nút 'Tham gia'",
      bottomContent:
        "2. Bạn cũng có thể xem thông tin chi tiêu chung bằng cách nhấn vào chi tiêu chung cần xem",
      imageURL: "https://picsum.photos/500/1000"
    }
  ];

  const AnViewGuildLineCF = ({ data }) => {
    return (
      <View
        style={[
          styles.view_AnGuildLineCF,
          {
            width: widthScreen - 10,
            // height: heightScreen * 0.7,
            borderWidth: 1,
            borderColor: "red",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }
        ]}
      >
        <Text style={styles.text_GuildlineCF}>{data.topContent}</Text>
        <Image
          source={{ uri: data.imageURL }}
          resizeMode="contain"
          style={{
            width: widthScreen * 0.9,
            minHeight: widthScreen * 0.9,
            height: "auto",
            maxHeight: heightScreen * 0.8
          }}
        />
        <Text style={styles.text_GuildlineCF}>{data.bottomContent}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="CollabFundList"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="CollabFundList" component={CollabFundListScreen} />
        <Stack.Screen name="CollabFundDetail" component={CollabFundDetail} />
        {/* <Stack.Screen name="ScreenA" component={ScreenA} />
        <Stack.Screen name="ScreenB" component={ScreenB} /> */}
      </Stack.Navigator>
      <Modal
        visible={isModelMenuVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.view_ModalMenu}>
          {/* a pressable to close modal */}
          <Pressable
            style={{
              flex: 1,
              width: "100%"
              // backgroundColor: "red"
            }}
            onPress={() => {
              setIsModelMenuVisible(false);
            }}
          />
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <ScrollView
              style={[
                styles.view_ModalMenuContent,
                {
                  height: isModalNewCFVisible ? "80%" : "15%"
                }
              ]}
            >
              {isModalNewCFVisible && (
                <View style={styles.view_NewCF}>
                  {/* <Text>{"New CF"}</Text> */}
                  <PaperTextInput
                    style={{
                      width: "95%",
                      backgroundColor: "white",
                      marginVertical: 5
                    }}
                    mode="outlined"
                    label="Tên nhóm chi tiêu chung *"
                    placeholder="vd: Phòng trọ ABC, Du lịch Hà Nội, ..."
                    value={newCF?.name}
                    onChangeText={(text) => {
                      setNewCF({ ...newCF, name: text });
                    }}
                  />
                  <PaperTextInput
                    style={{
                      width: "95%",
                      backgroundColor: "white",
                      marginVertical: 5
                    }}
                    mode="outlined"
                    label="Mô tả ngắn"
                    placeholder="vd: Phòng trọ ở quận 1, Hà Nội, ..."
                    value={newCF?.description}
                    onChangeText={(text) => {
                      setNewCF({ ...newCF, description: text });
                    }}
                  />
                  <View
                    style={{ marginVertical: 10, width: "95%", height: "auto" }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center"
                      }}
                    >
                      <PaperTextInput
                        style={{ flex: 1, backgroundColor: "white" }}
                        mode="outlined"
                        label="Mời người tham gia"
                        placeholder="vd: Phạm A, apham@gmail.com ..."
                        // right={
                        //   <PaperTextInput.Icon
                        //     icon="close-thick"
                        //     onPress={() => {
                        //       handleCancelSearch();
                        //     }}
                        //   />
                        // }
                        value={currentSearchText}
                        onChangeText={(text) => {
                          handleOnChangeTextSearch(text);
                        }}
                        onFocus={() => {
                          handleOnFocusSearch();
                        }}
                        onBlur={() => {
                          handleOnBlurSearch();
                        }}
                      />
                      <Pressable
                        onPress={() => {
                          handleCancelSearch();
                        }}
                        style={({ pressed }) => [
                          { opacity: pressed ? 0.2 : 1 },
                          {
                            position: "absolute",
                            left: "90%",
                            width: "10%",
                            height: "50%",
                            alignItems: "center"
                          }
                        ]}
                      >
                        <Icon name="xmark" size={25} color="#636e72" />
                      </Pressable>
                    </View>
                    {accountsSelected.length > 0 && (
                      <View
                        style={{
                          flexDirection: "column",
                          height: "auto",
                          width: "100%",
                          flexWrap: "wrap"
                        }}
                      >
                        <Text>{"Người tham gia: "}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                          }}
                        >
                          {accountsSelected.map((account) => {
                            return (
                              <PaperChip
                                style={{
                                  padding: 2,
                                  margin: 2
                                }}
                                key={account?.accountID}
                                // icon="account"
                                avatar={
                                  <Image
                                    source={{
                                      uri: account?.pictureURL
                                        ? account?.pictureURL
                                        : "https://picsum.photos/200/200"
                                    }}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 30
                                    }}
                                  />
                                }
                                onPress={() => {
                                  handleOnPressSelectedAccount(account);
                                }}
                                onClose={() => {
                                  hanleDeleteAnAccountSelected(account);
                                }}
                              >
                                {account?.accountName}
                              </PaperChip>
                            );
                          })}
                        </View>
                      </View>
                    )}
                    {isShowSearchResult && (
                      <View style={styles.view_SearchResult}>
                        <Text style={styles.text_LabelSearch}>
                          {"Kết quả tìm kiếm: " +
                            searchResult.length +
                            " người"}
                        </Text>
                        {searchResult[0]?.accountName && (
                          <FlatList
                            style={{
                              height: "auto"
                            }}
                            scrollEnabled={false}
                            data={searchResult}
                            keyExtractor={(item) => item?.accountID}
                            renderItem={({ item }) => {
                              return (
                                <Pressable
                                  onPress={() => {
                                    hanleSelectedAnAccount(item);
                                  }}
                                  style={({ pressed }) => [
                                    { opacity: pressed ? 0.2 : 1 },
                                    styles.pressable_Item_AccountSearch
                                  ]}
                                >
                                  <View
                                    style={
                                      styles.view_SearchResult_AnAccountItem_Infor
                                    }
                                  >
                                    <Image
                                      source={{
                                        uri: item?.pictureURL
                                          ? item?.pictureURL
                                          : "https://picsum.photos/200/200"
                                      }}
                                      style={styles.image_AnAvatar}
                                    />
                                    <View style={{ flexDirection: "column" }}>
                                      <Text
                                        style={{
                                          fontSize: 17,
                                          fontFamily: "OpenSans_500Medium"
                                        }}
                                      >
                                        {item?.accountName}
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: 13,
                                          fontFamily:
                                            "OpenSans_400Regular_Italic"
                                        }}
                                      >
                                        {item?.emailAddress}
                                      </Text>
                                    </View>
                                  </View>
                                  <Icon
                                    name="user-plus"
                                    size={20}
                                    color="#636e72"
                                  />
                                </Pressable>
                              );
                            }}
                          />
                        )}
                      </View>
                    )}
                  </View>
                  {!isShowSearchResult && (
                    <View
                      style={{
                        marginVertical: 5,
                        width: "95%",
                        height: "auto"
                      }}
                    >
                      <Text style={styles.textImageCover}>{"Ảnh bìa"}</Text>
                      {imageCover && (
                        <View>
                          {/* a pressable to remove imageCover */}
                          <Pressable
                            onPress={() => {
                              setImageCover(null);
                            }}
                            style={({ pressed }) => [
                              { opacity: pressed ? 0.2 : 1 },
                              {
                                position: "absolute",
                                top: 10,
                                right: 10,
                                zIndex: 10
                              }
                            ]}
                          >
                            <Icon name="xmark" size={20} color="#2d3436" />
                          </Pressable>
                          <Image
                            source={{ uri: imageCover.uri }}
                            style={{
                              width: "100%",
                              height: 200,
                              borderRadius: 10
                            }}
                          />
                        </View>
                      )}
                      <View style={styles.view_CameraOrMedia}>
                        <Pressable
                          style={({ pressed }) => [
                            { opacity: pressed ? 0.2 : 1 },
                            styles.pressable_CameraOrMedia
                          ]}
                          onPress={() => {
                            handlePickImage();
                          }}
                        >
                          <Icon name="images" size={35} color="#2d3436" />
                        </Pressable>
                        <Pressable
                          style={({ pressed }) => [
                            { opacity: pressed ? 0.2 : 1 },
                            styles.pressable_CameraOrMedia
                          ]}
                          onPress={() => {
                            handleLaunchCamera();
                          }}
                        >
                          <Icon name="camera" size={35} color="#2d3436" />
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              )}
              {!isShowSearchResult && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    alignSelf: "center"
                  }}
                >
                  {isModalNewCFVisible && (
                    // pressable to cancel create new CF
                    <Pressable
                      onPress={() => {
                        handleResetCreateNewCF();
                      }}
                      style={({ pressed }) => [
                        {
                          opacity: pressed ? 0.25 : 1
                        },
                        styles.pressable_ModalMenuContent_NewCF
                      ]}
                      // disabled={isAddingNewCF}
                    >
                      <Text style={styles.text_NewCF}>{"Hủy"}</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => {
                      handlePressNewCF();
                    }}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.25 : 1,
                        backgroundColor: "#dfe6e9"
                      },
                      styles.pressable_ModalMenuContent_NewCF
                    ]}
                    // disabled={isAddingNewCF}
                  >
                    <Text style={styles.text_NewCF}>
                      {"Tạo chi tiêu chung"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <Modal
        visible={isModalGuildlineCFVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.view_ModalMenu}>
          <Pressable
            style={{
              flex: 1
            }}
            onPress={() => {
              setIsModalGuildlineCFVisible(false);
            }}
          />
          <View
            style={[
              styles.view_ModalGuildlineCF,
              {
                height: heightScreen * 0.95,
                width: widthScreen,
                paddingHorizontal: 4
                // borderWidth: 1,
                // borderColor: "green"
              }
            ]}
          >
            <View
              style={[
                styles.view_GuildlineCF_Header,
                {
                  // flex: 1
                }
              ]}
            >
              <Text style={styles.text_GuildlineCF_Header}>
                {"Hướng dẫn tính năng chi tiêu chung"}
              </Text>
            </View>
            <View style={{ flex: 7 }}>
              <FlatList
                data={dataGuildlineCF}
                showsHorizontalScrollIndicator={true}
                indicatorStyle="black"
                horizontal={true}
                pagingEnabled={true}
                onScroll={(event) => {
                  let contentOffsetX = event.nativeEvent.contentOffset.x;
                  let viewSize = event.nativeEvent.layoutMeasurement.width;
                  let pageNum = Math.floor(contentOffsetX / viewSize);
                  setIndexGuildlineCF(pageNum);
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AnViewGuildLineCF data={item} />}
              />
            </View>
            {/* a view with text inside to show indexGuildLineCF */}
            <View style={styles.view_ShowPageGuildLineCF}>
              <Text style={styles.text_GuildlineCF}>
                {indexGuildlineCF + 1 + "/" + dataGuildlineCF.length}
              </Text>
            </View>
            <View style={styles.view_ModalGuildLineCF_Action}>
              <Pressable
                onPress={() => {
                  setIsModalGuildlineCFVisible(false);
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.25 : 1
                  },
                  styles.pressable_ModalMenuContent_NewCF
                ]}
              >
                <Text style={styles.text_NewCF}>{"Bỏ qua"}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsModalGuildlineCFVisible(false);
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.25 : 1,
                    backgroundColor: "#dfe6e9"
                  },
                  styles.pressable_ModalMenuContent_NewCF
                ]}
              >
                <Text style={styles.text_NewCF}>{"Tiếp"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pressable_AnCollabFundItemAction_Reject: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 5
  },
  pressable_AnCollabFundItemAction_Accept: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 5
  },
  view_ModalGuildLineCF_Action: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center"
  },
  view_ShowPageGuildLineCF: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 25,
    width: "100%",
    borderWidth: 1
  },
  view_AnGuildLineCF: {
    // width: widthScreen,
    height: "auto"
  },
  view_ModalGuildlineCF: {
    // marginHorizontal: 10,
    // marginVertical: 2,
    // width: "100%",
    // height: "95%",
    backgroundColor: "white"
    // paddingHorizontal: 5
  },
  view_GuildlineCF_Header: {
    width: "100%",
    marginVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#636e72"
  },
  text_GuildlineCF_Header: {
    fontSize: 22,
    fontFamily: "OpenSans_500Medium"
  },
  text_GuildlineCF: {
    fontSize: 20,
    fontFamily: "OpenSans_400Regular",
    color: "black"
  },
  text_LabelSearch: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular_Italic",
    marginHorizontal: 10
  },
  view_SearchResult: {
    width: "100%",
    height: "auto",
    borderWidth: 0.5,
    borderColor: "#636e72",
    borderRadius: 5,
    top: 0
  },
  image_AnAvatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginHorizontal: 2
  },
  view_SearchResult_AnAccountItem_Infor: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    flex: 2
  },
  pressable_Item_AccountSearch: {
    // width: "90%",
    flex: 1,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#636e72"
  },
  textImageCover: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular_Italic",
    marginHorizontal: 10
  },
  view_CameraOrMedia: {
    borderWidth: 0.5,
    borderColor: "#636e72",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center"
  },
  pressable_CameraOrMedia: {
    borderRadius: 5,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  view_NewCF: {
    width: "100%",
    height: "auto",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "flex-start",
    padding: 10
  },
  pressable_ModalMenuContent_GuildLineCF: {
    // position: "absolute",
    // alignSelf: "flex-end",
    // top: 10,
    // right: 30,
    flex: 0.5,
    marginHorizontal: 10,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // borderWidth: 1,
    paddingVertical: 10
  },
  text_NewCF: {
    fontSize: 20,
    fontFamily: "OpenSans_500Medium",
    color: "#2d3436"
  },
  pressable_ModalMenuContent_NewCF: {
    height: "auto",
    borderWidth: 0.25,
    borderColor: "#636e72",
    borderRadius: 5,
    marginTop: 30,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    padding: 5
  },
  pressable_MenuPress: {
    // padding: 10,
    // marginHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "gray",
    flex: 1,
    alignItems: "flex-end"
  },
  view_ModalMenuContent: {
    width: "100%",
    // flex: 1,
    // minHeight: "15%",
    // height: "auto",
    // maxHeight: "90%",
    flexDirection: "column",
    backgroundColor: "white",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    alignContent: "flex-start",
    borderRadius: 30,
    borderWidth: 0.25,
    borderColor: "darkgray"
  },
  view_ModalMenu: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  view_ScreenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    padding: 10
  },
  flatlist_collabfund: {
    width: "100%"
    // height: "100%",
    // flex: 1,
    // backgroundColor: "rgba(0,0,0,0.5)"
  },
  textCollabFundListHeader: {
    fontSize: 30,
    fontFamily: "OpenSans_500Medium",
    color: "black",
    textAlign: "center",
    marginVertical: 10
  },
  textAnCollabFundItemStatus: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular",
    color: "white"
  },
  pressableAnCollabFundItemDetail: {
    // backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5
    // borderRadius: 5
  },
  imageAccountInCollabFund: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginHorizontal: 2
  },
  viewCollabFundItemStatus: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center"
  },
  textCollabFundItemNote: {
    fontSize: 17,
    fontFamily: "Inconsolata_400Regular",
    color: "white"
  },
  viewCollabFundItemPartiesName: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5
  },
  viewCollabFundItemAction: {
    // width: "30%",
    flex: 4,
    justifyContent: "space-between",
    alignItems: "flex-end",
    alignContent: "flex-end"
  },
  viewCollabFundItemInfor: {
    // width: "70%",
    flex: 6,
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "space-between"
  },
  textCollabFundItemBalance: {
    fontSize: 25,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "right",
    color: "white"
  },
  // viewCollabFundItemHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   alignContent: "center",
  //   width: "100%"
  // },
  textCollabFundItemName: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium",
    color: "white",
    marginTop: 5,
    marginBottom: "10%"
  },
  imageBackgroundAnCollabFundItem: {
    width: "100%",
    minHeight: 100,
    height: "auto",
    maxHeight: 170,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    borderWidth: 0.25,
    borderColor: "darkgray",
    marginVertical: 5,
    borderRadius: 10
  },
  blurViewAnCollabFundItem: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "space-between"
  },
  pressableAnCollabFundItem: {
    width: "100%",
    height: "100%"
    // alignItems: "center",
    // justifyContent: "flex-start",
    // borderRadius: 10,
    // // marginVertical: 10,
    // padding: 10
    // backgroundColor: "rgba(0,0,0,0.2)"
  },
  containerCollabFundList: {
    flex: 1,
    backgroundColor: "white",
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // width: "100%",
    // height: "100%",
    padding: 10
    // borderWidth: 10,
    // borderColor: "red"
  },
  container: {
    // flex: 1,
    width: "100%",
    height: "100%",
    maxHeight: "90%",
    backgroundColor: "white"
    // alignItems: "center",
    // justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "darkgray"
  }
});

export default CollabFundScreen;

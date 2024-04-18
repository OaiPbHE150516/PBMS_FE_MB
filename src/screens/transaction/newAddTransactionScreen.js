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
// node_modules library
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import {
  Snackbar as PaperSnackBar,
  TextInput as PaperTextInput,
  ProgressBar as PaperProgressBar
} from "react-native-paper";
import { useNavigatio, useIsFocused } from "@react-navigation/native";

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import currencyLibrary from "../../library/currencyLIbrary";

// redux library
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../redux/dataSlice";
import axios from "axios";
import { API } from "../../constants/api.constant";

// services
import fileServices from "../../services/fileServices";
import categoryServices from "../../services/categoryServices";

// components
import NewModalCategoryComponent from "../../components/category/newModalCategoryComp";
import NewModalDateTimePicker from "../../components/calendar/newModalDateTimePicker";
import NewModalWalletComponent from "../../components/wallet/newModalWalletComp";

const NewAddTransactionScreen = ({ route }) => {
  const account = useSelector((state) => state.authen.account);
  const isFocused = useIsFocused();

  // use constants
  const navigation = useNavigation();

  // screen constants
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [placeHolder, setPlaceHolder] = useState(
    "0.000" + " " + currencyLibrary.getCurrencySymbol()
  );

  // screen states
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [isShowMoreDetail, setShowMoreDetail] = useState(false);
  const [isPossibleToAdd, setPossibleToAdd] = useState(false);
  const [isScanningInvoice, setScanningInvoice] = useState(true);
  const [loadingText, setLoadingText] = useState("Đang quét hóa đơn");
  const [progressLoading, setProgressLoading] = useState(0);

  // modal states
  const [iShowMenuModal, setShowMenuModal] = useState(false);
  const [isShowCategoryModal, setShowCategoryModal] = useState(false);
  const [isShowTimeModal, setShowTimeModal] = useState(false);
  const [isShowWalletModal, setShowWalletModal] = useState(false);
  const [isShowCameraModal, setShowCameraModal] = useState(false);

  // services variables
  const [categoryAdd, setCategoryAdd] = useState(null);
  const [timeAdd, setTimeAdd] = useState(null);
  const [walletAdd, setWalletAdd] = useState(null);
  const [addTransactionAmount, setAddTransactionAmount] = useState("");
  const [addTransactionNote, setAddTransactionNote] = useState("");

  // services functions
  function addTransaction() {
    console.log("Add transaction");
  }

  // sử dụng hàm đệ quy để tăng ngẫu nhiên giá trị của biến progressLoading từ 0.1 đến 0.9 trong 30s
  function increaseProgressLoading() {
    // return if !isScanningInvoice
    if (isScanningInvoice) {
      if (progressLoading < 0.9) {
        const increment = Math.random() * 0.1;
        console.log("increment: ", increment);
        setProgressLoading((prev) => prev + increment);
        setTimeout(increaseProgressLoading, 1000);
      }
    }
  }

  async function handleUploadToScanInvoice(asset) {
    setScanningInvoice(true);
    setProgressLoading(0);
    // increaseProgressLoading();

    const interval = setInterval(() => {
      setProgressLoading((prev) => {
        if (prev < 0.8) {
          return prev + Math.random() * 0.01;
        } else {
          return 0.8;
        }
      });
    }, 100);

    await fileServices
      .uploadToScanInvoiceV5({
        accountID: account?.accountID,
        asset: asset
      })
      .then((response) => {
        console.log("response: ", response);
      })
      .catch((error) => {
        console.log("Upload failed: ", error);
        Alert.alert("Upload failed");
      })
      .finally(() => {
        clearInterval(interval);
        // //make a interval progressLoading to 1 and clear interval
        const interval2 = setInterval(() => {
          setProgressLoading((prev) => {
            if (prev < 1) {
              //
              return prev + 1;
            } else {
              setScanningInvoice(false);
              console.log("Upload completed");
              clearInterval(interval2);
              return 1;
            }
          });
        }, 100);
      });
  }

  // use effect
  useEffect(() => {
    setTimeAdd(datetimeLibrary.getDateTimeNow());
  }, [isFocused]);

  useEffect(() => {
    checkPossibleToAdd();
  }, [addTransactionAmount, walletAdd, categoryAdd]);

  // screen functions
  function checkPossibleToAdd() {
    if (
      categoryAdd &&
      walletAdd &&
      addTransactionAmount &&
      convertStringToInt(addTransactionAmount) > 0
    ) {
      console.log("true: ", addTransactionAmount);
      setPossibleToAdd(true);
    } else {
      console.log("false: ", addTransactionAmount);
      setPossibleToAdd(false);
    }
  }

  async function handleOnPickMedia() {
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
      setShowCameraModal(false);
      handleUploadToScanInvoice(result.assets[0]);
    }
  }

  async function handleOnLaunchCamera() {
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
      setShowCameraModal(false);
      handleUploadToScanInvoice(result.assets[0]);
    }
  }

  function onCallbackCategory(data) {
    setShowCategoryModal(false);
    console.log("Category data: ", data);
    setCategoryAdd(data);
    // checkPossibleToAdd();
  }

  function onCallbackTime(data) {
    setShowTimeModal(false);
    console.log("Time data: ", data);
    setTimeAdd(data);
    // checkPossibleToAdd();
  }

  function onCallbackWallet(data) {
    setShowWalletModal(false);
    console.log("Wallet data: ", data);
    setWalletAdd(data);
    // checkPossibleToAdd();
  }

  function onChangeTextTransactionAmount(text) {
    const formattedNumber = text
      .replace(/\./g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAddTransactionAmount(formattedNumber);
    checkPossibleToAdd();
  }

  // function to remove '.' from string and parse to integer
  function convertStringToInt(str) {
    return parseInt(str.replace(/\./g, ""));
  }

  function handleResetAddTransaction() {
    setCategoryAdd(null);
    setTimeAdd(datetimeLibrary.getDateTimeNow());
    setWalletAdd(null);
    setAddTransactionAmount("");
    setAddTransactionNote("");
    setPossibleToAdd(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardHeight}
    >
      <View style={styles.viewTopHeader}>
        <View style={styles.view_TextHeader}>
          <Text style={styles.textTopHeader}>{"Thêm giao dịch mới"}</Text>
        </View>
        <Pressable
          onPress={() => {
            setShowMenuModal(true);
          }}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1
            },
            styles.pressable_Menu
          ]}
        >
          <Icon name="ellipsis-vertical" size={30} color="black" />
        </Pressable>
      </View>
      <ScrollView style={styles.view_MainContent}>
        <View style={styles.view_Select_Popup}>
          <View style={styles.view_Select_Popup_Icon}>
            <Icon name="money-bill-transfer" size={30} color="#636e72" />
          </View>
          <View style={styles.view_Select_Popup_Right}>
            <PaperTextInput
              style={styles.view_Select_Popup_TextInput}
              placeholder={placeHolder}
              value={addTransactionAmount}
              keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
              onChangeText={(text) => {
                onChangeTextTransactionAmount(text);
              }}
              onFocus={() => {
                setPlaceHolder("");
              }}
              onBlur={() => {
                setPlaceHolder(
                  "0.000" + " " + currencyLibrary.getCurrencySymbol()
                );
              }}
            />
          </View>
        </View>
        <View style={styles.view_Select_Popup}>
          <View style={styles.view_Select_Popup_Icon}>
            <Icon name="layer-group" size={30} color="#636e72" />
          </View>
          <Pressable
            onPress={() => {
              setShowCategoryModal(true);
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1
              },
              styles.pressable_Select_Popup_Right
            ]}
          >
            <Text style={[styles.view_Select_Popup_Text, { fontSize: 25 }]}>
              {categoryAdd ? categoryAdd.nameVN : "Chọn hạng mục"}
            </Text>
            <Icon
              name="chevron-right"
              size={25}
              color="#636e72"
              style={styles.icon_ChevronRight}
            />
          </Pressable>
        </View>
        <View style={styles.view_Select_Popup}>
          <View style={styles.view_Select_Popup_Icon}>
            <Icon name="calendar" size={30} color="#636e72" />
          </View>
          <Pressable
            onPress={() => {
              setShowTimeModal(true);
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1
              },
              styles.pressable_Select_Popup_Right
            ]}
          >
            <Text style={[styles.view_Select_Popup_Text, { fontSize: 25 }]}>
              {timeAdd
                ? datetimeLibrary.convertToDateTimeStr(
                    timeAdd.hour,
                    timeAdd.minute,
                    timeAdd.day,
                    timeAdd.month,
                    timeAdd.year
                  )
                : "Chọn thời gian"}
              {/* {categoryAdd ? categoryAdd.nameVN : "Chọn time"} */}
            </Text>
            <Icon
              name="chevron-right"
              size={25}
              color="#636e72"
              style={styles.icon_ChevronRight}
            />
          </Pressable>
        </View>
        <View style={styles.view_Select_Popup}>
          <View style={styles.view_Select_Popup_Icon}>
            <Icon name="wallet" size={30} color="#636e72" />
          </View>
          <Pressable
            onPress={() => {
              setShowWalletModal(true);
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1
              },
              styles.pressable_Select_Popup_Right
            ]}
          >
            <Text style={[styles.view_Select_Popup_Text, { fontSize: 25 }]}>
              {walletAdd ? walletAdd.name : "Chọn ví"}
            </Text>
            <Icon
              name="chevron-right"
              size={25}
              color="#636e72"
              style={styles.icon_ChevronRight}
            />
          </Pressable>
        </View>
        {isShowMoreDetail && (
          <View style={styles.viewMoreDetail}>
            <View style={styles.view_AddTransaction_Note}>
              <TextInput
                style={[styles.textinput_AddTransaction_Note]}
                placeholder="Ghi chú"
                editable={true}
                multiline={true}
                numberOfLines={5}
                textAlign="left"
                textAlignVertical="top"
                value={addTransactionNote}
                onChangeText={(text) => {
                  setAddTransactionNote(text);
                }}
              />
            </View>
          </View>
        )}
        <Pressable
          onPress={() => {
            setShowMoreDetail(!isShowMoreDetail);
          }}
          style={styles.pressMoreDetail}
        >
          <Text style={styles.textMoreDetail}>
            {isShowMoreDetail ? "Ẩn chi tiết" : "Thêm chi tiết"}
          </Text>
          <Icon
            name={isShowMoreDetail ? "chevron-up" : "chevron-down"}
            size={20}
            color="darkgrey"
          />
        </Pressable>
        {isScanningInvoice && (
          <View style={[styles.view_Loading, { height: 150 }]}>
            <Image
              source={require("../../../assets/images/logo.png")}
              style={{
                width: 75,
                height: 75,
                resizeMode: "contain",
                alignSelf: "center"
              }}
            />
            <View style={styles.view_Loading_Text}>
              <Text style={styles.text_Loading}>{loadingText}</Text>
              <Image
                source={require("../../../assets/images/loading.gif")}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: "contain",
                  alignSelf: "center"
                }}
              />
            </View>
            <View style={{ width: "100%", height: 50 }}>
              <PaperProgressBar progress={progressLoading} color="#0984e3" />
            </View>
          </View>
        )}
      </ScrollView>
      <BlurView intensity={20} style={styles.viewPressableAction}>
        <Pressable
          style={styles.pressableReset}
          onPress={() => {
            handleResetAddTransaction();
          }}
        >
          <Text>{"Reset"}</Text>
        </Pressable>
        <View style={styles.viewTakeCamera}>
          <Pressable
            style={[styles.pressableTakeCamera, { borderColor: "#74b9ff" }]}
            onPress={() => {
              setShowCameraModal(true);
            }}
          >
            <Icon name="camera" size={30} color="#0984e3" />
          </Pressable>
        </View>
        <View style={styles.viewAddTransaction}>
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
                backgroundColor: isPossibleToAdd ? "#b2bec3" : "white"
              },
              styles.pressable_SaveTransaction
            ]}
            onPress={() => {
              addTransaction();
            }}
            disabled={!isPossibleToAdd}
          >
            <Text style={styles.textButtonSave}>{"Lưu"}</Text>
          </Pressable>
        </View>
      </BlurView>

      {/* Modal Section */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isShowCategoryModal}
      >
        <View style={styles.view_Modal_Background}>
          <Pressable
            onPress={() => {
              setShowCategoryModal(false);
            }}
            style={styles.pressable_CloseModal}
          />
          <View style={[styles.view_ModalContent, { flex: 3 }]}>
            <NewModalCategoryComponent
              callback={onCallbackCategory}
              selected={categoryAdd}
            />
          </View>
          <Pressable
            onPress={() => {
              setShowCategoryModal(false);
            }}
            style={styles.pressable_CloseModal}
          />
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={isShowTimeModal}>
        <View style={styles.view_Modal_Background}>
          <View
            style={[
              styles.view_ModalContent,
              { flex: 1, backgroundColor: "transparent" }
            ]}
          >
            <NewModalDateTimePicker
              callback={onCallbackTime}
              selected={timeAdd}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isShowWalletModal}
      >
        <View style={styles.view_Modal_Background}>
          <Pressable
            onPress={() => {
              setShowWalletModal(false);
            }}
            style={styles.pressable_CloseModal}
          />
          <View style={[styles.view_ModalContent, { flex: 2 }]}>
            <NewModalWalletComponent
              callback={onCallbackWallet}
              selected={walletAdd}
            />
          </View>
          <Pressable
            onPress={() => {
              setShowWalletModal(false);
            }}
            style={styles.pressable_CloseModal}
          />
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isShowCameraModal}
      >
        <View style={styles.view_Modal_Background}>
          <Pressable
            onPress={() => {
              setShowCameraModal(false);
            }}
            style={styles.pressable_CloseModal}
          />
          <View style={styles.view_Modal_TakeCamera}>
            <Pressable
              style={styles.pressableActionUserActionable}
              onPressIn={() => {
                handleOnPickMedia();
                // setIsModalMediaCameraVisible(!isModalMediaCameraVisible);
              }}
            >
              <Icon name="images" size={50} color="darkgray" />
              <Text style={styles.textLabelActionable}>{"Thư viện"}</Text>
            </Pressable>
            <Pressable
              style={styles.pressableActionUserActionable}
              onPressIn={() => {
                handleOnLaunchCamera();
                // setIsModalMediaCameraVisible(!isModalMediaCameraVisible);
              }}
            >
              <Icon name="camera" size={50} color="darkgray" />
              <Text style={styles.textLabelActionable}>{"Máy ảnh"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  view_Loading_Text: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row"
  },
  view_Loading: {
    width: "98%",
    flex: 1,
    borderWidth: 1,
    borderColor: "darkgray",
    alignSelf: "center",
    position: "relative",
    marginHorizontal: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  text_Loading: {
    fontSize: 20,
    fontFamily: "OpenSans_400Regular"
  },
  textLabelActionable: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular",
    marginVertical: 10,
    alignSelf: "flex-end"
  },
  pressableActionUserActionable: {
    padding: 5,
    // marginHorizontal: 2,
    borderRadius: 5,
    // backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center"
    // width: 35,
    // height: 35
  },
  view_Modal_TakeCamera: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    padding: 5,
    // marginBottom: 20,
    borderRadius: 10,
    width: "100%",
    height: "15%"
  },
  textinput_AddTransaction_Note: {
    width: "100%",
    height: 150,
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    fontSize: 20,
    fontFamily: "OpenSans_400Regular"
  },
  view_AddTransaction_Note: {
    flexDirection: "row",
    padding: 5
  },
  viewPressableMoreDetail: {
    width: "98%"
    // height: "50%"
  },
  textMoreDetail: {
    fontSize: 22,
    fontFamily: "OpenSans_400Regular",
    marginHorizontal: 10,
    color: "darkgrey"
  },
  pressMoreDetail: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 10
    // borderColor: "red",
    // borderWidth: 1,
    // marginHorizontal: 10
  },
  viewMoreDetail: {
    flexDirection: "column"
    // justifyContent: "space-between",
    // alignItems: "center",
    // marginVertical: 5,
    // marginHorizontal: 5,
    // borderColor: "green",
    // borderWidth: 1,
    // padding: 0,
    // height: Dimensions.get("screen").height * 0.2,
    // flex: 1,
  },
  viewPressableAction: {
    width: "98%",
    // borderColor: "red",
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    paddingHorizontal: "5%",
    bottom: "11%"
  },
  pressableReset: {
    borderRadius: 10,
    padding: 10,
    // elevation: 2,
    // backgroundColor: "lightgray",
    borderColor: "darkgray",
    borderWidth: 1,
    width: 100,
    height: "auto",
    alignItems: "center"
  },
  viewTakeCamera: {
    // width: "100%",
    // height: "8%"
    // marginVertical: 10
  },
  pressableTakeCamera: {
    width: 100,
    height: 50,
    borderRadius: 20,
    // backgroundColor: "#fab1a0",
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "#74b9ff",
    borderWidth: 1
    // shadow
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // elevation: 5
  },
  viewAddTransaction: {
    // width: "100%"
    // marginVertical: 15
  },
  pressable_SaveTransaction: {
    borderRadius: 10,
    padding: 10,
    // elevation: 2,
    // backgroundColor: "lightgray",
    borderColor: "darkgray",
    borderWidth: 1,
    width: "auto",
    width: 100,
    alignItems: "center"
    // height: "50%",
  },
  textButtonSave: {
    fontFamily: "Inconsolata_500Medium",
    fontSize: 20
  },
  view_Modal_Background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  pressable_CloseModal: {
    width: "100%",
    flex: 1
  },
  view_ModalContent: {
    backgroundColor: "white",
    width: "100%",
    borderWidth: 0.25,
    borderColor: "darkgray",
    borderRadius: 20
    // flex: 5
  },
  icon_ChevronRight: {
    // marginHorizontal: 10,
    marginVertical: 5
  },
  pressable_Select_Popup_Right: {
    width: "85%",
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    alignContent: "center",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 5,
    paddingHorizontal: 10
    // borderWidth: 1,
    // borderColor: "red"
  },
  view_Select_Popup_Text: {
    // width: "100%",
    // position: "absolute",
    alignContent: "flex-end",
    alignItems: "flex-end",
    // textAlign: "right",
    backgroundColor: "white",
    fontSize: 30,
    fontFamily: "OpenSans_400Regular"
    // borderWidth: 1
  },
  view_Select_Popup_Icon_Right: {
    position: "absolute",
    right: 10,
    zIndex: 10
  },
  view_Select_Popup_TextInput: {
    flex: 1,
    marginRight: 5,
    textAlign: "right",
    backgroundColor: "white",
    fontSize: 40,
    fontFamily: "OpenSans_500Medium"
  },
  view_Select_Popup_Right: {
    width: "85%"
  },
  view_Select_Popup_Icon: {
    width: "15%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  view_Select_Popup: {
    width: "100%",
    // height: 50,
    backgroundColor: "white",
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10
  },
  view_MainContent: {
    flex: 1,
    // borderWidth: 10,
    // borderColor: "darkgray",
    width: "100%",
    backgroundColor: "white",
    alignContent: "center"
  },
  view_TextHeader: {
    // flex: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute"
  },
  pressable_Menu: {
    width: "20%",
    alignItems: "flex-end",
    alignContent: "center",
    alignSelf: "flex-end",
    position: "absolute",
    margin: 10,
    right: 0,
    top: 0
    // borderWidth: 1,
    // borderColor: "black"
  },
  viewTopHeader: {
    width: "100%",
    height: 50,
    borderBottomColor: "darkgrey",
    borderBottomWidth: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row"
  },
  textTopHeader: {
    fontSize: 30,
    fontFamily: "OpenSans_500Medium"
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    alignContent: "center",
    width: "100%",
    height: "100%"
  }
});

export default NewAddTransactionScreen;

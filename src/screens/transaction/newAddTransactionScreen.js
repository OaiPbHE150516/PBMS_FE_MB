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
import fileLibrary from "../../library/fileLibrary";

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
import AnInputInvoiceScanning from "../../components/transaction/anInputInvoiceScanning";
import AnInputProductInIS from "../../components/transaction/anInputProductInIS";
import transactionServices from "../../services/transactionServices";
import OnboardingModalComp from "../../components/noti/onboardingModalComp";

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
  const LOGO_URL = "../../../assets/images/logo.png";
  const PROCESSING_TEXT = "Hóa đơn của bạn đang được xử lý ...";
  const PROCESSING_TEXT_TIME = "Việc này có thể mất khoảng 10s";
  const SNACKBAR_COLOR_SUCCESS = "#00b894";
  const SNACKBAR_COLOR_FAIL = "#fab1a0";

  // screen states
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(SNACKBAR_COLOR_SUCCESS);
  const [isShowMoreDetail, setShowMoreDetail] = useState(false);
  const [isPossibleToAdd, setPossibleToAdd] = useState(false);
  const [isScanningInvoice, setScanningInvoice] = useState(false);
  const [isShowingProcessing, setShowingProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState(PROCESSING_TEXT);
  const [progressLoading, setProgressLoading] = useState(0);
  const [assetShowing, setAssetShowing] = useState(null);
  const [isShowingOnboardingModal, setShowingOnboardingModal] = useState(false);

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
  const [invoiceResult, setInvoiceResult] = useState(null);
  const [isAddingTransaction, setAddingTransaction] = useState(false);

  // services functions
  async function addTransaction() {
    if (!account?.accountID) {
      // Alert.alert("Lỗi", "Không tìm thấy tài khoản");
      showSnackbar("Không tìm thấy tài khoản", SNACKBAR_COLOR_FAIL);
      return;
    }
    setAddingTransaction(true);
    let amountTransaction = convertStringToNumber(addTransactionAmount);
    console.log("Add transaction amount: ", amountTransaction);
    console.log("Add transaction category: ", categoryAdd);
    let timeStr = convertTimeAddToString(timeAdd);
    console.log("Add transaction timeStr: ", timeStr);
    console.log("Add transaction wallet: ", walletAdd);
    if (invoiceResult) {
      const filename =
        account?.accountID + "_" + datetimeLibrary.getCurrentTimeStr();

      await uploadInvoiceToAPI({
        asset: assetShowing,
        filenamecustom: filename,
        accountID: account?.accountID
      }).then(async (response) => {
        console.log("fileURL: ", response);
        const totalOfInvoice = convertStringToNumber(
          invoiceResult?.totalAmount
        );
        const transactionWithInvoice = {
          accountID: account?.accountID,
          walletID: walletAdd?.walletID,
          categoryID: categoryAdd?.categoryID,
          totalAmount: amountTransaction,
          transactionDate: timeStr,
          note: addTransactionNote,
          fromPerson: invoiceResult.supplierName ?? "",
          toPerson: invoiceResult.receiverName ?? "",
          imageURL: response,
          invoice: {
            supplierAddress: invoiceResult.supplierAddress ?? "",
            supplierEmail: invoiceResult.supplierEmail ?? "",
            supplierName: invoiceResult.supplierName ?? "",
            supplierPhone: invoiceResult.supplierPhone ?? "",
            idOfInvoice: invoiceResult.idOfInvoice ?? "",
            invoiceDate: invoiceResult.invoiceDate ?? "",
            netAmount: invoiceResult.netAmount ?? 0,
            totalAmount: totalOfInvoice,
            taxAmount: invoiceResult.taxAmount ?? 0,
            invoiceImageURL: response,
            note: invoiceResult.note ?? "",
            products: [
              ...invoiceResult.productInInvoices.map((it) => {
                return {
                  productName: it.productName ?? "",
                  quanity: it.quanity ?? 0,
                  unitPrice: it.unitPrice ?? 0,
                  totalAmount: it.totalAmount ?? 0,
                  note: it.note ? it.note : "",
                  tag: it.tag ?? ""
                };
              })
            ]
          }
        };
        console.log("transactionWithInvoice: ", transactionWithInvoice);
        console.log("invoice: ", transactionWithInvoice.invoice);
        await transactionServices
          .addTransactionWithInvoice(transactionWithInvoice)
          .then((response) => {
            console.log("addTransactionWithInvoice response: ", response);
            if (response) {
              // Alert.alert("Thành công", "Thêm giao dịch thành công");
              handleResetAddTransaction();
              showSnackbar("Thêm giao dịch thành công", SNACKBAR_COLOR_SUCCESS);
            }
          })
          .catch((error) => {
            console.log("addTransactionWithInvoice error: ", error);
            // Alert.alert("Lỗi", "Thêm giao dịch thất bại");
            showSnackbar("Thêm giao dịch thất bại", SNACKBAR_COLOR_FAIL);
          });
      });
    } else {
      const data = {
        accountID: account?.accountID,
        walletID: walletAdd?.walletID,
        categoryID: categoryAdd?.categoryID,
        totalAmount: amountTransaction,
        transactionDate: timeStr,
        note: addTransactionNote,
        fromPerson: "",
        toPerson: "",
        imageURL: ""
      };
      await transactionServices
        .addTransactionNoInvoice(data)
        .then((response) => {
          console.log("addTransactionNoInvoice response: ", response);
          if (response) {
            // Alert.alert("Thành công", "Thêm giao dịch thành công");
            handleResetAddTransaction();
            showSnackbar("Thêm giao dịch thành công", SNACKBAR_COLOR_SUCCESS);
          }
        })
        .catch((error) => {
          console.log("addTransactionNoInvoice error: ", error);
          // Alert.alert("Lỗi", "Thêm giao dịch thất bại");
          showSnackbar("Thêm giao dịch thất bại", SNACKBAR_COLOR_FAIL);
        });
    }
    setAddingTransaction(false);
  }

  async function uploadInvoiceToAPI({ asset, filenamecustom, accountID }) {
    const urlapi = API.FILE.UPLOAD_INVOICE_OF_TRANSACTION_FILE_NAME;
    const formData = new FormData();
    formData.append("file", fileLibrary.getFileData(asset));
    formData.append("filename", filenamecustom);
    formData.append("accountID", accountID);
    let fileURL = "";
    await axios({
      method: "post",
      url: urlapi,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then((response) => {
        if (response) {
          console.log("uploadInvoiceToAPI response.data: ", response?.data);
          fileURL = response?.data;
        }
      })
      .catch((error) => {
        console.log("uploadInvoiceToAPI data:", error);
        // Alert.alert("Lỗi", "Upload hóa đơn thất bại");
        showSnackbar("Upload hóa đơn thất bại", SNACKBAR_COLOR_FAIL);
      });
    return fileURL;
  }

  async function handleUploadToScanInvoice(asset) {
    console.log("handleUploadToScanInvoice asset: ", asset);
    setScanningInvoice(true);
    setShowingProcessing(true);
    setProgressLoading(0);
    setLoadingText(PROCESSING_TEXT);
    // increaseProgressLoading();

    const interval = setInterval(() => {
      setProgressLoading((prev) => {
        if (prev < 0.95) {
          return prev + Math.random() * 0.01;
        } else {
          return 0.95;
        }
      });
    }, 100);

    // const interval2 = setInterval(() => {
    //   // clear interval2 if isScanningInvoice is false
    //   if (!isScanningInvoice) {
    //     clearInterval(interval2);
    //   }
    //   // change Loading text from PROCESSING_TEXT to PROCESSING_TEXT_TIME and reverse
    //   setLoadingText((prev) => {
    //     if (prev === PROCESSING_TEXT) {
    //       return PROCESSING_TEXT_TIME;
    //     } else {
    //       return PROCESSING_TEXT;
    //     }
    //   });
    // }, 9500);

    try {
      // const urlapi = API.INVOICE.TEST;
      const urlapi = API.INVOICE.SCAN_V5;
      const formData = new FormData();
      formData.append("file", fileLibrary.getFileData(asset));
      formData.append("accountID", account?.accountID);
      await axios({
        method: "post",
        url: urlapi,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          console.log(
            "Upload Progress: " +
              Math.round((progressEvent.loaded / progressEvent.total) * 100) +
              "%"
          );
        }
      })
        .then((response) => {
          if (response) {
            console.log(
              "uploadToScanInvoice response.data: ",
              response?.data?.invoice
            );
            if (response?.data) {
              if (response?.data?.invoice) {
                // console.log("uploadToScanInvoice response.data.invoice: ", response?.data?.invoice);
                // setCategoryAdd(response.data.invoice.category);
                // setWalletAdd(response.data.invoice.wallet);
                // setAddTransactionAmount(response.data.invoice.amountStr);
                // setAddTransactionNote(response.data.invoice.note);
                setInvoiceResult(response?.data?.invoice);
                onChangeTextTransactionAmount(
                  response?.data?.invoice?.totalAmount?.toString()
                );
              }
              if (response?.data?.timeProcess) {
                setLoadingText(
                  "Thời gian xử lý: " +
                    datetimeLibrary.convertToSecond(response?.data?.timeProcess)
                );
              }
            }
          }
        })
        .catch((error) => {
          console.log("uploadToScanInvoice data:", error);
          // Alert.alert("Lỗi", "Upload hóa đơn thất bại");
          showSnackbar("Upload hóa đơn thất bại", SNACKBAR_COLOR_FAIL);
        })
        .finally(() => {
          clearInterval(interval);
          // //make a interval progressLoading to 1 and clear interval
          const interval3 = setInterval(() => {
            setProgressLoading((prev) => {
              if (prev < 1) {
                //
                return prev + 1;
              } else {
                setScanningInvoice(false);
                // setTimeout(() => {
                //   setShowingProcessing(false);
                // }, 15000);
                clearInterval(interval3);
                return 1;
              }
            });
          }, 100);
        });
    } catch (error) {
      console.log("Upload failed: ", error);
      // Alert.alert("Lỗi", "Upload hóa đơn thất bại");
      showSnackbar("Upload hóa đơn thất bại", SNACKBAR_COLOR_FAIL);
    }
  }

  // use effect
  useEffect(() => {
    setTimeAdd(datetimeLibrary.getDateTimeNow());
  }, [isFocused]);

  useEffect(() => {
    checkPossibleToAdd();
  }, [addTransactionAmount, walletAdd, categoryAdd, isAddingTransaction]);

  // screen functions
  function checkPossibleToAdd() {
    // log all variables
    console.log("categoryAdd: ", categoryAdd);
    console.log("walletAdd: ", walletAdd);
    console.log("isAddingTransaction: ", isAddingTransaction);
    console.log("addTransactionAmount: ", addTransactionAmount);
    if (
      categoryAdd &&
      walletAdd &&
      !isAddingTransaction &&
      addTransactionAmount &&
      convertStringToNumber(addTransactionAmount) > 0
    ) {
      console.log("checkPossibleToAdd true: ", addTransactionAmount);
      setPossibleToAdd(true);
    } else {
      console.log("checkPossibleToAdd false: ", addTransactionAmount);
      setPossibleToAdd(false);
    }
  }

  function showSnackbar(content, color) {
    setSnackbarContent(content);
    if (!color) {
      color = SNACKBAR_COLOR_FAIL;
    }
    setSnackbarColor(color);
    setIsSnackBarVisible(true);
    setTimeout(() => {
      setIsSnackBarVisible(false);
    }, 2000);
  }

  async function handleOnPickMedia() {
    // Kiểm tra quyền trước khi truy cập vào album ảnh
    const mediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (mediaPermission.status !== "granted") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        Alert.alert("Lỗi", "Không được cấp quyền truy cập vào thư viện ảnh");
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
      setAssetShowing(result.assets[0]);
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
        Alert.alert("Lỗi", "Không được cấp quyền truy cập vào máy ảnh");
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
      setAssetShowing(result.assets[0]);
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

  // function convert timeAdd to string like "2021-09-01T12:00:000Z"
  function convertTimeAddToString(time) {
    // if any < 10, then add '0' before it
    let hourStr = time.hour < 10 ? "0" + time.hour : time.hour;
    let minuteStr = time.minute < 10 ? "0" + time.minute : time.minute;
    let dayStr = time.day < 10 ? "0" + time.day : time.day;
    let monthStr = time.month < 10 ? "0" + time.month : time.month;
    return (
      time.year +
      "-" +
      monthStr +
      "-" +
      dayStr +
      "T" +
      hourStr +
      ":" +
      minuteStr +
      ":00.000Z"
    );
  }

  function handleChangeProductInInvoice({ newItem }) {
    console.log("handleChangeProductInInvoice newItem: ", newItem);
    setInvoiceResult({
      ...invoiceResult,
      productInInvoices: invoiceResult?.productInInvoices?.map((it) =>
        it.productID === newItem.productID
          ? {
              ...it,
              productName: newItem.productName,
              quanity: newItem.quanity,
              unitprice: convertNumberToString(newItem.unitPrice),
              totalAmount: convertNumberToString(newItem.totalAmount)
            }
          : it
      )
    });
  }

  function handleResetAddTransaction() {
    setCategoryAdd(null);
    setTimeAdd(datetimeLibrary.getDateTimeNow());
    setWalletAdd(null);
    setAddTransactionAmount("");
    setAddTransactionNote("");
    setPossibleToAdd(false);
    setAssetShowing(null);
    setShowingProcessing(false);
    setScanningInvoice(false);
    setInvoiceResult(null);
    setAddingTransaction(false);
  }

  const handleCallbackOnboarding = () => {
    setShowingOnboardingModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardHeight}
    >
      <View style={styles.viewTopHeader}>
        <View style={styles.view_TextHeader}>
          <Text style={styles.textTopHeader}>{"Thêm giao dịch mới"}</Text>
          <Pressable
            onPress={() => {
              setShowingOnboardingModal(true);
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.25 : 1
              },
              styles.pressable_ModalOnboarding
            ]}
          >
            <Icon name="circle-info" size={20} color="#74b9ff" />
          </Pressable>
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
          <Icon name="bars" size={30} color="#636e72" />
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
              <PaperTextInput
                style={[styles.textinput_AddTransaction_Note]}
                mode="outlined"
                label={"Ghi chú"}
                placeholder="Ghi chú thêm, ví dụ: mua sữa, mua bánh mì, ..."
                editable={true}
                multiline={true}
                numberOfLines={5}
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
        {isShowingProcessing && (
          <View style={[styles.view_Loading, { height: "auto" }]}>
            <Image
              source={require(LOGO_URL)}
              style={styles.image_Logo_Loading}
            />
            <View style={styles.view_Loading_Text}>
              <Text
                style={[
                  styles.text_Loading,
                  {
                    flexWrap: "wrap"
                  }
                ]}
              >
                {loadingText}
              </Text>
              {isScanningInvoice && (
                <View style={styles.view_ProgressLoading}>
                  <View
                    style={{
                      width: "80%",
                      height: "auto"
                    }}
                  >
                    <PaperProgressBar
                      progress={progressLoading}
                      color="#0984e3"
                    />
                  </View>
                  <View>
                    <Text style={styles.text_ProgressLoading}>
                      {Math.round(progressLoading * 100)}
                      {"%"}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            {!isScanningInvoice && (
              <Pressable
                onPress={() => {
                  handleUploadToScanInvoice(assetShowing);
                }}
                style={styles.pressableActionUserActionable}
              >
                <Icon name="arrow-rotate-right" size={25} color="lightgray" />
              </Pressable>
            )}
          </View>
        )}
        {invoiceResult && !isScanningInvoice && (
          <View style={styles.viewInvoiceScanning}>
            <View style={styles.viewChildIS}>
              <Text style={styles.textHeaderViewChildIS}>{"Hóa đơn"}</Text>
              <AnInputInvoiceScanning
                isHasIcon={true}
                textLabelTop="Tổng tiền"
                value={invoiceResult?.totalAmount.toString()}
                onChangeText={(text) => {
                  setInvoiceResult({ ...invoiceResult, totalAmount: text });
                }}
                keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
              />
              <AnInputInvoiceScanning
                isHasIcon={true}
                textLabelTop="Số"
                value={invoiceResult?.idOfInvoice}
                onChangeText={(text) => {
                  setInvoiceResult({ ...invoiceResult, idOfInvoice: text });
                }}
              />
              <AnInputInvoiceScanning
                isHasIcon={true}
                textLabelTop="Ngày"
                value={invoiceResult?.invoiceDate}
                onChangeText={(text) => {
                  setInvoiceResult({ ...invoiceResult, invoiceDate: text });
                }}
              />
            </View>
            <View style={styles.viewChildIS}>
              <Text style={styles.textHeaderViewChildIS}>
                {"Đơn vị cung cấp"}
              </Text>
              <AnInputInvoiceScanning
                isHasIcon={true}
                textLabelTop="Tên"
                value={invoiceResult?.supplierName}
                onChangeText={(text) => {
                  setInvoiceResult({ ...invoiceResult, supplierName: text });
                }}
              />
              <AnInputInvoiceScanning
                isHasIcon={true}
                textLabelTop="Địa chỉ"
                value={invoiceResult?.supplierAddress}
                onChangeText={(text) => {
                  setInvoiceResult({
                    ...invoiceResult,
                    supplierAddress: text
                  });
                }}
              />
              <AnInputInvoiceScanning
                isHasIcon={true}
                textLabelTop="Số điện thoại"
                value={invoiceResult?.supplierPhone}
                onChangeText={(text) => {
                  setInvoiceResult({ ...invoiceResult, supplierPhone: text });
                }}
              />
            </View>
            <View style={styles.viewChildIS}>
              <Text style={styles.textHeaderViewChildIS}>{"Sản phẩm"}</Text>
              <FlatList
                nestedScrollEnabled={true}
                scrollEnabled={false}
                data={invoiceResult?.productInInvoices}
                keyExtractor={(item) => item.productID}
                renderItem={({ item }) => (
                  <AnInputProductInIS
                    editable={true}
                    name={item?.productName}
                    unitprice={convertNumberToString(
                      item?.unitPrice?.toString()
                    )}
                    tag={item?.tag?.toString()}
                    quanity={item?.quanity?.toString()}
                    amount={convertNumberToString(
                      item?.totalAmount?.toString()
                    )}
                    onChangeTextName={(text) => {
                      let newItem = item;
                      newItem.productName = text;
                      handleChangeProductInInvoice({ newItem });
                    }}
                    onChangeTextQuanity={(text) => {
                      let newItem = item;
                      newItem.quanity = text;
                      handleChangeProductInInvoice({ newItem });
                    }}
                    onChangeTextUnitPrice={(text) => {
                      let newItem = item;
                      newItem.unitPrice = text;
                      handleChangeProductInInvoice({ newItem });
                    }}
                    // same with onChangeTextTag
                    onChangeTextTag={(text) => {
                      let newItem = item;
                      newItem.tag = text;
                      handleChangeProductInInvoice({ newItem });
                    }}
                    onChangeTextAmount={(text) => {
                      let newItem = item;
                      newItem.totalAmount = text;
                      handleChangeProductInInvoice({ newItem });
                    }}
                  />
                )}
              />
            </View>
          </View>
        )}
        <View style={[styles.viewAssetShowing, {}]}>
          {assetShowing && (
            <Image
              source={{ uri: assetShowing.uri }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          )}
        </View>
        {/* add footer to scrollview */}
        <View style={{ height: 200 }} />
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
                backgroundColor: isPossibleToAdd ? "#b2bec3" : "transparent"
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

      <PaperSnackBar
        style={{ backgroundColor: snackbarColor, bottom: "70%" }}
        visible={isSnackBarVisible}
        onDismiss={() => setIsSnackBarVisible(false)}
        action={{
          label: "Xem",
          onPress: () => {
            navigation.navigate("Transaction");
          }
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontFamily: "OpenSans_500Medium",
            color: "white"
          }}
        >
          {snackbarContent}
        </Text>
      </PaperSnackBar>
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
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.5 : 1
                },
                styles.pressableActionUserActionable
              ]}
              onPressIn={() => {
                handleOnPickMedia();
              }}
            >
              <Icon name="images" size={50} color="darkgray" />
              <Text style={styles.textLabelActionable}>{"Thư viện"}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.5 : 1
                },
                styles.pressableActionUserActionable
              ]}
              onPressIn={() => {
                handleOnLaunchCamera();
              }}
            >
              <Icon name="camera" size={50} color="darkgray" />
              <Text style={styles.textLabelActionable}>{"Máy ảnh"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isShowingOnboardingModal}
      >
        <OnboardingModalComp callback={handleCallbackOnboarding} />
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  pressable_ModalOnboarding: {
    // flex: 0.15,
    marginHorizontal: 10
    // alignContent: "flex-end",
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
    // alignSelf: "flex-end",
    // borderWidth: 1
  },
  textHeaderViewChildIS: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    alignSelf: "flex-start",
    top: -10,
    backgroundColor: "white",
    paddingHorizontal: 5
  },
  viewChildIS: {
    minWidth: "100%",
    maxWidth: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 8
  },
  viewInvoiceScanning: {
    // visible: "hidden",
    width: "100%",
    flex: 1,
    // height: 1000,
    justifyContent: "flex-start",
    alignItems: "center",
    // borderColor: "darkgray",
    // borderWidth: 1,
    paddingHorizontal: 10
    // margin: 10,
  },
  viewAssetShowing: {
    width: "100%",
    minWidth: Dimensions.get("screen").width * 0.97,
    maxWidth: Dimensions.get("screen").width,
    height: "100%",
    minHeight: 200,
    maxHeight: 500,
    // borderColor: "red",
    // borderWidth: 1,
    flex: 1
  },
  text_ProgressLoading: {
    textAlign: "center",
    fontSize: 15,
    fontFamily: "OpenSans_400Regular"
    // position: "absolute",
    // // left equal with progressLoading
    // left: `${progressLoading * 100}%`,
  },
  view_ProgressLoading: {
    width: "100%",
    height: "auto",
    marginVertical: 5,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around"
  },
  image_Logo_Loading: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center"
  },
  view_Loading_Text: {
    flex: 1,
    // justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "center",
    flexDirection: "column",
    paddingHorizontal: 5
  },
  view_Loading: {
    width: "98%",
    // flex: 1,
    borderWidth: 0.25,
    borderColor: "darkgray",
    alignSelf: "center",
    position: "relative",
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 10
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
    borderRadius: 10,
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
    fontFamily: "Inconsolata_400Regular",
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
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "relative",
    flexDirection: "row"
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
    height: "auto",
    borderBottomColor: "darkgrey",
    borderBottomWidth: 1,
    // alignContent: "center",
    // alignItems: "center",
    // justifyContent: "center",
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

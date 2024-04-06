import React, { useState, useEffect } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import currencyLibrary from "../../library/currencyLIbrary";
import { VAR } from "../../constants/var.constant";
import axios from "axios";
import { API } from "../../constants/api.constant";
// slice
import { setModalAddTransactionVisible } from "../../redux/modalSlice";
import {
  addTransactionNoInvoice,
  addTransactionWithInvoice,
  setAddTransactionTime,
  setAddTransactionWallet
} from "../../redux/transactionSlice";
import { setModalCategoryVisible } from "../../redux/categorySlice";
import { getTotalBalance } from "../../redux/walletSlice";
import {
  uploadToInvoiceTransaction,
  uploadToInvoiceTransactionFileName
} from "../../redux/fileSlice";
import { setCategoryToAddTransaction } from "../../redux/categorySlice";

// component
import ModalCategoryComponent from "../../components/category/modalCategoryComponent";
import { ModalCalendarComponent } from "../../components/calendar/mocalCalendarComponent";
import ModalWalletComponent from "../../components/wallet/modalWalletComponent";
import ModalTakeCamera from "../../components/transaction/modalTakeCamera";
import AnInputInvoiceScanning from "../../components/transaction/anInputInvoiceScanning";
import AnInputProductInIS from "../../components/transaction/anInputProductInIS";
import fileServices from "../../services/fileServices";

// https://www.npmjs.com/package/react-native-date-picker

const AddTransactionScreen = () => {
  const [mCategoryVisible, setMCategoryVisible] = useState(false);
  const [mCalendarVisible, setMCalendarVisible] = useState(false);
  const [mWalletVisible, setMWalletVisible] = useState(false);
  const [mTakeCamera, setMTakeCamera] = useState(false);

  const [newAssetShowing, setNewAssetShowing] = useState(null);
  const [mIsProcessing, setMIsProcessing] = useState(null);
  const [processingContent, setProcessingContent] = useState("");

  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  const [isPulledDown, setIsPulledDown] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [transAmount, setTransAmount] = useState("");
  const [isInvoiceScanning, setIsInvoiceScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const modalAddTransactionVisible = useSelector(
    (state) => state.modal.modalAddTransactionVisible
  );
  const account = useSelector((state) => state.authen.account);
  // const categories = useSelector((state) => state.category.categories);
  const categoryToAddTransaction = useSelector(
    (state) => state.category.categoryToAddTransaction
  );
  const addTransactionTime = useSelector(
    (state) => state.transaction.addTransactionTime
  );
  const addTransactionWallet = useSelector(
    (state) => state.transaction.addTransactionWallet
  );

  // const invoiceScanning = useSelector((state) => state.file?.invoiceScanning);
  // const invoiceImageURL = useSelector((state) => state.file?.invoiceImageURL);
  const [invoiceResult, setInvoiceResult] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    // if (invoiceScanning) {
    //   setInvoiceResult(invoiceScanning);
    //   setunInputInvoiceScanning(invoiceScanning);
    // }
    setCurrentTime(datetimeLibrary.getCurrentTime().datetimestr);
  }, [account, dispatch]);

  const setunInputInvoiceScanning = (invoiceScanning) => {
    setTransAmount(invoiceScanning?.totalAmount?.toString());
  };

  const handleDataFromCalendar = (data) => {
    // setTransTimeData(data);
    setMCalendarVisible(data.isCalendarVisible);
    // setIsInvoiceScanning(data.isInvoiceScanning);
    dispatch(setModalAddTransactionVisible(false));
  };

  const handleDataFromCategory = (data) => {
    setMCategoryVisible(data.isCategoryVisible);
    // dispatch(setModalAddTransactionVisible(false));
  };

  const handleDataFromWallet = (data) => {
    setMWalletVisible(data.isWalletVisible);
  };

  // const handleDataFromTakeCamera = (data) => {
  //   setMTakeCamera(data.isCameraVisible);
  //   dispatch(setModalAddTransactionVisible(false));
  //   console.log("AddTransactionScreen data: ", data);
  // };

  async function handleAddTransaction() {
    console.log("handleAddTransaction");
    // log transAmount, categoryToAddTransaction, addTransactionTime, addTransactionWallet
    let amount = transAmount.replace(/\./g, "");
    if (amount === "") {
      Alert.alert("Số tiền không được để trống");
      return;
    }
    let time = "";
    if (addTransactionTime === null) {
      time = datetimeLibrary.getCurrentTime().datetimedata;
    } else {
      time = addTransactionTime.datetime;
    }
    if (categoryToAddTransaction === null) {
      Alert.alert("Hạng mục không được để trống");
      return;
    }
    if (addTransactionWallet === null) {
      Alert.alert("Ví không được để trống");
      return;
    }
    setIsAddingTransaction(true);
    if (invoiceResult) {
      // console.log("invoiceResult: ", invoiceResult);
      const filename =
        account.accountID + "_" + datetimeLibrary.getCurrentTimeStr();
      console.log("assetsShowing?.asset: ", newAssetShowing?.asset);
      await uploadInvoiceToAPI({
        asset: newAssetShowing?.asset,
        filenamecustom: filename,
        accountID: account?.accountID
      }).then((response) => {
        console.log("fileURL: ", response);
        const totalOfInvoice =
          currencyLibrary.removeCurrencyFormat(transAmount);
        const transactionWithInvoice = {
          accountID: account.accountID,
          walletID: addTransactionWallet.walletID,
          categoryID: categoryToAddTransaction.categoryID,
          // totalAmount: amount,
          totalAmount: totalOfInvoice,
          transactionDate: time,
          note: "has invoice",
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
        // console.log("products: ", transactionWithInvoice.invoice.products);

        dispatch(addTransactionWithInvoice(transactionWithInvoice));
      });
    } else {
      const data = {
        accountID: account.accountID,
        walletID: addTransactionWallet.walletID,
        categoryID: categoryToAddTransaction.categoryID,
        totalAmount: amount,
        transactionDate: time,
        note: "",
        fromPerson: "",
        toPerson: "",
        imageURL: ""
      };
      dispatch(addTransactionNoInvoice(data));
    }
    saveAssetToMediaLibrary(newAssetShowing?.asset);
    setIsAddingTransaction(false);

    handleResetAddTransaction();
  }

  async function uploadInvoiceToAPI({ asset, filenamecustom, accountID }) {
    let fileURL = "";
    const urlapi = API.FILE.UPLOAD_INVOICE_OF_TRANSACTION_FILE_NAME;
    const formData = new FormData();
    const filename = asset?.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    const filedata = {
      uri: asset?.uri,
      name: filename,
      type: type
    };
    formData.append("file", filedata);
    formData.append("filename", filenamecustom);
    formData.append("accountID", accountID);
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
          fileURL = response.data;
        }
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    return fileURL;
  }

  function handleResetAddTransaction() {
    setTransAmount("");
    dispatch(setCategoryToAddTransaction(null));
    dispatch(setAddTransactionTime(null));
    setCurrentTime(datetimeLibrary.getCurrentTime().datetimestr);
    dispatch(setAddTransactionWallet(null));
    // dispatch(setAssetsShowing({ asset: null, isShowingAsset: "false" }));
    setNewAssetShowing({ asset: null, isShowingAsset: "false" });
    setInvoiceResult(null);
    setMIsProcessing(null);
    // dispatch(setModalAddTransactionVisible(false));
  }

  function handleAmountChange(text) {
    const formattedNumber = text
      .replace(/\./g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setTransAmount(formattedNumber);
  }

  function handleChangeProductInInvoice({ newItem }) {
    setInvoiceResult({
      ...invoiceResult,
      productInInvoices: invoiceResult?.productInInvoices?.map((it) =>
        it.productID === newItem.productID
          ? {
              ...it,
              productName: newItem.productName,
              quanity: newItem.quanity,
              unitprice: newItem.unitPrice,
              totalAmount: newItem.totalAmount
            }
          : it
      )
    });
  }

  async function handleOnPickMedia() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });
    // console.log("result: ", result);
    if (!result.canceled) {
      setMTakeCamera(false);
      handleUploadToScanInvoice(result.assets[0]);
    }
  }

  async function handleOnLaunchCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });
    // console.log(result);
    if (!result.canceled) {
      setMTakeCamera(false);
      handleUploadToScanInvoice(result.assets[0]);
    }
  }

  async function saveAssetToMediaLibrary(asset) {
    console.log("saveAssetToMediaLibrary: ", asset);
    // check permission, if not granted, request permission
    if (permissionResponse?.status !== "granted") {
      MediaLibrary.requestPermissionsAsync().then((response) => {
        if (response.status === "granted") {
          saveAssetToMediaLibrary(asset);
        }
      });
    }
    if (permissionResponse?.status === "granted") {
      // check if album exists, if not create album
      const album = await MediaLibrary.getAlbumAsync(
        VAR.MEDIALIBRARY.DEFAULT_ALBUM_NAME
      );
      if (album === null) {
        console.log("album is null");
        setProcessingContent(
          "Đang tạo album " + VAR.MEDIALIBRARY.DEFAULT_ALBUM_NAME + " mới ..."
        );
        const albumName = VAR.MEDIALIBRARY.DEFAULT_ALBUM_NAME;
        if (Platform.OS === "android") {
          const copyAsset = false;
          await MediaLibrary.createAlbumAsync(
            albumName,
            asset,
            copyAsset
          ).finally(() => {
            setProcessingContent("Đã tạo album " + albumName);
          });
        } else {
          await MediaLibrary.createAlbumAsync(albumName, asset).finally(() => {
            setProcessingContent("Đã tạo album " + albumName);
          });
        }
        // console.log("albumCreated", albumCreated);
      } else {
        const assetSaved = await MediaLibrary.createAssetAsync(
          asset.uri
        ).finally(() => {
          setProcessingContent("Đang xử lý hình ảnh ...");
        });
        const assetAdded = await MediaLibrary.addAssetsToAlbumAsync(
          [assetSaved],
          album,
          false
        ).finally(() => {
          setProcessingContent("Đã lưu hình ảnh vào album " + album.title);
          handleResetAddTransaction();
        });
      }
    }
  }

  async function handleUploadToScanInvoice(asset) {
    console.log("asset: ", asset);
    setMIsProcessing(true);
    setNewAssetShowing({ asset: asset, isShowingAsset: "true" });
    setProcessingContent("Đang quét hóa đơn ...");
    if (Platform.OS === "android") {
      console.log("android");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      const urlapi = API.INVOICE.SCAN_V4;
      const formData = new FormData();
      const filename = asset?.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let filedata = null;
      filedata = {
        uri: asset?.uri,
        name: filename,
        type: type
      };
      console.log("api: ", urlapi);
      console.log("filedata: ", filedata);
      console.log("config: ", config);
      formData.append("file", filedata);
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
            console.log("response: ", response?.data);
            setProcessingContent("Đã xử lý hóa đơn");
            setInvoiceResult(response?.data);
            setunInputInvoiceScanning(response?.data);
            setMIsProcessing(false);
          }
        })
        .catch((error) => {
          console.log("error: ", error);
          setProcessingContent("Có lỗi xảy ra khi quét hóa đơn");
        });
    } else {
      await fileServices
        .upToScanInvoice(asset)
        .then((response) => {
          if (response) {
            console.log("response: ", response);
            setProcessingContent("Đã xử lý hóa đơn");
            setInvoiceResult(response);
            setunInputInvoiceScanning(response);
            setMIsProcessing(false);
          } else if (response === undefined) {
            setProcessingContent("Lỗi xảy ra khi quét hóa đơn");
          }
          // setMIsProcessing(false);
          // dispatch(setAssetsShowing({ asset: asset, isShowingAsset: "true" }));
        })
        .catch((error) => {
          console.log("error: ", error);
          setProcessingContent("Có lỗi xảy ra khi quét hóa đơn");
          setMIsProcessing(false);
        });
    }
  }

  const ViewProcessing = () => {
    return (
      <View style={styles.viewProcessing}>
        <Text>{processingContent}</Text>
      </View>
    );
  };

  const ViewInvoiceScanning = () => {
    return (
      <View style={styles.viewInvoiceScanning}>
        <View style={styles.viewChildIS}>
          <Text style={styles.textHeaderViewChildIS}>{"Hóa đơn"}</Text>
          <AnInputInvoiceScanning
            textLabelTop="Tổng tiền"
            value={invoiceResult?.totalAmount.toString()}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, totalAmount: text });
            }}
            keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
          />
          <AnInputInvoiceScanning
            textLabelTop="Số"
            value={invoiceResult?.idOfInvoice}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, idOfInvoice: text });
            }}
          />
          <AnInputInvoiceScanning
            textLabelTop="Ngày"
            value={invoiceResult?.invoiceDate}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, invoiceDate: text });
            }}
          />
        </View>
        <View style={styles.viewChildIS}>
          <Text style={styles.textHeaderViewChildIS}>{"Đơn vị cung cấp"}</Text>
          <AnInputInvoiceScanning
            textLabelTop="Tên"
            value={invoiceResult?.supplierName}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, supplierName: text });
            }}
          />
          <AnInputInvoiceScanning
            textLabelTop="Địa chỉ"
            value={invoiceResult?.supplierAddress}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, supplierAddress: text });
            }}
          />
          <AnInputInvoiceScanning
            textLabelTop="Số điện thoại"
            value={invoiceResult?.supplierPhone}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, supplierPhone: text });
            }}
          />
        </View>
        {/* <View style={styles.viewChildIS}>
          <Text style={styles.textHeaderViewChildIS}>{"Người nhận"}</Text>
          <AnInputInvoiceScanning
            textLabelTop="Tên"
            value={invoiceResult?.receiverName}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, receiverName: text });
            }}
          />
          <AnInputInvoiceScanning
            textLabelTop="Địa chỉ"
            value={invoiceResult?.receiverAddress}
            onChangeText={(text) => {
              setInvoiceResult({ ...invoiceResult, receiverAddress: text });
            }}
          />
        </View> */}
        <View style={styles.viewChildIS}>
          <Text style={styles.textHeaderViewChildIS}>{"Sản phẩm"}</Text>
          <FlatList
            nestedScrollEnabled={true}
            scrollEnabled={false}
            data={invoiceResult?.productInInvoices}
            keyExtractor={(item) => item.productID}
            renderItem={({ item }) => (
              <AnInputProductInIS
                name={item.productName}
                unitprice={item.unitPrice.toString()}
                quanity={item.quanity.toString()}
                amount={item.totalAmount.toString()}
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
    );
  };

  const ViewMoreDetail = () => {
    return (
      <View style={styles.viewMoreDetail}>
        <View style={styles.viewAmount}>
          <View style={styles.viewAmountIcon}>
            <Icon name="arrow-right-from-bracket" size={30} color="darkgrey" />
          </View>
          <View style={styles.viewInputAmount}>
            <TextInput style={styles.textInputPerson} placeholder="Người gửi" />
          </View>
        </View>
        <View style={styles.viewAmount}>
          <View style={styles.viewAmountIcon}>
            <Icon name="arrow-right-to-bracket" size={30} color="darkgrey" />
          </View>
          <View style={styles.viewInputAmount}>
            <TextInput
              style={styles.textInputPerson}
              placeholder="Người nhận"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.viewStyle}>
      <View style={styles.viewTopHeader}>
        <Text style={styles.textTopHeader}>Thêm giao dịch mới</Text>
      </View>
      <View style={styles.viewScrollViewParent}>
        <ScrollView style={styles.scrollView}>
          {/* TextInput Amount */}
          <View style={styles.viewAmount}>
            <View style={styles.viewAmountIcon}>
              <Icon name="money-bills" size={30} color="darkgrey" />
            </View>
            <View style={styles.viewInputAmount}>
              <TextInput
                keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
                style={styles.textInputAmount}
                value={transAmount}
                onChangeText={(text) => handleAmountChange(text)}
                onFocus={() => {
                  setTransAmount(transAmount);
                }}
              />
            </View>
          </View>
          {/* Select Category */}
          <View style={styles.viewAmount}>
            <View style={styles.viewAmountIcon}>
              <Icon name="layer-group" size={30} color="darkgrey" />
            </View>
            <View style={styles.viewSelectCategory}>
              <Pressable
                style={[styles.pressSelectCategory]}
                onPress={() => {
                  setMCategoryVisible(true);
                  // dispatch(setModalAddTransactionVisible(true));
                }}
              >
                <Text style={styles.textSelectCategory}>
                  {categoryToAddTransaction?.nameVN || "Chọn hạng mục"}
                </Text>
              </Pressable>
              <Icon
                name="angle-right"
                size={20}
                color="darkgrey"
                style={{ left: -20, top: 5 }}
              />
            </View>
          </View>
          {/* Select Time */}
          <View style={styles.viewAmount}>
            <View style={styles.viewAmountIcon}>
              <Icon name="calendar" size={30} color="darkgrey" />
            </View>
            <View style={styles.viewSelectCategory}>
              <Pressable
                style={[styles.pressSelectCategory]}
                onPress={() => {
                  setMCalendarVisible(true);
                  // dispatch(setModalAddTransactionVisible(true));
                }}
              >
                <Text style={styles.textSelectCategory}>
                  {addTransactionTime
                    ? addTransactionTime.hour +
                      ":" +
                      addTransactionTime.minute +
                      ", " +
                      addTransactionTime.date
                    : currentTime}
                </Text>
              </Pressable>
              <Icon
                name="angle-right"
                size={20}
                color="darkgrey"
                style={{ left: -20, top: 5 }}
              />
            </View>
          </View>
          {/* Select Wallet */}
          <View style={styles.viewAmount}>
            <View style={styles.viewAmountIcon}>
              <Icon name="wallet" size={30} color="darkgrey" />
            </View>
            <View style={styles.viewSelectCategory}>
              <Pressable
                style={[styles.pressSelectCategory]}
                onPress={() => {
                  setMWalletVisible(true);
                  // dispatch(setModalAddTransactionVisible(true));
                }}
              >
                <Text style={styles.textSelectCategory}>
                  {addTransactionWallet?.name || "Chọn ví"}
                </Text>
              </Pressable>
              <Icon
                name="angle-right"
                size={20}
                color="darkgrey"
                style={{ left: -20, top: 5 }}
              />
            </View>
          </View>
          <View style={styles.view_AddTransaction_Note}>
            {/* <View style={styles.view_AddTransaction_Note_Icon}>
              <Icon name="note-sticky" size={30} color="darkgrey" />
            </View> */}
            <TextInput
              style={[styles.textinput_AddTransaction_Note]}
              placeholder="Ghi chú"
              editable={true}
              multiline={true}
              numberOfLines={5}
              textAlign="left"
              textAlignVertical="top"
            />
          </View>
          {/* <View style={styles.viewAmount}>
            <View style={styles.viewPressableMoreDetail}>
              {isShowDetail && <ViewMoreDetail />}
              <Pressable
                style={styles.pressMoreDetail}
                onPress={() => {
                  setIsShowDetail(!isShowDetail);
                }}
              >
                <Text style={styles.textMoreDetail}>
                  {isShowDetail ? "Ẩn chi tiết" : "Thêm chi tiết"}
                </Text>
                <Icon
                  name={isShowDetail ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="darkgrey"
                />
              </Pressable>
            </View>
          </View> */}
          {/* Invoice Scan */}
          {!mIsProcessing && mIsProcessing !== null && <ViewInvoiceScanning />}
          {mIsProcessing && mIsProcessing !== null && <ViewProcessing />}
          <View style={[styles.viewAssetShowing, {}]}>
            {newAssetShowing?.asset && (
              <View>
                {/* <Text>{assetsShowing?.asset?.uri}aa</Text> */}
                <Image
                  source={{ uri: newAssetShowing?.asset?.uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    // alignSelf: "center",
                    // justifyContent: "space-around",
                    resizeMode: "contain"
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
        {/* End  View ScrollView Parent*/}
      </View>
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
              setMTakeCamera(true);
              // dispatch(setModalAddTransactionVisible(true));
            }}
          >
            <Icon name="camera" size={30} color="#0984e3" />
          </Pressable>
        </View>
        {/* Button Save */}
        <View style={styles.viewAddTransaction}>
          <Pressable
            style={styles.pressable_SaveTransaction}
            onPress={() => {
              handleAddTransaction();
            }}
            // disabled={true}
          >
            <Text style={styles.textButtonSave}>{"Lưu"}</Text>
          </Pressable>
        </View>
      </BlurView>
      {/* Modal Compnent */}
      <View style={styles.viewStyle}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={mCategoryVisible}
        >
          <View style={styles.view_BackgroudModal}>
            <Pressable
              onPress={() => {
                setMCategoryVisible(false);
              }}
              style={styles.pressable_CloseModal}
            />
            <View style={styles.viewCategoryInModal}>
              <ModalCategoryComponent
                onDataFromChild={handleDataFromCategory}
              />
            </View>
            <Pressable
              onPress={() => {
                setMCategoryVisible(false);
              }}
              style={styles.pressable_CloseModal}
            />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={mCalendarVisible}
        >
          <View style={styles.view_BackgroudModal}>
            <Pressable
              onPress={() => {
                setMCalendarVisible(false);
              }}
              style={styles.pressable_CloseModal}
            />
            <View style={styles.viewCalendarInModal}>
              <ModalCalendarComponent
                onDataFromChild={handleDataFromCalendar}
              />
            </View>
            <Pressable
              onPress={() => {
                setMCalendarVisible(false);
              }}
              style={styles.pressable_CloseModal}
            />
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={mWalletVisible}>
          <View style={styles.view_BackgroudModal}>
            <Pressable
              onPress={() => {
                setMWalletVisible(false);
              }}
              style={styles.pressable_CloseModal}
            />
            <View style={styles.viewWalletInModal}>
              <ModalWalletComponent onDataFromChild={handleDataFromWallet} />
            </View>
            <Pressable
              onPress={() => {
                setMWalletVisible(false);
              }}
              style={styles.pressable_CloseModal}
            />
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={mTakeCamera}>
          <View style={styles.view_BackgroudModal}>
            <Pressable
              onPress={() => {
                setMTakeCamera(false);
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={isAddingTransaction}
        >
          <View style={styles.view_BackgroudModal}>
            <View style={styles.view_ModalAddingTransaction}>
              <Text style={styles.text_ModalAddingTransaction}>
                {"Đang thêm giao dịch..."}
              </Text>
            </View>
          </View>
        </Modal>
        {/* End Modal Compnent */}
      </View>
    </View>
  );
};
// paste to view  {...panResponder.panHandlers}
const styles = StyleSheet.create({
  textInputPerson: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular",
    // borderWidth: 1,
    // borderColor: "darkgray",
    height: "100%"
  },
  textinput_AddTransaction_Note: {
    width: "100%",
    height: 150,
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular"
  },
  view_AddTransaction_Note_Icon: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  view_AddTransaction_Note: {
    flexDirection: "row",
    padding: 5
  },
  text_ModalAddingTransaction: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular",
    marginVertical: 10
  },
  view_ModalAddingTransaction: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    padding: 5,
    margin: 10,
    borderRadius: 10,
    width: "80%",
    height: "10%"
  },
  viewProcessing: {
    width: "100%",
    height: "20%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10
    // backgroundColor: "red",
    // borderWidth: 10,
    // borderColor: "yellow"
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
  pressable_CloseModal: {
    flex: 1,
    width: "100%",
    height: "100%"
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
  viewAssetShowing: {
    width: "100%",
    minWidth: Dimensions.get("screen").width * 0.97,
    maxWidth: Dimensions.get("screen").width,
    height: "100%",
    minHeight: 200,
    maxHeight: 800,
    // borderColor: "red",
    // borderWidth: 1,
    flex: 1
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
  scrollView: {
    // width: "100%",
    width: Dimensions.get("screen").width * 0.97,
    height: "100%",
    // borderColor: "blue",
    // borderWidth: 1,
    flex: 1
  },

  viewPressableMoreDetail: {
    width: "98%"
    // height: "50%"
  },
  textMoreDetail: {
    fontSize: 22,
    fontFamily: "Inconsolata_400Regular",
    marginHorizontal: 10
  },
  pressMoreDetail: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
    // marginVertical: 10,
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

  viewScrollViewParent: {
    flexDirection: "column",
    backgroundColor: "white",
    height: "85%",
    borderColor: "darkgray",
    borderWidth: 1
  },
  viewWalletInModal: {
    width: "95%",
    height: "50%"
  },
  viewCategoryInModal: {
    // borderWidth: 1,
    // borderColor: "gray",
    // backgroundColor: "green",
    // flex: 1,
    height: "70%",
    width: "100%"
  },
  viewInsideModal: {
    // flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // width: "100%",
    flex: 1,
    // height: "100%",
    zIndex: 99,
    borderWidth: 1,
    borderColor: "red"
  },
  viewCalendarInModal: {
    borderWidth: 1,
    borderColor: "darkgray",
    width: "95%",
    height: "35%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  viewTopHeader: {
    width: "100%",
    borderBottomColor: "darkgrey",
    borderBottomWidth: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  textTopHeader: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "OpenSans_500Medium"
  },
  viewAmount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10
    // marginHorizontal: 2
  },
  viewStyle: {
    // flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    alignContent: "center",
    width: "100%",
    height: "100%"
    // backgroundColor: "red"
  },
  viewAmountIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
    // marginHorizontal: 2
    // borderRightWidth: 1,
    // borderRightColor: "darkgrey"
  },
  viewInputAmount: {
    width: Dimensions.get("window").width * 0.8,
    height: 40,
    borderBottomColor: "darkgrey",
    borderBottomWidth: 1
  },
  textInputAmount: {
    flex: 1,
    fontSize: 40,
    fontFamily: "OpenSans_500Medium",
    textAlign: "right"
  },
  viewSelectCategory: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between"
    // borderBottomColor: "darkgrey",
    // borderBottomWidth: 1
  },
  view_BackgroudModal: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    // borderColor: "yellow",
    // borderWidth: 10,
    zIndex: 1,
    flexDirection: "column",
    paddingHorizontal: 5
    // borderColor: "red",
    // borderWidth: 5
  },

  pressSelectCategory: {
    // backgroundColor: "#F194FF",
    width: Dimensions.get("window").width * 0.8,
    height: 40,
    borderBottomColor: "darkgrey",
    borderBottomWidth: 1
    // borderWidth: 1,
    // borderColor: "darkgrey"
  },
  textSelectCategory: {
    color: "black",
    // fontWeight: "bold",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
    // borderWidth: 1,
    // borderColor: "darkgrey",
    fontSize: 25,
    fontFamily: "Inconsolata_400Regular",
    marginVertical: 5,
    marginHorizontal: 10,
    bottom: 0
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

{
  /* More Detail */
}
{
  /* <View style={styles.viewMoreDetail}>
            <View
              style={{
                height: isShowDetail ? 50 : 0
                // borderWidth: 2,
                // borderColor: "darkgray"
              }}
            >
              <Text>More Detail</Text>
            </View>
            <View style={styles.viewPressableMoreDetail}>
              <Pressable
                style={[styles.pressMoreDetail]}
                onPress={() => {
                  setIsShowDetail(isShowDetail ? false : true);
                  // console.log("isShowDetail: ", isShowDetail);
                }}
              >
                <Text style={styles.textMoreDetail}>Thêm chi tiết</Text>
                <Icon name="caret-down" size={20} color="darkgrey" />
              </Pressable>
            </View>
          </View> */
}

export default AddTransactionScreen;

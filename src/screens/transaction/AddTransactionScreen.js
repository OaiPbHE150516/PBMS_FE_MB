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

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import currencyLibrary from "../../library/currencyLIbrary";

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
import { setAssetsShowing } from "../../redux/mediaLibrarySlice";

// component
import ModalCategoryComponent from "../../components/category/modalCategoryComponent";
import { ModalCalendarComponent } from "../../components/calendar/mocalCalendarComponent";
import ModalWalletComponent from "../../components/wallet/modalWalletComponent";
import ModalTakeCamera from "../../components/transaction/modalTakeCamera";
import AnInputInvoiceScanning from "../../components/transaction/anInputInvoiceScanning";
import AnInputProductInIS from "../../components/transaction/anInputProductInIS";

const AddTransactionScreen = () => {
  const [mCategoryVisible, setMCategoryVisible] = useState(false);
  const [mCalendarVisible, setMCalendarVisible] = useState(false);
  const [mWalletVisible, setMWalletVisible] = useState(false);
  const [mTakeCamera, setMTakeCamera] = useState(false);
  const [isPulledDown, setIsPulledDown] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [transAmount, setTransAmount] = useState("");
  const [isInvoiceScanning, setIsInvoiceScanning] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

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

  const assetsShowing = useSelector(
    (state) => state.mediaLibrary?.assetsShowing
  );
  const invoiceScanning = useSelector((state) => state.file?.invoiceScanning);
  // const invoiceImageURL = useSelector((state) => state.file?.invoiceImageURL);
  const [invoiceResult, setInvoiceResult] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(getCategories(account?.accountID));
    // dispatch(setModalAddTransactionVisible(false));
    // console.log("useEffect: AddTransactionScreen");
    if (invoiceScanning) {
      setInvoiceResult(invoiceScanning);
      // console.log("invoiceScanning: ", invoiceScanning);
      setunInputInvoiceScanning(invoiceScanning);
    }
    setCurrentTime(datetimeLibrary.getCurrentTime().datetimestr);
  }, [account, dispatch, invoiceScanning]);

  const setunInputInvoiceScanning = (invoiceScanning) => {
    setTransAmount(invoiceScanning.totalAmount.toString());
    // setTransAmount(invoiceScanning.totalAmount.toString());
  };

  const handleDataFromCalendar = (data) => {
    // setTransTimeData(data);
    setMCalendarVisible(data.isCalendarVisible);
    // setIsInvoiceScanning(data.isInvoiceScanning);
    dispatch(setModalAddTransactionVisible(false));
  };

  const handleDataFromCategory = (data) => {
    setMCategoryVisible(data.isCategoryVisible);
    dispatch(setModalAddTransactionVisible(false));
  };

  const handleDataFromWallet = (data) => {
    setMWalletVisible(data.isWalletVisible);
    dispatch(setModalAddTransactionVisible(false));
  };

  const handleDataFromTakeCamera = (data) => {
    setMTakeCamera(data.isCameraVisible);
    dispatch(setModalAddTransactionVisible(false));
    console.log("AddTransactionScreen data: ", data);
  };

  function handleAddTransaction() {
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

    if (invoiceResult) {
      // console.log("invoiceResult: ", invoiceResult);
      const filename =
        account.accountID + "_" + datetimeLibrary.getCurrentTimeStr();
      console.log("assetsShowing?.asset: ", assetsShowing?.asset);
      dispatch(
        uploadToInvoiceTransactionFileName({
          asset: assetsShowing?.asset,
          filenamecustom: filename
        })
      );
      const totalOfInvoice = currencyLibrary.removeCurrencyFormat(transAmount);
      const transactionWithInvoice = {
        accountID: account.accountID,
        walletID: addTransactionWallet.walletID,
        categoryID: categoryToAddTransaction.categoryID,
        // totalAmount: amount,
        totalAmount: totalOfInvoice,
        transactionDate: time,
        note: "has invoice",
        fromPerson: invoiceResult.supplierName
          ? invoiceResult.supplierName
          : "",
        toPerson: invoiceResult.receiverName ? invoiceResult.receiverName : "",
        imageURL: filename,
        invoice: {
          supplierAddress: invoiceResult.supplierAddress
            ? invoiceResult.supplierAddress
            : "",
          supplierEmail: invoiceResult.supplierEmail
            ? invoiceResult.supplierEmail
            : "",
          supplierName: invoiceResult.supplierName
            ? invoiceResult.supplierName
            : "",
          supplierPhone: invoiceResult.supplierPhone
            ? invoiceResult.supplierPhone
            : "",
          receiverAddress: invoiceResult.receiverAddress
            ? invoiceResult.receiverAddress
            : "",
          receiverEmail: invoiceResult.receiverEmail
            ? invoiceResult.receiverEmail
            : "",
          receiverName: invoiceResult.receiverName
            ? invoiceResult.receiverName
            : "",
          idOfInvoice: invoiceResult.idOfInvoice
            ? invoiceResult.idOfInvoice
            : "",
          invoiceDate: invoiceResult.invoiceDate
            ? invoiceResult.invoiceDate
            : "",
          invoiceType: invoiceResult.invoiceType
            ? invoiceResult.invoiceType
            : "",
          paymentTerms: invoiceResult.paymentTerms
            ? invoiceResult.paymentTerms
            : "",
          netAmount: invoiceResult.netAmount ? invoiceResult.netAmount : 0,
          totalAmount: totalOfInvoice,
          taxAmount: invoiceResult.taxAmount ? invoiceResult.taxAmount : 0,
          discount: invoiceResult.discount ? invoiceResult.discount : 0,
          invoiceImageURL: filename,
          note: invoiceResult.note ? invoiceResult.note : "",
          products: [
            ...invoiceResult.productInInvoices.map((it) => {
              return {
                productName: it.productName ? it.productName : "",
                quanity: it.quanity ? it.quanity : 0,
                unitPrice: it.unitPrice ? it.unitPrice : 0,
                totalAmount: it.totalAmount ? it.totalAmount : 0,
                note: it.note ? it.note : "",
                tagID: it.tagID ? it.tagID : 1
              };
            })
          ],
          invoiceRawDatalog: invoiceResult.invoiceRawDatalog
            ? invoiceResult.invoiceRawDatalog
            : ""
        }
      };
      dispatch(addTransactionWithInvoice(transactionWithInvoice));
      // const imageURL = dispatch(getInvoiceImageURL);
    } else {
      // console.log("invoiceResult: ", invoiceResult);
      const data = {
        accountID: account.accountID,
        walletID: addTransactionWallet.walletID,
        categoryID: categoryToAddTransaction.categoryID,
        totalAmount: amount,
        transactionDate: time,
        note: "",
        fromPerson: "string",
        toPerson: "string",
        imageURL: "string"
      };
      dispatch(addTransactionNoInvoice(data));
    }
    Alert.alert("Thêm giao dịch thành công");
    handleResetAddTransaction();
  }

  function handleResetAddTransaction() {
    setTransAmount("");
    dispatch(setCategoryToAddTransaction(null));
    dispatch(setAddTransactionTime(null));
    setCurrentTime(datetimeLibrary.getCurrentTime().datetimestr);
    dispatch(setAddTransactionWallet(null));
    dispatch(setAssetsShowing({ asset: null, isShowingAsset: "false" }));
    setInvoiceResult(null);
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
        <View style={styles.viewChildIS}>
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
        <View style={[styles.viewAssetShowing, {}]}>
          {/* image of asset showing */}
          {assetsShowing?.asset && (
            <View>
              {/* <Text>{assetsShowing?.asset?.uri}aa</Text> */}
              <Image
                source={{ uri: assetsShowing?.asset?.uri }}
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
                  setMCalendarVisible(false);
                  setMWalletVisible(false);
                  dispatch(setModalAddTransactionVisible(true));
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
                  setMCategoryVisible(false);
                  setMCalendarVisible(true);
                  setMWalletVisible(false);
                  dispatch(setModalAddTransactionVisible(true));
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
                  setMCategoryVisible(false);
                  setMCalendarVisible(false);
                  dispatch(setModalAddTransactionVisible(true));
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
          {/* Invoice Scan */}
          {assetsShowing?.asset && <ViewInvoiceScanning />}
        </ScrollView>
        {/* End  View ScrollView Parent*/}
      </View>
      <BlurView intensity={20} style={styles.viewPressableAction}>
        {/* View and Pressable Reset */}
        <Pressable
          style={styles.pressableReset}
          onPress={() => {
            console.log("onPress Reset");
            handleResetAddTransaction();
          }}
        >
          <Text>{"Reset"}</Text>
        </Pressable>

        <View style={styles.viewTakeCamera}>
          <Pressable
            style={styles.pressableTakeCamera}
            onPressIn={() => {
              console.log("onPressIn");
            }}
            onPressOut={() => {}}
            onPress={() => {
              setMTakeCamera(true);
              setMCategoryVisible(false);
              setMCalendarVisible(false);
              setMWalletVisible(false);
              dispatch(setModalAddTransactionVisible(true));
            }}
          >
            <Icon name="camera" size={30} color="black" />
          </Pressable>
        </View>
        {/* Button Save */}
        <View style={styles.viewAddTransaction}>
          <Pressable
            style={styles.buttonCloseModal}
            onPress={() => {
              handleAddTransaction();
            }}
            // disabled={true}
          >
            <Text style={styles.textButtonSave}>{"Lưu"}</Text>
          </Pressable>
        </View>
      </BlurView>
      <View style={styles.viewStyle}>
        {/* Modal Compnent */}
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalAddTransactionVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              {mCategoryVisible && (
                <View style={styles.viewInsideModal}>
                  <View style={styles.viewCategoryInModal}>
                    <ModalCategoryComponent
                      onDataFromChild={handleDataFromCategory}
                    />
                  </View>
                </View>
              )}
              {mCalendarVisible && (
                <View style={styles.viewInsideModal}>
                  <View style={styles.viewCalendarInModal}>
                    <ModalCalendarComponent
                      onDataFromChild={handleDataFromCalendar}
                    />
                  </View>
                </View>
              )}
              {mWalletVisible && (
                <View style={styles.viewInsideModal}>
                  <View style={styles.viewWalletInModal}>
                    <ModalWalletComponent
                      onDataFromChild={handleDataFromWallet}
                    />
                  </View>
                </View>
              )}
              {mTakeCamera && (
                <View style={styles.viewInsideModal}>
                  <ModalTakeCamera onDataFromChild={handleDataFromTakeCamera} />
                </View>
              )}
            </View>
          </Modal>
        </View>
        {/* End Modal Compnent */}
      </View>
    </View>
  );
};
// paste to view  {...panResponder.panHandlers}
const styles = StyleSheet.create({
  viewPressableAction: {
    width: "98%",
    // borderColor: "red",
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: "5%",
    top: "-14%"
    // backgroundColor: "white",
    // zIndex: 3
    // flexDirection: "column",
    // alignContent: "center",
    // justifyContent: "center",
    // flexDirection: "column",
    // alignContent: "center",
    // justifyContent: "center",
  },
  pressableReset: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
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
    // backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "darkgray",
    borderWidth: 1,
    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5
  },
  viewAddTransaction: {
    // width: "100%"
    // marginVertical: 15
  },
  buttonCloseModal: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "lightgray",
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
    visible: "hidden",
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
    flexDirection: "column",
    // justifyContent: "space-between",
    // alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    borderColor: "green",
    borderWidth: 1,
    // padding: 0,
    height: Dimensions.get("screen").height * 0.3
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
    height: "80%",
    width: "100%"
  },
  viewInsideModal: {
    // flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "95%",
    // flex: 1,
    height: "95%"
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
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    alignContent: "center",
    width: "100%"
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
  centeredView: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
    // flexDirection: "column",
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

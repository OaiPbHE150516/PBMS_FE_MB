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
  PanResponder
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome6";

import datetimeLibrary from "../../library/datetimeLibrary";
import { setModalCategoryVisible } from "../../redux/categorySlice";
import ModalCategoryComponent from "../../components/category/modalCategoryComponent";
import { setModalAddTransactionVisible } from "../../redux/modalSlice";
import { ModalCalendarComponent } from "../../components/calendar/mocalCalendarComponent";
import ModalWalletComponent from "../../components/wallet/modalWalletComponent";
import { addTransactionNoInvoice } from "../../redux/transactionSlice";
import { getTotalBalance } from "../../redux/walletSlice";

const AddTransactionScreen = () => {
  const [mCategoryVisible, setMCategoryVisible] = useState(false);
  // same with mTimeVisible, mWalletVisible
  // const [modalVisible, setModalVisible] = useState(false);

  const [mCalendarVisible, setMCalendarVisible] = useState(false);
  const [mWalletVisible, setMWalletVisible] = useState(false);
  const [isPulledDown, setIsPulledDown] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [transAmount, setTransAmount] = useState("");

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

  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(getCategories(account?.accountID));
    // dispatch(setModalAddTransactionVisible(false));
    console.log("useEffect: AddTransactionScreen");
  }, [account, dispatch]);

  const handleDataFromCalendar = (data) => {
    // setTransTimeData(data);
    setMCalendarVisible(data.isCalendarVisible);
    dispatch(setModalAddTransactionVisible(false));
  };

  const handleDataFromCategory = (data) => {
    setMCategoryVisible(data.isCategoryVisible);
    dispatch(setModalAddTransactionVisible(false));
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

    const data = {
      accountID: account.accountID,
      walletID: addTransactionWallet.walletID,
      categoryID: categoryToAddTransaction.categoryID,
      totalAmount: amount,
      transactionDate: time,
      note: "",
      fromPerson: "string",
      toPerson: "string",
      imageURL: "string",
    };
    console.log("data: ", data);
    dispatch(addTransactionNoInvoice(data));
    Alert.alert("Thêm giao dịch thành công");
  }

  function handleAmountChange(text) {
    const formattedNumber = text
      .replace(/\./g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setTransAmount(formattedNumber);
  }

  return (
    <View style={styles.viewStyle}>
      <View style={styles.viewTopHeader}>
        <Text style={styles.textTopHeader}>Thêm giao dịch mới</Text>
      </View>
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
                : datetimeLibrary.getCurrentTime().datetimestr}
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
      <View
        style={{
          height: isShowDetail ? 50 : 0,
          borderWidth: 2,
          borderColor: "darkgray"
        }}
      >
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
        <Text>AddTransactionScreen</Text>
      </View>
      <View>
        <Button
          title="Thêm chi tiết"
          onPress={() => setIsShowDetail(isShowDetail ? false : true)}
        />
      </View>
      {/* Modal Compnent Here */}
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
                {/* <ButtonHideModel /> */}
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
                    onDataFromChild={handleDataFromCalendar}
                  />
                </View>
              </View>
            )}
          </View>
        </Modal>
      </View>
      {/* End Modal Compnent Here */}
      <View style={styles.viewAddTransaction}>
        <Pressable
          style={styles.buttonCloseModal}
          onPress={() => {
            handleAddTransaction();
          }}
          // disabled={true}
        >
          <Text style={styles.textButtonCloseModal}>{"Lưu"}</Text>
        </Pressable>
      </View>
    </View>
  );
};
// paste to view  {...panResponder.panHandlers}
const styles = StyleSheet.create({
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
    padding: 15
  },
  textTopHeader: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "OpenSans_500Medium"
  },
  viewAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5
  },
  viewStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column"
  },
  viewAmountIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
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
  viewAddTransaction: {
    alignSelf: "center",
    position: "relative",
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
    // alignItems: "flex-end",
    // flexDirection: "column",
    bottom: -Dimensions.get("window").height * 0.38,
    width: "100%"
  },
  buttonCloseModal: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "lightgray",
    borderColor: "darkgray",
    borderWidth: 1,
    alignSelf: "center",
    // flexDirection: "column",
    // alignContent: "center",
    // justifyContent: "center",
    alignItems: "center",
    width: "75%"
    // height: "50%"
  },
  textButtonCloseModal: {
    fontFamily: "Inconsolata_500Medium",
    fontSize: 20
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

export default AddTransactionScreen;

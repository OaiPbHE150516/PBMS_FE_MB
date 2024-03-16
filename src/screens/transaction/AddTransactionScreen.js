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

import { setModalCategoryVisible } from "../../redux/categorySlice";
import ModalCategoryComponent from "../../components/category/modalCategoryComponent";

import { setModalAddTransactionVisible } from "../../redux/modalSlice";
import { ModalCalendarComponent } from "../../components/calendar/mocalCalendarComponent";


const AddTransactionScreen = () => {
  // const [mCategoryVisible, setMCategoryVisible] = useState(false);
  // same with mTimeVisible, mWalletVisible
  // const [modalVisible, setModalVisible] = useState(false);

  const [mCalendarVisible, setMCalendarVisible] = useState(false);
  const [mWalletVisible, setMWalletVisible] = useState(false);
  const [isPulledDown, setIsPulledDown] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const modalAddTransactionVisible = useSelector(
    (state) => state.modal.modalAddTransactionVisible
  );
  const account = useSelector((state) => state.authen.account);
  // const categories = useSelector((state) => state.category.categories);
  const categoryToAddTransaction = useSelector(
    (state) => state.category.categoryToAddTransaction
  );
  const modalCategoryVisible = useSelector(
    (state) => state.category.modalCategoryVisible
  );

  const dispatch = useDispatch();
  // use effect to fetch categories
  useEffect(() => {
    // dispatch(getCategories(account?.accountID));
    // dispatch(setModalAddTransactionVisible(false));
  }, [account, dispatch]);

  function ButtonHideModel() {
    return (
      <Pressable
        style={styles.buttonCloseModal}
        onPress={() => {
          dispatch(setModalCategoryVisible(!modalCategoryVisible));
          setMCalendarVisible(false);
          dispatch(setModalAddTransactionVisible(false));
        }}
      >
        <Text style={styles.textButtonCloseModal}>Hide Modal</Text>
      </Pressable>
    );
  }

  // console.log(
  //   "categoryToAddTransaction: ",
  //   categoryToAddTransaction?.categoryID
  // );

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
              dispatch(setModalCategoryVisible(true));
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
              dispatch(setModalCategoryVisible(false));
              setMCalendarVisible(true);
              dispatch(setModalAddTransactionVisible(true));
            }}
          >
            <Text style={styles.textSelectCategory}>Chọn thời gian</Text>
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
            onPress={() => setMWalletVisible(true)}
          >
            <Text style={styles.textSelectCategory}>Chọn ví</Text>
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
            {modalCategoryVisible && (
              <View style={styles.viewInsideModal}>
                <ModalCategoryComponent />
              </View>
            )}
            {mCalendarVisible && (
              <View style={styles.viewInsideModal}>
                <View style={styles.viewCalendarInModal}>
                    <ModalCalendarComponent />
                </View>
              </View>
            )}
            <ButtonHideModel />
          </View>
        </Modal>
      </View>
      {/* End Modal Compnent Here */}
    </View>
  );
};
// paste to view  {...panResponder.panHandlers}
const styles = StyleSheet.create({
  viewInsideModal: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    // height: "100%"
  },
  viewCalendarInModal: {
    // borderWidth: 1,
    // borderColor: "gray",
    width: Dimensions.get("window").width * 0.95,
    height: "75%",
    backgroundColor: "white",
    // top: 25,
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
    flex: 1,
    // // justifyContent: "flex-start",
    alignItems: "center"
    // flexDirection: "column",
    // borderColor: "red",
    // borderWidth: 5
  },
  buttonCloseModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "darkgray",
    padding: 10,
    alignSelf: "center",
    bottom: 50,
    position: "absolute",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "5%"
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
    fontSize: 28,
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

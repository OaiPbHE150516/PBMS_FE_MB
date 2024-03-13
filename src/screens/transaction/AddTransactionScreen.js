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
  PanResponder
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome6";
// import { SelectList } from "react-native-dropdown-select-list";
import { getCategories } from "../../redux/categorySlice";

const AddTransactionScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPulledDown, setIsPulledDown] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const account = useSelector((state) => state.authen.account);
  const categories = useSelector((state) => state.category.categories);

  const dispatch = useDispatch();
  // use effect to fetch categories
  useEffect(() => {
    dispatch(getCategories(account.accountID));
  }, [account, dispatch]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          console.log("sdas!");
          setModalVisible(!modalVisible);
        }
      }
    })
  ).current;

  categories?.forEach((element) => {
    console.log("element: ", element.nameVN);
  });

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
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textSelectCategory}>Chọn hạng mục</Text>
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
            onPress={() => setModalVisible(true)}
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
          <Icon name="layer-group" size={30} color="darkgrey" />
        </View>
        <View style={styles.viewSelectCategory}>
          <Pressable
            style={[styles.pressSelectCategory]}
            onPress={() => setModalVisible(true)}
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
      </View>
      <View>
        <Button
          title="Thêm chi tiết"
          onPress={() => setIsShowDetail(isShowDetail ? false : true)}
        />
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
// paste to view  {...panResponder.panHandlers}
const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "80%",
    width: "100%"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
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

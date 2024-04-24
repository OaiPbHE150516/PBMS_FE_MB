import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
  Pressable,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

import { VAR } from "../../constants/var.constant";

//  redux & slice
import { useSelector, useDispatch } from "react-redux";

// services
import transactionServices from "../../services/transactionServices";

// components
import ModalTransactionDetail from "./modalTransactionDetail";

const TransactionDashboard = ({ navigation }) => {
  const account = useSelector((state) => state.authen?.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const [transactions, setTransactions] = useState([]);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState(null);

  async function fetchTransactionsData(accountID) {
    try {
      await transactionServices
        .getRecentlyTransaction({
          accountID: accountID,
          limit: 5
        })
        .then((response) => {
          setTransactions(response);
        })
        .catch((error) => {
          console.log("Error fetchTransactionsData Dashboard data:", error);
          Alert.alert("Lỗi", "Không thể lấy dữ liệu giao dịch gần đây");
        });
    } catch (error) {
      console.log("Error fetchTransactionsData data:", error);
      Alert.alert("Lỗi", "Không thể lấy dữ liệu giao dịch gần đây");
    }
  }

  const fetchTransactionDetailData = async ({ transactionID }) => {
    try {
      console.log("fetchTransactionDetailData transactionID: ", transactionID);
      await transactionServices
        .getTransactionDetail({
          transactionID: transactionID,
          accountID: account?.accountID
        })
        .then((response) => {
          setTransactionDetail(response);
          setIsModalDetailVisible(true);
        });
    } catch (error) {
      console.log("Error fetchTransactionDetailData data:", error);
    }
  };

  const onCallback = (data) => {
    fetchTransactionDetailData({ transactionID: data.transactionID });
  };

  const onCallbackModalDetail = (data) => {
    console.log("onCallbackModalDetail: ", data);
    setIsModalDetailVisible(data);
  };

  useEffect(() => {
    fetchTransactionsData(account?.accountID);
  }, [shouldFetchData]);

  return transactions && transactions.length > 0 ? (
    <View style={styles.viewStyle}>
      <View style={styles.view_Header}>
        <Text style={styles.text_Header}>{"Giao dịch gần đây"}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.pressable_ViewAll,
            { opacity: pressed ? 0.5 : 1 }
          ]}
          onPress={() => {
            // callback();
            // navigation.push("NewAddTransaction");
          }}
        >
          {/* <Text style={styles.text_ViewAll}>{"Xem báo cáo "}</Text> */}
          <Icon name="chevron-right" size={15} color="#0984e3" />
        </Pressable>
      </View>
      <View style={styles.flatList_Container}>
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={true}
          data={transactions}
          keyExtractor={(item) => item.transactionID}
          renderItem={({ item }) => {
            return (
              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.5 : 1
                  },
                  styles.transactionItem
                ]}
                onPress={() => {
                  onCallback({ transactionID: item.transactionID });
                }}
              >
                <View style={styles.viewtimeminus}>
                  <Text style={styles.textCategory}>
                    {item.category.nameVN}
                  </Text>
                  <Text style={styles.texttimeminus}>
                    {item.transactionDateMinus}
                  </Text>
                </View>
                <View style={styles.viewNote}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.textNote}
                  >
                    {item.note}
                  </Text>
                </View>
                <View style={styles.viewBalance}>
                  <Text
                    style={[
                      styles.textBalance,
                      item.category.categoryTypeID == 2
                        ? { color: "red" }
                        : { color: "green" }
                    ]}
                  >
                    {item.category.categoryTypeID == 2
                      ? "- " + item.totalAmountStr
                      : "+ " + item.totalAmountStr}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
      <Modal
        visible={isModalDetailVisible}
        animationType="fade"
        transparent={true}
        // onShow={() => {
        //   setBackgroundColorModal("rgba(0, 0, 0, 0.1)");
        // }}
      >
        <View
          style={[
            styles.view_BackgroudModal,
            {
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            }
          ]}
        >
          <Pressable
            style={styles.pressable_closeModalDetail}
            onPress={() => {
              // setBackgroundColorModal("rgba(0, 0, 0, 0)");
              setIsModalDetailVisible(false);
            }}
          />
          <View>
            <View
              style={{
                width: "25%",
                height: 3,
                backgroundColor: "darkgray",
                borderRadius: 10,
                alignContent: "center",
                alignSelf: "center",
                bottom: -5,
                zIndex: 10
              }}
            ></View>
            <ModalTransactionDetail
              props={transactionDetail}
              callback={onCallbackModalDetail}
            />
          </View>
        </View>
      </Modal>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  view_BackgroudModal: {
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  pressable_closeModalDetail: {
    flex: 1
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
    width: "50%"
  },
  viewStyle: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    borderRadius: 5,
    marginVertical: 5
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
  flatList_Container: {
    // borderWidth: 0.5,
    // borderColor: "darkgrey",
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "space-between"
  },
  transactionItem: {
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 0.2,
    borderColor: "darkgray",
    height: 50,
    width: "100%"
  },
  texttimeminus: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "left",
    paddingLeft: 5
  },
  viewtimeminus: {
    width: "25%",
    justifyContent: "flex-end",
    flexDirection: "column",
    paddingVertical: 10
  },
  viewCategory: {
    borderColor: "lightgrey",
    width: "20%",
    justifyContent: "flex-end",
    flexDirection: "column",
    paddingVertical: 10
  },
  textCategory: {
    textAlign: "center",
    alignSelf: "flex-start",
    fontSize: 13,
    paddingHorizontal: 3,
    fontWeight: "bold"
  },
  viewNote: {
    justifyContent: "flex-end",
    flexDirection: "column",
    paddingVertical: 10,
    width: "43%"
  },
  textNote: {
    textAlign: "left",
    alignSelf: "flex-start",
    fontSize: 13,
    width: "100%",
    paddingHorizontal: 5
  },
  viewBalance: {
    width: "30%",
    justifyContent: "flex-end",
    flexDirection: "column",
    marginHorizontal: 3,
    paddingVertical: 10
  },
  textBalance: {
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "right",
    paddingRight: 5
  }
});

export default TransactionDashboard;

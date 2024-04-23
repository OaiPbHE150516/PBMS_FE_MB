import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  RefreshControl,
  Dimensions,
  Modal,
  Pressable
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useSelector, useDispatch } from "react-redux";
import pbms from "../../api/pbms";
import { API } from "../../constants/api.constant";
// import TransactionByDayList from "./transactionByDayList";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import transactionServices from "../../services/transactionServices";

// components
import TransactionByDayItem from "./transactionByDayItem";
import ModalTransactionDetail from "./modalTransactionDetail";
import ReportTransactionComp from "./reportTransactionComp";
import NotiNoData from "../noti/notiNoData";

const TransCompTest = ({ route }) => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState(null);

  const [isShowingModalReport, setIsShowingModalReport] = useState(false);

  let data = route.params;
  const fetchTransactionData = async ({ accountID, time }) => {
    try {
      console.log("time: ", time);
      const apiurl =
        API.TRANSACTION.GET_TRANSACTION_BY_WEEK + accountID + "/" + time;
      // console.log("apiurl: ", apiurl);
      const response = await pbms.get(apiurl);
      setTransactions(response.data);
      console.log("response.data: ", response.data?.transactionByDayW?.length);
    } catch (error) {
      console.log("Error fetchTransactionData data:", error);
    }
  };

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

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchTransactionData({ accountID: account.accountID, time: data.time });
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // return isLoading ? null : (
  //   <View style={styles.parentView}>
  //     <Text>{account?.accountID}</Text>
  //     <Text>{data?.time}</Text>
  //   </View>
  // );

  useEffect(() => {
    if (account !== null) {
      setIsLoading(true);
      fetchTransactionData({ accountID: account.accountID, time: data.time });
      if (transactions) {
        setIsLoading(false);
      }
    }
  }, [shouldFetchData, route]);

  return isLoading ? null : (
    <View style={styles.parentView}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <Text style={styles.textHeader}>
          {"Các giao dịch từ "}
          {transactions?.weekDetail?.startDateStrFull}
          {" đến "}
          {transactions?.weekDetail?.endDateStrFull}
        </Text>
        <Pressable
          onPress={() => setIsShowingModalReport(true)}
          // style with pressed state make it change opacity when pressed
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1,
              marginHorizontal: 5,
              paddingHorizontal: 5
            }
          ]}
        >
          {/* <Text style={{ color: "#0984e3" }}>Xem báo cáo</Text> */}
          <Icon name="chart-line" size={20} color="#0984e3" />
        </Pressable>
      </View>
      <View style={{ marginTop: 10 }}>
        <View style={styles.viewMoney}>
          <Text style={styles.textLabelMoney}>{"Tổng thu"}</Text>
          <Text style={[styles.textDataMoney, { color: "green" }]}>
            {transactions?.totalAmountInStr}
          </Text>
        </View>
        <View style={styles.viewMoney}>
          <Text style={styles.textLabelMoney}>{"Tổng chi"}</Text>
          <Text style={[styles.textDataMoney, { color: "tomato" }]}>
            -{transactions?.totalAmountOutStr}
          </Text>
        </View>
        <View style={styles.viewMoney}>
          <Text style={[styles.textLabelMoney]}>{"Số dư"}</Text>
          <View style={{ borderTopColor: "darkgray", borderTopWidth: 1 }}>
            <Text
              style={[
                styles.textDataMoney,
                transactions?.totalAmount > 0
                  ? { color: "green" }
                  : { color: "tomato" }
              ]}
            >
              {transactions?.totalAmountStr}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.viewL}>
        {transactions?.transactionByDayW?.length === 0 && (
          <View style={styles.view_NoData}>
            <NotiNoData />
          </View>
        )}
        {transactions?.transactionByDayW && (
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            focusable={true}
            data={transactions?.transactionByDayW}
            keyExtractor={(item) => item.dayDetail.dayStr}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => {
              return (
                <View style={styles.listStyle}>
                  <View style={styles.viewHeaderInList}>
                    <View style={styles.viewDay}>
                      <Text style={styles.textDayNumber}>
                        {item.dayDetail.dayStr}
                      </Text>
                      <View style={styles.viewDayCh}>
                        <Text style={styles.textDayInWeek}>
                          {item.dayDetail.full_VN}
                        </Text>
                        <Text style={styles.textMonthYear}>
                          {item.dayDetail.monthYearStr}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.viewTotalAmount}>
                      <Text style={styles.textTotalAmount}>
                        {item.totalAmountStr}
                      </Text>
                    </View>
                  </View>
                  <View>
                    {/* <TransactionByDayList props={item?.transactions} /> */}
                    <FlatList
                      scrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      data={item?.transactions}
                      keyExtractor={(item) => item.transactionID}
                      renderItem={({ item }) => {
                        return (
                          <View style={styles.view_Item_TransactionByDayList}>
                            <TransactionByDayItem
                              props={item}
                              callback={onCallback}
                            />
                          </View>
                        );
                      }}
                    />
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => {
              return <View style={{ height: 160 }}></View>;
            }}
          />
        )}
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
              backgroundColor: "rgba(0, 0, 0, 0.1)"
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
      <Modal
        visible={isShowingModalReport}
        animationType="slide"
        transparent={true}
      >
        <View
          style={[
            styles.view_BackgroudModal,
            {
              backgroundColor: "rgba(0, 0, 0, 0.25)"
            }
          ]}
        >
          <Pressable
            style={styles.pressable_closeModalDetail}
            onPress={() => {
              setIsShowingModalReport(false);
            }}
          />
          <View
            style={{
              backgroundColor: "white",
              height: "80%"
            }}
          >
            <ReportTransactionComp time={data.time} />
          </View>
        </View>
      </Modal>
    </View>
  );
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
  textDayInWeek: {
    fontSize: 20,
    fontFamily: "OpenSans_500Medium"
  },
  textMonthYear: {
    fontSize: 13,
    fontFamily: "Inconsolata_300Light",
    fontStyle: "italic"
  },
  viewDay: {
    // borderColor: "tomato",
    // borderWidth: 1,
    flexDirection: "row",
    margin: 5
  },
  viewTotalAmount: {
    alignSelf: "center",
    marginHorizontal: 5
  },
  textTotalAmount: {
    fontSize: 20,
    fontFamily: "OpenSans_500Medium"
  },
  viewDayCh: {
    flexDirection: "column",
    marginHorizontal: 10
  },
  textDayNumber: {
    fontSize: 30,
    fontFamily: "OpenSans_500Medium"
  },
  viewHeaderInList: {
    // borderColor: "tomato",
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textDataMoney: {
    fontSize: 17,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "right"
    // backgroundColor: "lightgrey",
    // borderColor: "dark",
    // borderWidth: 1,
  },
  textLabelMoney: {
    fontSize: 18,
    fontFamily: "OpenSans_500Medium"
  },
  viewMoney: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2
  },
  textHeader: {
    fontSize: 18,
    fontFamily: "OpenSans_400Regular"
  },
  listStyle: {
    margin: 2,
    borderLeftColor: "darkgrey",
    borderLeftWidth: 2,
    // borderTopColor: "lightgrey",
    // borderTopWidth: 1,
    // borderColor: "black",
    // borderWidth: 1,
    flex: 1,
    borderRadius: 5,
    backgroundColor: "white"
  },
  viewL: {
    // height: Dimensions.get("window").height * 0.65
    // borderColor: "black",
    // borderWidth: 1
    backgroundColor: "white"
  },
  view_NoData: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    margin: 10
  },
  parentView: {
    // margin: 2,
    // borderColor: "red",
    // borderWidth: 1,
    flex: 1,
    height: "100%",
    // marginTop: 2,
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingTop: 2,
  },
  text: {
    fontSize: 30,
    fontFamily: "Inconsolata_400Regular"
  }
});

export default TransCompTest;

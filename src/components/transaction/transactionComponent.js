import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import pbms from "../../api/pbms";
import { API } from "../../constants/api.constant";
import { VAR } from "../../constants/var.constant";
import TransactionItem from "./transactionItem";
import TransactionByDayItem from "./transactionByDayItem";
import TransactionByDayList from "./transactionByDayList";
import datetimeLibrary from "../../library/datetimeLibrary";

import { format } from "date-fns";

const TransactionComponent = () => {
  const account = useSelector((state) => state.authen.account);
  const datenow = useSelector((state) => state.datedisplay.datenow);

  const [transactions, setTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactionData = async ({ accountID, time }) => {
    try {
      const apiurl =
        API.TRANSACTION.GET_TRANSACTION_BY_WEEK + accountID + "/" + time;
      console.log("apiurl: ", apiurl);
      const response = await pbms.get(apiurl);
      setTransactions(response.data);
      setIsLoading(false);
      // console.log("Response: ", response.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (
      account !== null &&
      datenow !== null &&
      datenow !== undefined &&
      datenow !== ""
    ) {
      setIsLoading(true);
      console.log("Call APIIIII: ", isLoading, " - ", datenow);
      fetchTransactionData({
        accountID: account.accountID,
        time: datenow
      });
    }
  }, [account, datenow]);

  return isLoading ? (
    <Text>Loading...</Text>
  ) : (
    <>
      <View style={styles.parentView}>
        <Text style={styles.textHeader}>
          Các giao dịch từ {transactions.weekDetail.startDateStrFull} đến{" "}
          {transactions.weekDetail.endDateStrFull}
        </Text>
        <View style={{ marginTop: 10 }}>
          <View style={styles.viewMoney}>
            <Text style={styles.textLabelMoney}>Tổng thu</Text>
            <Text style={[styles.textDataMoney, { color: "green" }]}>
              {transactions.totalAmountInStr}
            </Text>
          </View>
          <View style={styles.viewMoney}>
            <Text style={styles.textLabelMoney}>Tổng chi</Text>
            <Text style={[styles.textDataMoney, { color: "tomato" }]}>
              -{transactions.totalAmountOutStr}
            </Text>
          </View>
          <View style={styles.viewMoney}>
            <Text style={[styles.textLabelMoney]}>Số dư</Text>
            <View style={{ borderTopColor: "darkgray", borderTopWidth: 1 }}>
              <Text
                style={[
                  styles.textDataMoney,
                  transactions.totalAmount > 0
                    ? { color: "green" }
                    : { color: "tomato" }
                ]}
              >
                {transactions.totalAmountStr}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.viewL}>
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            focusable={true}
            data={transactions.transactionByDayW}
            keyExtractor={(item) => item.dayDetail.dayStr}
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
                    <TransactionByDayList props={item.transactions} />
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textDayInWeek: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
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
    fontFamily: "Inconsolata_500Medium"
  },
  viewDayCh: {
    flexDirection: "column",
    marginHorizontal: 10
  },
  textDayNumber: {
    fontSize: 30,
    fontFamily: "Inconsolata_500Medium"
  },
  viewHeaderInList: {
    // borderColor: "tomato",
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textDataMoney: {
    fontSize: 20,
    fontFamily: "Inconsolata_600SemiBold",
    textAlign: "right"
    // backgroundColor: "lightgrey",
    // borderColor: "dark",
    // borderWidth: 1,
  },
  textLabelMoney: {
    fontSize: 18,
    fontFamily: "Inconsolata_500Medium"
  },
  viewMoney: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2
  },
  textHeader: {
    fontSize: 18,
    fontFamily: "Inconsolata_400Regular"
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
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    elevation: 1
  },
  viewL: {
    // height: "90%",
    // borderColor: "black",
    // borderWidth: 1
  },
  parentView: {
    margin: 2,
    // borderColor: "black",
    // borderWidth: 1,
    flex: 1,
    height: "100%",
    marginTop: 10
  },
  text: {
    fontSize: 30,
    fontFamily: "Inconsolata_400Regular"
  }
});

export default TransactionComponent;

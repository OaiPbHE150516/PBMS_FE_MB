import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getTotalBalance } from "../../redux/walletSlice";
import pbms from "../../api/pbms";
import { API } from "../../constants/api.constant";

import TransactionList from "../../components/transaction/transactionList";

const TransactionScreen = () => {
  const account = useSelector((state) => state.authen.account);
  const totalBalance = useSelector((state) => state.wallet.totalBalance);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactionData = async (accountID) => {
    try {
      const transactions = await pbms.get(
        API.TRANSACTION.GET_TRANSACTION + accountID + "/" + "1" + "/" + "50"
      );
      setTransactions(transactions.data.resultDTO);
      //console.log("transactions: ", transactions.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (account !== null) {
      //   dispatch(getTotalBalance(account.accountID));
      fetchTransactionData(account.accountID);
    }
  }, [account, dispatch]);

  return (
    <View style={styles.parentView}>
      <View style={styles.viewTotalBalance}>
        <Text style={styles.labelTotalBalance}>Số dư:</Text>
        <Text style={styles.textTotalBalance}>{totalBalance}</Text>
      </View>
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        data={transactions}
        keyExtractor={(item) => item.transactionID}
        renderItem={({ item }) => {
          return (
            <View style={styles.listStyle}>
              <TransactionList props={item} />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    flexDirection: "row"
  },
  parentView: {
    margin: 10,
    justifyContent: "space-between"
  },
  viewTotalBalance: {
    margin: 10,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#ccc",
    borderRadius: 5,
    borderBottomWidth: 1
  },
  labelTotalBalance: {
    fontSize: 15,
    textAlign: "left"
  },
  textTotalBalance: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right"
  }
});

export default TransactionScreen;

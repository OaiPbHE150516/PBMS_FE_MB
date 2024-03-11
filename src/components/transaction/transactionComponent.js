import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import pbms from "../../api/pbms";
import { API } from "../../constants/api.constant";
import TransactionItem from "./transactionItem";

const TransactionComponent = () => {
  const account = useSelector((state) => state.authen.account);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactionData = async (accountID) => {
    try {
      const transactions = await pbms.get(
        API.TRANSACTION.GET_TRANSACTION + accountID + "/" + "1" + "/" + "50"
      );
      setTransactions(transactions.data.resultDTO);
      console.log("transactions: ", transactions.data);
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
      <Text>Hello</Text>
      <View style={styles.viewL}>
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          data={transactions}
          keyExtractor={(item) => item.transactionID}
          renderItem={({ item }) => {
            return (
              <View style={styles.listStyle}>
                <TransactionItem props={item} />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewL: {
    height: "100%"
  },
  parentView: {
    margin: 10,
    borderColor: "black",
    borderWidth: 1,
    flex: 1,
  },
  text: {
    fontSize: 30,
    fontFamily: "Inconsolata_400Regular"
  }
});

export default TransactionComponent;
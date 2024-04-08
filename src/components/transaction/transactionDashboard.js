import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList
} from "react-native";
import pbms from "../../api/pbms";
import { API } from "../../constants/api.constant";
import { useSelector, useDispatch } from "react-redux";

// services
import transactionServices from "../../services/transactionServices";

const TransactionDashboard = () => {
  const account = useSelector((state) => state.authen?.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const [transactions, setTransactions] = useState([]);

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
          console.error("Error fetchTransactionsData Dashboard data:", error);
          Alert.alert("Lỗi", "Không thể lấy dữ liệu giao dịch gần đây");
        });
    } catch (error) {
      console.error("Error fetchTransactionsData data:", error);
      Alert.alert("Lỗi", "Không thể lấy dữ liệu giao dịch gần đây");
    }
  }

  useEffect(() => {
    fetchTransactionsData(account?.accountID);
  }, [shouldFetchData]);

  return transactions && transactions.length > 0 ? (
    <View style={{ width: "100%", justifyContent: "center", flex: 1 }}>
      <Text style={styles.textHeader}>Giao dịch gần đây</Text>
      <View style={styles.viewStyle}>
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={true}
          data={transactions}
          keyExtractor={(item) => item.transactionID}
          renderItem={({ item }) => {
            return (
              <View style={styles.transactionItem}>
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
              </View>
            );
          }}
        />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 18,
    fontStyle: "italic",
    fontFamily: "Inconsolata_400Regular"
  },
  viewStyle: {
    // borderBlockColor: "dimgray",
    borderWidth: 0.5,
    flexDirection: "row",
    borderRadius: 5,
    borderColor: "darkgrey",
    justifyContent: "space-between"
  },
  transactionItem: {
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
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

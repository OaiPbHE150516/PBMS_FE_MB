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
import { useSelector, useDispatch } from "react-redux";
import pbms from "../../api/pbms";
import { API } from "../../constants/api.constant";

const WalletDashboard = () => {
  const account = useSelector((state) => state.authen.account);
  const [eachWallet, setEachWallet] = useState({});
  const fetchData = async (accountID) => {
    try {
      const eachWallet = await pbms.get(
        API.WALLET.GET_EACH_WALLET_BALANCE + accountID
      );
      setEachWallet(eachWallet.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  useEffect(() => {
    if (account !== null) {
      fetchData(account.accountID);
    }
  }, [account]);

  return eachWallet ? (
    <View style={styles.viewStyle}>
      <FlatList
        data={eachWallet}
        keyExtractor={(item) => item.walletID}
        renderItem={({ item }) => {
          return (
            <View style={styles.walletItem}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.balance}>{item.balance}</Text>
            </View>
          );
        }}
      />
    </View>
  ) : null;
};
const styles = StyleSheet.create({
  viewStyle: {
    borderBlockColor: "dimgray",
    flex: 1,
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 0,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: "darkgrey",
    borderRadius: 5
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    width: "100%"
  },

  name: {
    fontSize: 15
  },

  balance: {
    fontSize: 15,
    fontWeight: "bold",
    color: "seagreen",
    marginLeft: 20
  }
});

export default WalletDashboard;

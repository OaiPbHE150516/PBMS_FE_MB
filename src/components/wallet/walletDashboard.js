import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import pbms from "../../api/pbms";

const WalletDashboard = () => {
  const [eachWallet, setEachWallet] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const eachWallet = await pbms.get(
          "/api/wallet/get/total-amount-each-wallet/" + "117911566377016615313"
        );
        setEachWallet(eachWallet.data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        Alert.alert(
          "Error",
          "Failed to fetch wallet data. Please try again later."
        );
      }
    };
    fetchData();
  }, []);

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
    borderBlockColor: "black",
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 0,
    borderRadius: 5,
    marginVertical: 5,
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },

  name: {
    fontSize: 18,
  },

  balance: {
    fontSize: 18,
    fontWeight: "bold",
    color: "seagreen",
    marginLeft: 20,
  },
});

export default WalletDashboard;

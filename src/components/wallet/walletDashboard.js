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
import { fetchAllData } from "../../redux/dataSlice";

// services
import walletServices from "../../services/walletServices";

const WalletDashboard = () => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const [eachWallet, setEachWallet] = useState({});

  async function fetchWalletData(accountID) {
    console.log("fetchWalletData accountID: ", accountID);
    try {
      await walletServices
        .getTotalBalanceEachWallet(accountID)
        .then((response) => {
          // set EachWallet is top 2 wallet of response
          setEachWallet(response.slice(0, 2));
        });
    } catch (error) {
      console.error("Error fetchWalletData data:", error);
    }
  }

  useEffect(() => {
    fetchWalletData(account.accountID);
  }, [shouldFetchData]);

  return (
    eachWallet && (
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
    )
  );
};
const styles = StyleSheet.create({
  viewStyle: {
    borderBlockColor: "dimgray",
    flex: 1,
    borderWidth: 0.5,
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
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
    width: "98%",
    flex: 1,
    marginHorizontal: 2
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
  Pressable
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux & slice
import { useSelector, useDispatch } from "react-redux";

// services
import walletServices from "../../services/walletServices";

const WalletDashboard = ({ navigation, dataParent }) => {
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
          // sort response by balance
          // response.sort((a, b) => b.balance - a.balance);
          console.log("response fetchWalletData: ", response);
          setEachWallet(response.slice(0, 2));
        });
    } catch (error) {
      console.error("Error fetchWalletData data:", error);
    }
  }


  useEffect(() => {
    if (account?.accountID) {
      fetchWalletData(account?.accountID);
    }
  }, [shouldFetchData]);

  return (
    eachWallet && (
      <View style={styles.viewStyle}>
        <View style={styles.view_Header}>
          <Text style={styles.text_Header}>{"Ví"}</Text>
          {/* a pressable to see full wallet by navigation to "walletscreen" */}
          <Pressable
            style={({ pressed }) => [
              styles.pressable_ViewAll,
              { opacity: pressed ? 0.5 : 1 }
            ]}
            onPress={() => {
              console.log("Pressable to see full wallet");
              navigation.navigate("Transaction");
              console.log("dataParent: ", dataParent);
            }}
          >
            <Text style={styles.text_ViewAll}>{"Xem tất cả  "}</Text>
            <Icon name="chevron-right" size={15} color="#0984e3" />
          </Pressable>
        </View>
        <FlatList
          scrollEnabled={false}
          data={eachWallet || []}
          keyExtractor={(item) => item?.walletID}
          renderItem={({ item }) => {
            return (
              <View style={styles.walletItem}>
                <Text style={styles.name}>{item?.name}</Text>
                <Text style={styles.balance}>{item?.balance}</Text>
              </View>
            );
          }}
        />
      </View>
    )
  );
};
const styles = StyleSheet.create({
  text_ViewAll: {
    color: "#0984e3",
    fontSize: 15,
    fontFamily: "OpenSans_600SemiBold"
  },
  pressable_ViewAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 5
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
  viewStyle: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    borderRadius: 5,
    marginVertical: 5
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "darkgray",
    // borderWidth: 1,
    // borderColor: "darkgray",
    width: "98%",
    flex: 1,
    marginHorizontal: 2
  },

  name: {
    fontSize: 15,
    fontFamily: "OpenSans_500Medium"
  },

  balance: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    color: "seagreen",
    marginLeft: 20
  }
});

export default WalletDashboard;

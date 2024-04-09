import React, { useState, useEffect, useRef, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

import { useSelector, useDispatch } from "react-redux";
import { getAllWallet } from "../../redux/walletSlice";
import walletServices from "../../services/walletServices";

import { setAddTransactionWallet } from "../../redux/transactionSlice";

const ModalWalletComponent = ({ onDataFromChild }) => {
  const account = useSelector((state) => state.authen.account);
  // const wallets = useSelector((state) => state.wallet.wallets);
  const addTransactionWallet = useSelector(
    (state) => state.transaction.addTransactionWallet
  );

  const [nowWallets, setNowWallets] = useState(null);

  const dispatch = useDispatch();

  async function fetchWalletData() {
    try {
      await walletServices
        .getAllWallet(account?.accountID)
        .then((response) => {
          setNowWallets(response);
        })
        .catch((error) => {
          console.error("Error fetchWalletData data:", error);
        });
    } catch (error) {
      console.error("Error fetchWalletData data:", error);
    }
  }

  useEffect(() => {
    if (account) {
      if (nowWallets === null) {
        fetchWalletData();
        // dispatch(getAllWallet(account.accountID));
        //   dispatch(getTotalBalance(account.id));
        //   dispatch(getTotalBalanceEachWallet(account.id));
      }
    }
  }, [account]);

  const WalletItem = ({ wallet }) => {
    return (
      <Pressable
        style={styles.viewWalletItem}
        onPress={() => handleSelectWallet(wallet)}
      >
        <View style={styles.viewWalletItemInfor}>
          <Text style={styles.textWalletItemName}>{wallet.name}</Text>
          <Text style={styles.textWalletBalance}>{wallet.balanceStr}</Text>
        </View>
        {addTransactionWallet?.walletID === wallet.walletID ? (
          <Icon
            style={styles.iconWalletItemSelected}
            name="check"
            size={20}
            color="black"
          />
        ) : null}
      </Pressable>
    );
  };

  // handleSelectWallet
  const handleSelectWallet = (wallet) => {
    console.log("handleSelectWallet, wallet: ", wallet.name);
    dispatch(setAddTransactionWallet(wallet));
    const data = {
      walletID: wallet.walletID,
      isWalletVisible: false
    };
    onDataFromChild(data);
  };

  return (
    <View style={styles.modalContent}>
      <View
        style={{
          width: "50%",
          borderBottomColor: "darkgray",
          borderBottomWidth: 0.5,
          //   alignContent: "center",
          //   justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
          paddingVertical: 5
        }}
      >
        <Text style={styles.textHeader}>Chọn Ví</Text>
      </View>
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={nowWallets}
        renderItem={({ item }) => <WalletItem wallet={item} />}
        keyExtractor={(item) => item.walletID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 25,
    fontFamily: "Inconsolata_400Regular"
  },
  viewWalletItemInfor: {
    flexDirection: "column"
    // alignContent: "flex-start",
    // alignItems: "flex-start"
  },
  viewWalletItem: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "flex-start",
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    backgroundColor: "aliceblue"
  },
  iconWalletItemSelected: {
    marginHorizontal: 30,
    // flexDirection: "column",
    // justifyContent: "center",
    // alignContent: "center",
    // alignItems: "center",
    alignSelf: "center"
  },
  textWalletItemName: {
    fontSize: 22,
    fontFamily: "Inconsolata_600SemiBold",
    textTransform: "capitalize",
    marginHorizontal: 10,
    marginVertical: 1
  },
  textWalletBalance: {
    fontSize: 16,
    fontFamily: "OpenSans_300Light",
    marginHorizontal: 20,
    marginVertical: 1
  },
  modalContent: {
    width: "100%",
    height: "100%",
    borderWidth: 0.5,
    borderColor: "darkgrey",
    backgroundColor: "white",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContinue: {
    backgroundColor: "lightblue",
    borderWidth: 1,
    borderColor: "darkgray",
    height: 40,
    width: "40%",
    marginHorizontal: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  }
});

export default ModalWalletComponent;

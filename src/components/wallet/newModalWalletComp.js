import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Image,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";

// services
import walletServices from "../../services/walletServices";

// components

const NewModalWalletComponent = ({ selected, callback }) => {
  const account = useSelector((state) => state.authen.account);
  const [wallets, setWallets] = useState([]);

  function fetchWalletsData() {
    walletServices
      .getAllWallet(account?.accountID)
      .then((response) => {
        // sort response by banlance
        response?.sort((a, b) => {
          return b.balance - a.balance;
        });

        setWallets(response);
        // console.log("wallets: ", response);
      })
      .catch((error) => {
        console.error("Error fetching wallet data:", error);
        Alert.alert("Lỗi khi lấy dữ liệu ví: ", error);
      });
  }

  useEffect(() => {
    fetchWalletsData();
  }, [account]);

  function handleCallbackAWallet(data) {
    callback(data);
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{"Chọn ví"}</Text>
      </View>
      <FlatList
        data={wallets || []}
        keyExtractor={(item) => item.walletID.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? "#b2bec3"
                  : item?.walletID === selected?.walletID
                    ? "#dfe6e9"
                    : "white",
                borderBottomColor: item?.balance < 0 ? "#d63031" : "darkgray",
                borderLeftColor: item?.balance < 0 ? "#d63031" : "darkgray",
                shadowColor: item.balance < 0 ? "#d63031" : "darkgray"
              },
              styles.walletItem
            ]}
            onPress={() => handleCallbackAWallet(item)}
          >
            <Text style={styles.walletName}>{item?.name}</Text>
            <Text style={styles.walletBalance}>{item?.balanceStr}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
    marginVertical: 10,
    alignItems: "center"
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center"
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "#636e72",
    padding: 5
  },
  headerText: {
    fontSize: 25,
    fontFamily: "OpenSans_500Medium"
  },
  closeButton: {
    padding: 10
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1,
    height: 50,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    paddingHorizontal: 5,
    paddingRight: 10,
    marginVertical: 5,
    borderRadius: 10,
    // shadow
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5
  },
  walletName: {
    fontSize: 20,
    fontFamily: "OpenSans_600SemiBold"
  },
  walletBalance: {
    fontSize: 20,
    fontFamily: "OpenSans_400Regular"
  }
});

export default NewModalWalletComponent;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useProfile from "../../hooks/useProfile";
import { getTotalBalance } from "../../redux/walletSlice";

// services
import walletServices from "../../services/walletServices";

const ProfileDashboard = () => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  // const totalBalance = useSelector((state) => state.wallet.totalBalance);
  const dispatch = useDispatch();

  const [totalBalance, setTotalBalance] = useState(0);

  async function fetchTotalBalance(accountID) {
    console.log("fetchTotalBalance accountID: ", accountID);
    try {
      await walletServices.getTotalBalance(accountID).then((response) => {
        setTotalBalance(response);
      });
    } catch (error) {
      console.error("Error fetchTotalBalance data:", error);
    }
  }

  useEffect(() => {
    if (account?.accountID) {
      fetchTotalBalance(account?.accountID);
    }
  }, [shouldFetchData]);

  return (
    <View style={styles.viewStyle}>
      <Image
        source={{
          uri: account?.pictureURL
            ? account?.pictureURL
            : "https://reactjs.org/logo-og.png"
        }}
        style={styles.avatar}
      />
      <View style={styles.viewInfor}>
        <Text style={styles.accountName}>{account?.accountName}</Text>
        <Text style={styles.emailAddress}>{account?.emailAddress}</Text>
      </View>
      <Text style={styles.totalMoney}>{totalBalance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    borderBlockColor: "darkgray",
    borderWidth: 0.5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 0,
    height: 55,
    marginVertical: 5,
    marginHorizontal: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  viewInfor: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 10
  },
  accountName: {
    fontSize: 20,
    includeFontPadding: false
  },
  avatar: {
    left: 2,
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 30,
    overflow: "hidden"
  },
  emailAddress: {
    fontSize: 10,
    fontStyle: "italic",
    textAlign: "left"
  },
  totalMoney: {
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
    color: "green",
    textAlign: "right",
    margin: 5
  }
});

export default ProfileDashboard;

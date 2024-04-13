import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
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
    // console.log("fetchTotalBalance accountID: ", accountID);
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
    backgroundColor: "white",
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 0,
    height: 55,
    marginHorizontal: 5,
    borderRadius: 5,
    // add shdow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.22,
    // add shadow for Android
    elevation: 5

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
    fontSize: 25,
    fontFamily: "OpenSans_700Bold",
    color: "green",
    textAlign: "right",
    margin: 5
  }
});

export default ProfileDashboard;

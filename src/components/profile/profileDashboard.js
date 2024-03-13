import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useProfile from "../../hooks/useProfile";
import { getTotalBalance } from "../../redux/walletSlice";

const ProfileDashboard = () => {

  const account = useSelector((state) => state.authen.account);
  const totalBalance = useSelector((state) => state.wallet.totalBalance);

  const dispatch = useDispatch();
  useEffect(() => {
    if (account !== null) {
      dispatch(getTotalBalance(account.accountID));
    }
  }, [account, dispatch]);

  return (
    <View style={styles.viewStyle}>
      <Image
        source={{
          uri: account?.pictureURL
            ? account?.pictureURL
            : "https://reactjs.org/logo-og.png",
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
    borderBlockColor: "black",
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 0,
    height: 55,
    marginVertical: 5,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  viewInfor: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 10,
  },
  accountName: {
    fontSize: 20,
    includeFontPadding: false,
  },
  avatar: {
    left: 2,
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 30,
    overflow: "hidden",
  },
  emailAddress: {
    fontSize: 10,
    fontStyle: "italic",
    textAlign: "left",
  },
  totalMoney: {
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
    color: "green",
    textAlign: "right",
    margin: 5,
  },
});

export default ProfileDashboard;

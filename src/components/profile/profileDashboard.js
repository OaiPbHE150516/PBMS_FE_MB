import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, Image } from "react-native";
import useProfile from "../../hooks/useProfile";

const ProfileDashboard = () => {
  const [getProfile, totalBalance, profile, errorMessage] = useProfile();

  return (
    <View style={styles.viewStyle}>
      <Image
        source={{
          uri: profile.pictureURL
            ? profile.pictureURL
            : "https://reactjs.org/logo-og.png",
        }}
        style={styles.avatar}
      />
      <View style={styles.viewInfor}>
        <Text style={styles.accountName}>{profile.accountName}</Text>
        <Text style={styles.emailAddress}>{profile.emailAddress}</Text>
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
    borderRadius: 5,
    marginVertical: 5,
  },
  viewInfor: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 10,
  },
  accountName: {
    fontSize: 20,
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

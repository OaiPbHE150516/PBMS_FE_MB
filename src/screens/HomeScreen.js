import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import pbms from "../api/pbms";
import ProfileDashboard from "../components/profile/profileDashboard";
import WalletDashboard from "../components/wallet/walletDashboard";

const HomeScreen = () => {
  return (
    <View style={styles.parentView}>
      <ProfileDashboard style={styles.profile} />
      <WalletDashboard style={styles.wallet} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: {
    margin: 10,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 30,
  },
  profile: {
  },
  wallet: {
  },
});

export default HomeScreen;

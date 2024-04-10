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

// services
import walletServices from "../../services/walletServices";

const WalletReportScreen = ({ navigation }) => {
  // return hello world
  return (
    <View style={styles.viewStyle}>
      <Text>WalletReportScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default WalletReportScreen;
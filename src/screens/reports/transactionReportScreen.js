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

const TransactionReportScreen = ({ navigation }) => {
  // return hello world
  return (
    <View style={styles.viewStyle}>
      <Text>TransactionReportScreen</Text>
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

export default TransactionReportScreen;
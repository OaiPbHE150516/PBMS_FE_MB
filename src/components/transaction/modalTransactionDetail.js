import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

const ModalTransactionDetail = ({ props, callback }) => {
  return (
    <ScrollView style={styles.viewStyle}>
      <View style={styles.view_Header}>
        <Text style={styles.textStyle}>{"Chi tiết giao dịch"}</Text>
      </View>
      <View style={styles.view_Content}></View>
      {/* <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={() => callback(false)}
      >
        <Text style={styles.textStyle}>Hide Modal</Text>
      </Pressable> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view_Content:{
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  view_Header: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  viewStyle: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    height: "70%"
  },
  textStyle: {
    fontSize: 20,
    color: "black"
  }
});

export default ModalTransactionDetail;

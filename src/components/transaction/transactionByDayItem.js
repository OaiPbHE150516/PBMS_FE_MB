import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList
} from "react-native";

const TransactionByDayItem = ({ props }) => {
  return (
    <View style={styles.viewStyle}>
      <View
        style={[
          styles.viewTime,
          props.category.categoryTypeID == 2
            ? { borderRightColor: "red" }
            : { borderRightColor: "green" }
        ]}
      >
        <Text style={styles.textTime}>{props.timeStr}</Text>
      </View>
      <View style={styles.viewCate}>
        <Text style={styles.textCateName}>{props.category.nameVN}</Text>
        <Text style={styles.textWalletName}>{props.wallet.name}</Text>
      </View>
      <View style={styles.viewNote}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textNote}>
          {props.transactionID}/{props.note}
        </Text>
      </View>
      <View style={styles.viewBalance}>
        <Text
          style={[
            styles.textTotalAmount,
            props.category.categoryTypeID == 2
              ? { color: "red" }
              : { color: "green" }
          ]}
        >
          {props.category.categoryTypeID == 2 ? "-" : ""}
          {props.totalAmountStr}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewCate: {
    width: "25%",
    justifyContent: "center",
    flexDirection: "column",
    marginHorizontal: 5
  },
  viewStyle: {
    // borderBlockColor: "dimgray",
    flex: 1,
    // borderWidth: 1,
    // borderColor: "black",
    flexDirection: "row",
    alignContent: "space-between",
    // backgroundColor: "white",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1
  },
  viewTime: {
    // borderRightColor: "red",
    borderRightWidth: 1.5,
    flexDirection: "row"
  },
  textTime: {
    fontFamily: "Inconsolata_500Medium",
    fontSize: 15,
    alignSelf: "center",
    marginHorizontal: 5
  },
  textNote: {
    fontSize: 12
  },
  viewNote: {
    width: "28%",
    // flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 5
  },
  textTotalAmount: {
    fontSize: 15,
    // fontWeight: "bold",
    fontFamily: "Inconsolata_400Regular",
    textAlign: "right"
  },
  viewBalance: {
    width: "29%",
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: 2
  },
  textCateName: {
    fontSize: 15,
    // fontStyle: "italic",
    textAlign: "left",
    fontWeight: "bold",
    paddingLeft: 5
  },
  textWalletName: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "left",
    paddingLeft: 5
  }
});

export default TransactionByDayItem;

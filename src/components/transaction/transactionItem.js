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

const TransactionItem = ({ props }) => {
  return (
    <View style={styles.viewStyle}>
      <View style={styles.transItem}>
        <View style={styles.viewTime}>
          <Text style={styles.textTimeStr}>{props.timeStr}</Text>
          <Text style={styles.textDateShortStr}>{props.dateShortStr}</Text>
        </View>
        <View style={styles.viewCate}>
          <Text style={styles.textCateName}>{props.category.nameVN}</Text>
          <Text style={styles.textWalletName}>{props.wallet.name}</Text>
        </View>
        {/* <View style={styles.viewImage}>
          {props.imageURL && (
            <Image
              style={{ width: 50, height: 50 }}
              source={{ uri: props.imageURL }}
            />
          )}
        </View> */}
        <View style={styles.viewNote}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textNote}>
            {props.note}
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
            {props.category.categoryTypeID == 2
              ? "- " + props.totalAmountStr
              : "+ " + props.totalAmountStr}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    // borderBlockColor: "dimgray",
    flex: 1,
    // borderWidth: 1,
    // borderColor: "darkgrey",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 0,
    height: 55,
    margin: 2,
    width: "100%",
    // borderBottomWidth: 1,
    // borderBottomColor: "darkgrey",
    // borderLeftWidth: 1,
    // borderLeftColor: "darkgrey",
    // add shadow to the bottom of the item
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
    backgroundColor: "aliceblue",

  },
  viewBalance: {
    width: "30%",
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: 2
  },
  textTotalAmount: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "right"
  },
  viewNote: {
    width: "25%",
    // flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 5
  },
  textNote: {
    fontSize: 12
  },
  viewImage: {
    justifyContent: "center",
    width: "20%"
  },
  transItem: {
    margin: 5,
    flexDirection: "row",
  },
  viewTime: {
    // width: "25%",
    justifyContent: "center",
    flexDirection: "column",
    borderColor: "darkgrey",
    borderRightWidth: 2
  },
  textTimeStr: {
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "right",
    fontWeight: "bold",
    paddingRight: 5
  },
  textDateShortStr: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "right",
    paddingRight: 5
  },
  viewCate: {
    width: "28%",
    justifyContent: "center",
    flexDirection: "column"
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

export default TransactionItem;

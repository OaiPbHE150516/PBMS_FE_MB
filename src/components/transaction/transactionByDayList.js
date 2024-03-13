import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList } from "react-native";

import TransactionByDayItem from "./transactionByDayItem";

const TransactionByDayList = ({ props }) => {
  return (
    <View style={styles.viewStyle}>
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        data={props}
        keyExtractor={(item) => item.transactionID}
        renderItem={({ item }) => {
          return (
            <View style={styles.viewItem}>
              <TransactionByDayItem props={item} />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 2,
    // borderWidth: 1,
    // borderColor: "green"
  }
});

export default TransactionByDayList;

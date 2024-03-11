import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TransactionComponent from "../../components/transaction/transactionComponent";

const TransactionScreen = () => {
  const account = useSelector((state) => state.authen.account);
  const totalBalance = useSelector((state) => state.wallet.totalBalance);

  function DetailsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Details!</Text>
      </View>
    );
  }
  function DetailsScreen2() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Details!</Text>
      </View>
    );
  }

  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.parentView}>
      <View style={styles.viewTotalBalance}>
        <Text style={styles.labelTotalBalance}>Số dư:</Text>
        <Text style={styles.textTotalBalance}>{totalBalance}</Text>
      </View>
      <Tab.Navigator
        style={styles.viewL}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: {
            alignSelf: "flex-end",
            flexDirection: "row"
          },
          tabBarItemStyle: {
            width: "auto",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            alignContent: "center",
            flexDirection: "row"
          },
          tabBarLabelStyle: {
            fontSize: 15,
            fontFamily: "Inconsolata_500Medium",
            color: "darkgray",
            textTransform: "capitalize",
          },
        }}
        initialRouteName="Home1"
      >
        {/* <Tab.Screen name="Profile2" component={DetailsScreen2} /> */}
        <Tab.Screen name="Profile3" component={DetailsScreen2} />
        <Tab.Screen name="Profile4" component={DetailsScreen2} />
        <Tab.Screen name="Home1" component={DetailsScreen} />
        <Tab.Screen name="Profile5" component={DetailsScreen2} />
        {/* <Tab.Screen name="Profile6" component={DetailsScreen2} /> */}
        <Tab.Screen name="Profile7" component={TransactionComponent} />
        {/* <Tab.Screen name="Profile8" component={DetailsScreen2} /> */}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  viewL: {
    minHeight: "90%",
    margin: 10,
  },
  viewTotalBalance: {
    margin: 10,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#ccc",
    borderRadius: 5,
    borderBottomWidth: 1
  },
  labelTotalBalance: {
    fontSize: 15,
    textAlign: "left"
  },
  textTotalBalance: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right"
  }
});

export default TransactionScreen;

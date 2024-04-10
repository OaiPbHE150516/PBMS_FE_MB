import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  ScrollView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// components
import ProfileDashboard from "../components/profile/profilesDashboard";
import WalletDashboard from "../components/wallet/walletDashboard";
import TransactionDashboard from "../components/transaction/transactionDashboard";
import BudgetDashboard from "../components/budget/budgetDashboard";
// import ChartDashboard from "../components/chart/chartDashboard";
import PieChartDashboard from "../components/chart/pieChartDashboard";

const HomeScreen = () => {
  const navigation = useNavigation();
  const account = useSelector((state) => state.authen.account);
  const dispatch = useDispatch();

  const Stack = createStackNavigator();

  useEffect(() => {
    if (account === null) {
      // navigation.navigate("Signin");
      console.log("HomeScreen account: ", account);
    }
  }, [account, dispatch]);

  const DashBoard = () => {
    return (
      // <View style={styles.view_Dashboard}>
      <ScrollView
        style={styles.view_Dashboard}
        showsVerticalScrollIndicator={false}
      >
        <WalletDashboard navigation={navigation} dataParent={"alo"}/>
        <TransactionDashboard style={styles.transaction} />
        <BudgetDashboard style={styles.budget} />
        {/* <ChartDashboard style={styles.chart} /> */}
        <PieChartDashboard style={styles.chart} />
        {/* <BalanceDashboard style={styles.balance} /> */}

        <View style={{ height: 200, flex: 1 }}></View>
      </ScrollView>
      // </View>
    );
  };

  return (
    <View style={styles.viewStyle}>
      <ProfileDashboard style={styles.profile} />
      <DashBoard />
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    // flex: 1,
    width: "100%"
    // height: "98%",
    // borderWidth: 1,
    // borderColor: "black"
  },
  view_Dashboard: {
    marginVertical: 5,
    marginHorizontal: 5,
    height: "100%"
    // borderWidth: 1,
    // borderColor: "black"
    // justifyContent: "center",
    // alignContent: "center",
    // alignItems: "center"
  },
  text: {
    fontSize: 30
  },
  profile: {},
  wallet: {
    backgroundColor: "white"
  },
  transaction: {},
  budget: {},
  chart: {}
});

export default HomeScreen;

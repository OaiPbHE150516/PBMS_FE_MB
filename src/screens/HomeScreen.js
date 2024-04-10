import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { VAR } from "../constants/var.constant";

// components
import ProfileDashboard from "../components/profile/profilesDashboard";
import WalletDashboard from "../components/wallet/walletDashboard";
import TransactionDashboard from "../components/transaction/transactionDashboard";
import BudgetDashboard from "../components/budget/budgetDashboard";
// import ChartDashboard from "../components/chart/chartDashboard";
import PieChartCategoryDashboard from "../components/chart/pieChartCategoryDashboard";

import WalletsManagerScreen from "./wallets/walletsManagerScreen";
import WalletReportScreen from "./reports/walletReportScreen";
import TransactionReportScreen from "./reports/transactionReportScreen";

const HomeScreen = () => {
  const navigation = useNavigation();
  const account = useSelector((state) => state.authen.account);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const Stack = createStackNavigator();

  useEffect(() => {
    if (account !== null) {
      // navigation.navigate("Signin");
      // console.log("HomeScreen account: ", account);
    }
  }, [account]);

  function handleLoading(loading) {
    // wait 1s to show loading
    setTimeout(() => {
      setIsLoading(loading);
    }, 100);
  }

  // const MyListLoader = () => <List />;

  const HomeInStack = ({ navigation }) => {
    return isLoading ? (
      <View style={styles.view_Center}>
        <Text>{"Loading..."}</Text>
      </View>
    ) : (
      <View>
        <ProfileDashboard style={styles.profile} />
        <ScrollView
          style={styles.view_Dashboard}
          showsVerticalScrollIndicator={false}
        >
          <PieChartCategoryDashboard style={styles.chart} />
          <BudgetDashboard style={styles.budget} />
          <WalletDashboard navigation={navigation} />
          <TransactionDashboard navigation={navigation} />
          {/* <ChartDashboard style={styles.chart} /> */}
          {/* <BalanceDashboard style={styles.balance} /> */}
          <View style={{ height: 200, flex: 1 }}></View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.viewStyle}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, refreshPolicy: "never" }}
      >
        <Stack.Screen
          name="HomeInStack"
          component={HomeInStack}
          listeners={({ navigation }) => ({
            focus: () => {
              // console.log("HomeInStack focused");
              handleLoading(false);
            },
            blur: () => {
              // console.log("HomeInStack blurred");
              handleLoading(true);
            }
          })}
        />
        <Stack.Screen
          name={VAR.SCREEN.REPORT.WALLET}
          component={WalletReportScreen}
        />
        <Stack.Screen
          name={VAR.SCREEN.REPORT.TRANSACTION}
          component={TransactionReportScreen}
        />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  view_Center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  viewStyle: {
    // flex: 1,
    width: "100%",
    height: "100%"
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

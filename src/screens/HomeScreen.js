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
import { signin } from "../redux/authenSlice";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// components
import ProfileDashboard from "../components/profile/profilesDashboard";
import WalletDashboard from "../components/wallet/walletDashboard";
import TransactionDashboard from "../components/transaction/transactionDashboard";
import SignInIOS from "./SignInIOS";

const HomeScreen = () => {
  const navigation = useNavigation();
  const account = useSelector((state) => state.authen.account);
  const dispatch = useDispatch();

  const Stack = createStackNavigator();

  useEffect(() => {
    if (account === null) {
      navigation.navigate("Signin");
    }
  }, [account, dispatch]);

  const components = [
    { name: "Wallet", component: <WalletDashboard style={styles.wallet} /> },
    {
      name: "Transaction",
      component: <TransactionDashboard style={styles.transaction} />
    }
    // {
    //   name: "Transaction2",
    //   component: <TransactionDashboard style={styles.transaction} />
    // }c
  ];

  const DashBoard = () => {
    return (
      <View style={styles.parentView}>
        <ProfileDashboard style={styles.profile} />
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={components}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return <View>{item.component}</View>;
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.viewStyle}>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" component={SignInIOS} />
        <Stack.Screen name="Dashboard" component={DashBoard} />
      </Stack.Navigator> */}
      <DashBoard />
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    // flex: 1,
    width: "100%",
    height: "90%"
    // borderWidth: 1,
    // borderColor: "black"
  },
  parentView: {
    margin: 10,
    justifyContent: "space-between"
  },
  text: {
    fontSize: 30
  },
  profile: {},
  wallet: {},
  transaction: {}
});

export default HomeScreen;

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

import ProfileDashboard from "../components/profile/profilesDashboard";
import WalletDashboard from "../components/wallet/walletDashboard";
import TransactionDashboard from "../components/transaction/transactionDashboard";

const HomeScreen = () => {
  const account = useSelector((state) => state.authen.account);
  const dispatch = useDispatch();

  useEffect(() => {
    if (account === null) {
      dispatch(
        signin(
          "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1ZTU1MTA3NDY2YjdlMjk4MzYxOTljNThjNzU4MWY1YjkyM2JlNDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NjE5ODU5ODczOTAtc2I4NDh1Zzl2bGxuMmxlbW5jb2xlZnUxNWNrYzdsamcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NjE5ODU5ODczOTAtc2I4NDh1Zzl2bGxuMmxlbW5jb2xlZnUxNWNrYzdsamcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5MTE1NjYzNzcwMTY2MTUzMTMiLCJoZCI6ImZwdC5lZHUudm4iLCJlbWFpbCI6Im9haXBiaGUxNTA1MTZAZnB0LmVkdS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MDY3MDk3OTUsIm5hbWUiOiJQaGFtIEJhIE9haSAoSzE1IEhMKSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJREVrY2loQUkwdFpzLWZ2TkdQMlJUSFAtQzNsR0VEem1sSVpUMnlZZ2JnUGs9czk2LWMiLCJnaXZlbl9uYW1lIjoiUGhhbSBCYSBPYWkiLCJmYW1pbHlfbmFtZSI6IihLMTUgSEwpIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE3MDY3MTAwOTUsImV4cCI6MTcwNjcxMzY5NSwianRpIjoiMWM0YmRjMDNjNTc0NDY3NDNkYTE4NGIyYjM2ODkyOTU0OTllMTcyMCJ9.DMatV9Pz8yIFV7JWeTLQKg4W0ykPjUI8WdH8ZOCKm7qDu8fVnDjTkxgdbYFx3o8uCCDJU1Wkn-UDUz7HKypjfoNke8qA-AijbXLtInj4VT82ieyw3TlxtKWLWegzWWRzrbkRprlZXB5e2e52T0i9My3jwNbIU7XptKb2d5bNRYZz1nZkdb1fLsVVzo3slm82-uFItOgI_vcIRfzU0ENmstHZ2RSE53fCNjDwJ9FaU8b4nQZFOpiZ2fl4_dTCxHBCFfEh5PgBRV_spcehn1akVgbLt7uYsQ_jA8hMA2bQROHaGtJnBkcqC9ip2KTmvM8DpLECjAz0ATPcBNvb-3WM0w"
        )
      );
    }
  }, [account, dispatch]);

  const components = [
    { name: "Wallet", component: <WalletDashboard style={styles.wallet} /> },
    {
      name: "Transaction",
      component: <TransactionDashboard style={styles.transaction} />
    },
    // {
    //   name: "Transaction2",
    //   component: <TransactionDashboard style={styles.transaction} />
    // }
  ];

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

const styles = StyleSheet.create({
  parentView: {
    margin: 10,
    justifyContent: "space-between"
  },
  text: {
    fontSize: 30
  },
  profile: {},
  wallet: {},
  transaction: {
  }
});

export default HomeScreen;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import pbms from "../api/pbms";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../redux/authenSlice";

const TestScreen = () => {
  const account = useSelector((state) => state.authen.account);
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     dispatch(signin("test"));
  //   }, []);

  return (
    <View style={styles.parentView}>
      <Text style={styles.text}>Test Screen</Text>
      <Button title="Sign in" onPress={() => dispatch(signin("test"))} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: {
    margin: 10,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 30,
  },
});

export default TestScreen;

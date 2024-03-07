import React from "react";
import { Text, StyleSheet, View } from "react-native";

const ComponentScreen = () => {
  const greeting = "Hi there!";
  // a variable representing the html tag
  const myName = <Text style={styles.subHeader}>BaOai</Text>;

  const name = "BaOai";
  return (
    <View>
      <Text style={styles.text}>Getting started with React Native!</Text>
      <Text style={styles.subHeader}>My name is {name}</Text>
      <Text>{greeting}/{myName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 45,
    color: "blue",
  },
  subHeader: {
    fontSize: 20,
  },
});

export default ComponentScreen;

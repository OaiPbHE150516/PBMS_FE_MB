import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  Pressable
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";

const OnboardingModalComp = ({ navigation, data, callback }) => {
  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;
  return (
    <View style={styles.view_Modal_Background}>
      <Pressable
        onPress={() => {
          callback();
        }}
        style={styles.pressable_CloseModal}
      />
      <View style={styles.view_MainContent}>
        <View style={styles.view_MainContent_Title}>
          <Text style={styles.text_MainContent_Title}>Hello World</Text>
        </View>
      </View>
      <Pressable
        onPress={() => {
          callback();
        }}
        style={styles.pressable_CloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text_MainContent_Title: {
    fontSize: 20,
    fontFamily: "OpenSans_600SemiBold"
  },
  view_MainContent_Title: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#636e72"
  },
  view_MainContent: {
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  pressable_CloseModal: {
    width: "100%",
    flex: 1
  },
  view_Modal_Background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default OnboardingModalComp;

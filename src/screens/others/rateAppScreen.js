import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Image,
  Share,
  Linking
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome6";

const RateAppScreen = ({ navigation }) => {
  const supportedURL = "https://google.com";
  const onRate = async () => {
    try {
      const supported = await Linking.canOpenURL(supportedURL);
      if (supported) {
        await Linking.openURL(supportedURL);
      } else {
        Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
      }
      Linking.openURL(supportedURL);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.viewStyle}>
      <View
        style={{
          // flex: 1,
          width: "100%",
          height: "50%",
          borderWidth: 1,
          borderColor: "darkgray",
          marginHorizontal: 10,
          paddingHorizontal: 5,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>{"RateAppScreen"}</Text>
        <Pressable
          onPress={onRate}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "lightgray" : "#74b9ff",
              marginTop: 20,
              padding: 10,
              flexDirection: "row",
              width: "50%",
              justifyContent: "space-around",
              alignContent: "center",
              alignItems: "center",
              borderRadius: 10,
              borderBottomWidthdth: 0.5,
              borderBottomColor: "#2d3436"
            }
          ]}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: "OpenSans_300Light",
              color: "#2d3436"
            }}
          >
            {"Đánh giá ứng dụng"}
          </Text>
          <Icon name="ranking-star" size={30} color="#2d3436" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
});

export default RateAppScreen;

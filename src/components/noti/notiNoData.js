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
  Share
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome6";

const NotiNoData = ({ navigation, title }) => {
  const LOGO_URI = "../../../assets/images/logo.png";
  return (
    <View style={styles.view_NoData}>
      <Image source={require(LOGO_URI)} style={styles.image_Logo_NoData} />
      <Text style={styles.text_NoData}>
        {title ? title : "Không có dữ liệu"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text_NoData: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular"
  },
  view_NoData: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    // borderWidth: 1,
    width: "100%",
    height: "100%"
  },
  image_Logo_NoData: {
    flex: 1,
    width: "75%",
    height: "75%",
    resizeMode: "contain"
  }
});

export default NotiNoData;

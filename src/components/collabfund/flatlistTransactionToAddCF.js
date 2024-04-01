import React, { useState, useEffect } from "react";
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
  Animated,
  Image
} from "react-native";
// node_modules library
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";

// components

const FlatListTransactionToAddCF = ({ callback }) => {

  const onHandlePress = () => {
    callback({ data: "data" });
  };

  return (
    <View>
      <Text>FlatListTransactionToAddCF</Text>
      <Pressable onPress={() => onHandlePress()}>
        <Text>Press me</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});

export default FlatListTransactionToAddCF;

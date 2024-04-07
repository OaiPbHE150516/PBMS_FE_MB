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
  ScrollView
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome6";

const AnInputInvoiceScanning = ({
  iconName,
  textLabelTop,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  isHasIcon
}) => {
  return (
    <View style={styles.viewAnInputInvoice}>
      {isHasIcon && (
        <Icon name="grip-lines-vertical" size={35} color="darkgrey" />
      )}
      <View
        style={[
          styles.viewInsideInputInvoice,
          { width: isHasIcon ? "90%" : "100%" }
        ]}
      >
        <Text style={styles.textLabelInputInvoice}>{textLabelTop}</Text>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={styles.textInputInvoice}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textLabelInputInvoice: {
    fontSize: 15,
    fontFamily: "OpenSans_300Light_Italic",
    top: -7,
    left: 5,
    zIndex: 2,
    backgroundColor: "white",
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    borderRadius: 10
  },
  viewInsideInputInvoice: {
    height: "100%",
    borderColor: "darkgrey",
    borderWidth: 1,
    borderRadius: 5
  },
  textInputInvoice: {
    fontFamily: "Inconsolata_400Regular",
    fontSize: 22,
    top: -7,
    paddingHorizontal: 5,
    paddingVertical: 5
    // borderColor: "darkgrey",
    // borderWidth: 1,
  },
  viewAnInputInvoice: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    // marginHorizontal: 10,
    marginVertical: 5
    // borderColor: "green",
    // borderWidth: 1,
    // paddingVertical: 5,
    // paddingHorizontal: 5
  }
});

export default AnInputInvoiceScanning;

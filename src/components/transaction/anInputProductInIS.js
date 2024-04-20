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

const AnInputProductInIS = ({
  iconName,
  placeholder,
  name,
  quanity,
  unitprice,
  tag,
  amount,
  editable,
  onChangeTextName,
  onChangeTextQuanity,
  onChangeTextUnitPrice,
  onChangeTextTag,
  onChangeTextAmount,
  secureTextEntry
}) => {
  useEffect(() => {
    if (!placeholder) {
      placeholder = "Enter your text here";
    }
  }, []);
  return (
    <View style={styles.viewAnInputInvoice}>
      <View
        style={[styles.viewProductName, { maxWidth: "60%", minWidth: "60%" }]}
      >
        <TextInput
          editable={editable}
          value={name}
          multiline={true}
          // numberOfLines={2}
          lineBreakStrategyIOS="standard"
          style={[
            styles.textInputInvoice,
            {
              fontSize: 20,
              textTransform: "capitalize",
              fontFamily: "Inconsolata_400Regular"
            }
          ]}
          onChangeText={onChangeTextName}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <TextInput
            editable={editable}
            value={unitprice}
            style={[styles.textInputInvoice, { fontSize: 16 }]}
            onChangeText={onChangeTextUnitPrice}
            keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
          />
          <TextInput
            editable={editable}
            value={tag}
            style={[styles.textInputInvoice, styles.text_Tag]}
            onChangeText={onChangeTextTag}
          />
        </View>
      </View>
      <TextInput
        editable={editable}
        value={quanity}
        style={[styles.textInputInvoice, { maxWidth: "10%", fontSize: 16 }]}
        onChangeText={onChangeTextQuanity}
        //numberic keyboard
        keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
      />
      <TextInput
        editable={editable}
        value={amount}
        style={[
          styles.textInputInvoice,
          { fontSize: 16, maxWidth: "40%", minWidth: "30%", textAlign: "right" }
        ]}
        keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
        onChangeText={onChangeTextAmount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text_Tag: {
    fontSize: 16,
    fontFamily: "Inconsolata_400Regular",
    fontStyle: "italic",
    textTransform: "capitalize",
    // maxWidth: "40%",
    // minWidth: "30%",
    textAlign: "right",
    borderBottomWidth: 0.5,
    borderBottomColor: "darkgray",
    paddingHorizontal: 2,
    marginHorizontal: 10
  },
  viewProductName: {
    height: "auto"
  },
  viewAnInputInvoice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 2,
    maxWidth: "100%",
    minWidth: "100%",
    minHeight: 50,
    maxHeight: 100,
    borderBottomColorColor: "darkgrey",
    borderBottomWidth: 1,
    borderRadius: 5
  },
  textInputInvoice: {
    // fontSize: 20,
    fontFamily: "OpenSans_400Regular",
    // width: "auto",
    // maxWidth: "100%",
    height: "auto",
    paddingHorizontal: 10,
    // borderColor: "darkgray",
    // borderWidth: 1,
    // borderRadius: 5,
    marginVertical: 2
  }
});

export default AnInputProductInIS;

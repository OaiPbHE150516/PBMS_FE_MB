import React, { useState, useEffect, useRef, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Button
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabCamera from "./tabCamera";
import Icon from "react-native-vector-icons/FontAwesome6";

const Tab = createMaterialTopTabNavigator();

const ModalTakeCamera = ({ onDataFromChild }) => {
  function handleContinue() {
    onDataFromChild({
      isCameraVisible: false
    });
  }

  function handleCancel() {
    onDataFromChild({
      isCameraVisible: false
    });
  }

  const handleDataFromTabCamera = (data) => {
    console.log("handleDataFromTabCamera, data: ", data);
  };

  const Tab2 = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Tab 2</Text>
        <View style={styles.modalViewButton}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => handleContinue()}
          >
            <Text style={styles.textStyle}>Chụp</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => handleCancel()}
          >
            <Text style={styles.textStyle}>Hủy</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.modalView}>
      <View style={styles.modalViewCloseModal}>
        <Pressable
          style={styles.pressableCLoseModal}
          onPress={() => handleCancel()}
        >
          <Text style={styles.textStyle}>Hủy</Text>
          <Icon
            name="caret-down"
            size={20}
            color="white"
            style={styles.iconCloseModal}
          />
        </Pressable>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          swipeEnabled: true,
          lazy: true,

          tabBarIndicatorStyle: { backgroundColor: "tomato" },
          tabBarStyle: {
            alignSelf: "center",
            flexDirection: "row",
            width: Dimensions.get("window").width * 0.9,
            height: 50,
            justifyContent: "center",
            alignContent: "center"
          },
          tabBarItemStyle: {
            // width: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            alignContent: "center",
            flexDirection: "row",
            height: 50,
            width: Dimensions.get("window").width * 0.45
          },
          tabBarLabelStyle: {
            fontSize: 17,
            fontFamily: "Inconsolata_500Medium",
            color: "darkgray",
            textTransform: "capitalize",
            letterSpacing: 1
          }
        }}
      >
        {/* <Tab.Screen name="Camera" component={TabCamera} initialParams={onDataFromChild: handleDataFromTabCamera()}/> */}
        <Tab.Screen name="Camera" component={TabCamera} />
        <Tab.Screen name="Thư viện" component={Tab2} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  iconCloseModal: {},
  modalViewCloseModal: {
    position: "absolute",
    zIndex: 99,
    alignSelf: "center",
    bottom: 2,
    width: "90%",
    height: 30
    // borderColor: "tomato",
    // borderWidth: 1
  },
  pressableCLoseModal: {
    borderRadius: 5,
    backgroundColor: "lightgrey",
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },
  viewTabCamera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    flex: 1
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTextHeader: {
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Inconsolata_500Medium"
  },
  modalViewButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 5
  }
});

export default ModalTakeCamera;

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Switch,
  RefreshControl,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import { ProgressBar } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";

// redux
import { useDispatch, useSelector } from "react-redux";

// libraries

// components

// services
import budgetServices from "../../services/budgetServices";

const SpendingLimitScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  const [listSpendingLimit, setListSpendingLimit] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchAllSpendingLimit() {
    await budgetServices
      .getAllBudget(account?.accountID)
      .then((response) => {
        setListSpendingLimit(response);
      })
      .catch((error) => {
        console.error("Error fetchAllSpendingLimit data:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu danh sách hạn mức chi");
      });
  }

  useEffect(() => {
    if (isFocused) {
      fetchAllSpendingLimit();
    }
  }, [isFocused, shouldFetchData]);

  const ASpendingLimit = ({ item }) => {
    return (
      <View style={styles.budgetItem}>
        <View style={[styles.view_ABudget_Infor, { justifyContent: "center" }]}>
          <Text style={styles.text_budgetName}>{item.budgetName}</Text>
        </View>
        <View style={styles.view_ABudget_Infor}>
          <Text style={styles.text_datestr}>{item.beginDateStr}</Text>
          <Text style={styles.text_datestr}>{item.endDateStr}</Text>
        </View>
        <View style={styles.view_ABudget_Progressbar}>
          <ProgressBar
            progress={item.percentProgress / 100}
            // color={"red"}
            // use switch case to change color, base on percentProgress
            color={
              item.percentProgress < 50
                ? "green" // green
                : item.percentProgress < 80
                  ? "#fdcb6e" // yellow
                  : "#d63031" // red
            }
          />
        </View>
        <View style={styles.view_ABudget_Infor}>
          {item.percentProgress > 50 && (
            <View style={styles.view_remainAmountStr}>
              <Text style={styles.text_remainAmountStr}>
                {item.remainAmountStr}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.view_CurrentAmount,
              {
                left: item.percentProgressStr
              }
            ]}
          >
            <Text
              style={[
                styles.text_currentAmountStr,
                {
                  color:
                    item.percentProgress < 50
                      ? "green" // green
                      : item.percentProgress < 80
                        ? "#fdcb6e" // yellow
                        : "#d63031" // red
                }
              ]}
            >
              {item.currentAmountStr}
            </Text>
          </View>
          <View style={styles.view_TargetAmount}>
            <Text style={styles.text_targetAmount}>{item.targetAmountStr}</Text>
          </View>
        </View>
      </View>
    );
  };

  // return hello world in center screen
  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <Pressable
          style={styles.pressableBack}
          onPress={() => {
            handleBack();
          }}
        >
          <Icon name="chevron-left" size={22} color="#3498db" />
        </Pressable>
        <Text style={styles.modalTextHeader}>{"Quản lý hạn mức chi"}</Text>
      </View>
      <FlatList
        style={styles.flatList_Budgets}
        data={listSpendingLimit}
        renderItem={ASpendingLimit}
        keyExtractor={(item) => item.budgetID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pressableBack: {
    alignSelf: "flex-start",
    margin: 2,
    position: "absolute",
    top: 2,
    left: 8,
    flex: 1,
    // borderWidth: 1,
    width: "20%"
  },
  viewHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderBottomColor: "darkgray",
    borderBottomWidth: 0.25,
    // add shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 2
  },
  modalTextHeader: {
    fontSize: 30,
    // fontWeight: "bold",
    fontFamily: "Inconsolata_500Medium"
    // marginTop: 10
  },
  flatList_Budgets: {
    width: "100%"
  },
  view_remainAmountStr: {
    position: "absolute",
    zIndex: 2,
    left: 0
  },
  text_remainAmountStr: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    color: "#d63031",
    textAlign: "left"
  },
  text_ViewAll: {
    color: "#0984e3",
    fontSize: 15,
    fontFamily: "OpenSans_600SemiBold"
  },
  pressable_ViewAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 5,
    // borderWidth: 1,
    width: "50%"
  },
  text_currentAmountStr: {
    fontSize: 16,
    fontFamily: "OpenSans_600SemiBold"
  },
  text_budgetName: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    alignSelf: "center"
  },
  text_Header: {
    fontSize: 15,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "center"
  },
  view_Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5
    // borderBottomWidth: 1,
    // borderBottomColor: "lightgray"
  },
  view_CurrentAmount: {
    position: "absolute",
    zIndex: 1
  },
  view_TargetAmount: {
    right: 0,
    flex: 1
  },
  text_targetAmount: {
    fontSize: 20,
    fontFamily: "OpenSans_600SemiBold",
    textAlign: "right"
  },
  text_datestr: {
    fontSize: 14,
    fontFamily: "OpenSans_300Light"
  },
  view_ABudget_Infor: {
    flexDirection: "row",
    justifyContent: "space-between"
    // borderWidth: 0.5
  },
  view_ABudget_Progressbar: {
    width: "100%",
    marginTop: 2,
    marginBottom: 4
  },
  budgetItem: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "darkgray",
    width: "100%"
    // height: 100
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    height: "100%"
  }
});

export default SpendingLimitScreen;

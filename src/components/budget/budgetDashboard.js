import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
  Pressable
} from "react-native";
import { ProgressBar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome6";
import { VAR } from "../../constants/var.constant";

// redux & slice
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../redux/dataSlice";

// services
import budgetServices from "../../services/budgetServices";

const BudgetDashboard = ({ navigation }) => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const [eachBudget, setEachBudget] = useState({});

  async function fetchBudgetData(accountID) {
    // console.log("fetchBudgetData accountID: ", accountID);
    try {
      await budgetServices.getAllBudget(accountID).then((response) => {
        // set EachBudget is top 2 budget of response
        // console.log("response fetchBudgetData: ", response);
        setEachBudget(response?.slice(0, 2));
      });
    } catch (error) {
      console.log("Error fetchBudgetData data:", error);
    }
  }

  useEffect(() => {
    if (account?.accountID) {
      fetchBudgetData(account?.accountID);
    }
  }, [shouldFetchData]);

  return (
    eachBudget && (
      <View style={styles.viewStyle}>
        <View style={styles.view_Header}>
          <Text style={styles.text_Header}>
            {eachBudget.length > 0
              ? "Ngân sách hiện tại"
              : "Không có ngân sách nào"}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.pressable_ViewAll,
              { opacity: pressed ? 0.5 : 1 }
            ]}
            onPress={() => {
              // callback();
              navigation.push(VAR.SCREEN.SPENDING_LIMIT_SCREEN);
            }}
          >
            {/* <Text style={styles.text_ViewAll}>{"Xem báo cáo "}</Text> */}
            <Icon name="chevron-right" size={15} color="#0984e3" />
          </Pressable>
        </View>
        <FlatList
          data={eachBudget}
          scrollEnabled={false}
          keyExtractor={(item) => item.budgetID}
          renderItem={({ item }) => {
            return (
              <View style={styles.budgetItem}>
                <View
                  style={[
                    styles.view_ABudget_Infor,
                    { justifyContent: "center" }
                  ]}
                >
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
                    <Text style={styles.text_targetAmount}>
                      {item.targetAmountStr}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
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
  viewStyle: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    borderRadius: 5,
    marginVertical: 5
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
  name: {
    fontSize: 18,
    fontWeight: "bold"
  },
  balance: {
    fontSize: 16
  }
});

export default BudgetDashboard;

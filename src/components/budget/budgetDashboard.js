import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList
} from "react-native";
import { ProgressBar } from "react-native-paper";

// redux & slice
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../redux/dataSlice";

// services
import budgetServices from "../../services/budgetServices";

const BudgetDashboard = () => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const [eachBudget, setEachBudget] = useState({});

  async function fetchBudgetData(accountID) {
    console.log("fetchBudgetData accountID: ", accountID);
    try {
      await budgetServices.getAllBudget(accountID).then((response) => {
        // set EachBudget is top 2 budget of response
        // console.log("response fetchBudgetData: ", response);
        setEachBudget(response?.slice(0, 2));
      });
    } catch (error) {
      console.error("Error fetchBudgetData data:", error);
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
                        ? "#00b894" // green
                        : item.percentProgress < 80
                          ? "#fdcb6e" // yellow
                          : "#d63031" // red
                    }
                  />
                </View>
                <View style={styles.view_ABudget_Infor}>
                  <View
                    style={[
                      styles.view_CurrentAmount,
                      {
                        left: item.percentProgressStr
                      }
                    ]}
                  >
                    <Text style={[styles.text_datestr, {}]}>
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
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray"
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
    justifyContent: "center",
    flex: 1,
    borderWidth: 0.5,
    borderColor: "darkgray",
    borderRadius: 5,
    marginVertical: 10
  },
  budgetItem: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
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

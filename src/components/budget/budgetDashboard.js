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
        setEachBudget(response.slice(0, 2));
      });
    } catch (error) {
      console.error("Error fetchBudgetData data:", error);
    }
  }

  useEffect(() => {
    fetchBudgetData(account.accountID);
  }, [shouldFetchData]);

  return (
    eachBudget && (
      <View style={styles.viewStyle}>
        <FlatList
          data={eachBudget}
          keyExtractor={(item) => item.budgetID}
          renderItem={({ item }) => {
            return (
              <View style={styles.budgetItem}>
                <Text style={styles.name}>{item.budgetName}</Text>
                <Text style={styles.balance}>{item.remainAmountStr}</Text>
                <View
                  style={{
                    width: "50%",
                  }}
                >
                  <ProgressBar progress={0.5} color={"red"} />
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
  viewStyle: {
    justifyContent: "center",
    flex: 1
  },
  budgetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray"
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

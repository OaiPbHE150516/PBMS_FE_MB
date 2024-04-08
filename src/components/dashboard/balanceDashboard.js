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
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid
} from "react-native-gifted-charts";

// redux & slice
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../redux/dataSlice";

// services
import dashboardServices from "../../services/dashboardServices";

const BalanceDashboard = () => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  const [balanceAllByDay, setBalanceAllByDay] = useState([]);
  const data = [{ value: 15 }, { value: 30 }, { value: 26 }, { value: 100 }];
  const [balanceAllByDayDataValue, setBalanceAllByDayDataValue] = useState([]);

  async function fetchBalanceAllByDay(accountID) {
    await dashboardServices
      .getBalanceAllByDay(accountID)
      .then((response) => {
        setBalanceAllByDay(response);
        let balanceAllByDayDataValue = response?.listAfter?.map((item) => ({
          value: Math.round(item.totalAmount),
          label: item.transactionCount.toString(),
          valuestr: item.totalAmountStr
        }));
        // only get last 10 days of data
        // balanceAllByDayDataValue = balanceAllByDayDataValue.slice(-10);
        setBalanceAllByDayDataValue(balanceAllByDayDataValue);
      })
      .catch((error) => {
        console.error("Error fetchBalanceAllByDay Dashboard data:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu số dư theo ngày");
      });
  }

  useEffect(() => {
    fetchBalanceAllByDay(account.accountID);
  }, [shouldFetchData]);

  return (
    <View style={styles.viewStyle}>
      <View style={styles.view_Header}>
        <Text style={styles.text_Header}>Số dư theo ngày</Text>
      </View>
      <View
        style={{
          // width: "100%",
          // justifyContent: "center",
          // flex: 1,
          // alignItems: "center",
          borderWidth: 1,
          borderColor: "black"
          // margin: 20
        }}
      >
        <LineChart
          areaChart
          isAnimated
          initialSpacing={10}
          thickness={2}
          noOfSections={5}
          rulesType="solid"
          xAxisThickness={1}
          yAxisWidth={150}
          focusEnabled={false}
          animationDuration={5000}
          backgroundColor="transparent"
          data={balanceAllByDayDataValue}
          startFillColor="rgb(46, 217, 255)"
          startOpacity={0.8}
          endFillColor="rgb(203, 241, 250)"
          endOpacity={0.3}
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: "lightgray",
            pointerStripWidth: 2,
            pointerColor: "lightgray",
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 150,
                    justifyContent: "center",
                    marginTop: -30,
                    marginLeft: -40
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      marginBottom: 6,
                      textAlign: "center"
                    }}
                  >
                    {items[0].label}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: "white"
                    }}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      {items[0].valuestr}
                    </Text>
                  </View>
                </View>
              );
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    // width: "100%",
    justifyContent: "center"
    // flex: 1
  },
  view_Header: {
    // width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10
  },
  text_Header: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default BalanceDashboard;

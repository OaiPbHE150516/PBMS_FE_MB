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
import walletServices from "../../services/walletServices";

const BalanceDashboard = () => {
  const account = useSelector((state) => state.authen?.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  const [balanceAllByDay, setBalanceAllByDay] = useState([]);
  const [balanceAllByDayDataValue, setBalanceAllByDayDataValue] = useState([]);

  const [balanceAllByDayAWallet, setBalanceAllByDayAWallet] = useState([]);
  const [balanceAllByDayAWalletDataValue, setBalanceAllByDayAWalletDataValue] =
    useState([]);

  const [walletData, setWalletData] = useState([]);

  const dispatch = useDispatch();

  async function fetchBalanceAllByDay(accountID) {
    await dashboardServices
      .getBalanceAllByDay(accountID)
      .then((response) => {
        // setBalanceAllByDay(response);
        let balanceAllByDayDataValue = response?.listAfter?.map((item) => ({
          value: Math.round(item.totalAmount),
          label: item.transactionCount.toString(),
          valuestr: item.totalAmountStr
        }));
        // console.log("balanceAllByDayDataValue: ", balanceAllByDayDataValue);
        // only get last 10 days of data
        // balanceAllByDayDataValue = balanceAllByDayDataValue.slice(-10);
        setBalanceAllByDayDataValue(balanceAllByDayDataValue);
      })
      .catch((error) => {
        console.log("Error fetchBalanceAllByDay Dashboard data:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu số dư theo ngày");
      });
  }

  async function fetchBalanceAllByDayAWallet(accountID, walletID) {
    await dashboardServices
      .getBalanceAllByDayAWallet(accountID, walletID)
      .then((response) => {
        // console.log("fetchBalanceAllByDayAWallet response: ", response);
        setBalanceAllByDayAWallet(response);
        let balanceAllByDayAWalletDataValue = response?.map((item) => ({
          value: Math.round(item.totalAmount / 1000),
          label: item.transactionCount.toString(),
          valuestr: item.totalAmountStr
        }));
        console.log(
          "balanceAllByDayAWalletDataValue: ",
          balanceAllByDayAWalletDataValue
        );
        // only get last 10 days of data
        // balanceAllByDayAWalletDataValue = balanceAllByDayAWalletDataValue.slice(-10);
        setBalanceAllByDayAWalletDataValue(balanceAllByDayAWalletDataValue);
      })
      .catch((error) => {
        console.log(
          "Error fetchBalanceAllByDayAWallet Dashboard data:",
          error
        );
        Alert.alert("Lỗi", "Không thể lấy dữ liệu số dư theo ngày của ví");
      });
  }

  // fetch all wallet data when component is mounted
  async function fetchAllWallet(accountID) {
    await walletServices
      .getAllWallet(accountID)
      .then((response) => {
        console.log("fetchAllWallet response: ", response);
        // dispatch(fetchAllData(response));
      })
      .catch((error) => {
        console.log("Error fetchAllWallet Dashboard data:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu ví");
      });
  }

  useEffect(() => {
    // fetchBalanceAllByDay(account.accountID);
    if (account?.accountID) {
      fetchBalanceAllByDayAWallet(account?.accountID, 3);
      // fetchAllWallet(account?.accountID);
    }
  }, [shouldFetchData]);

  return (
    <View style={styles.viewStyle}>
      <View style={styles.view_Header}>
        <Text style={styles.text_Header}>Số dư theo ngày</Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: "black"
        }}
      >
        <LineChart areaChart data={balanceAllByDayAWalletDataValue} />
        {/* <LineChart
          areaChart
          curved
          isAnimated
          initialSpacing={10}
          thickness={2}
          noOfSections={5}
          rulesType="solid"
          xAxisThickness={1}
          yAxisWidth={150}
          hideYAxisText={true}
          focusEnabled={true}
          animationDuration={2000}
          backgroundColor="transparent"
          data={balanceAllByDayAWalletDataValue}
          // data2={balanceAllByDayAWalletDataValue}
          startFillColor="rgb(46, 217, 255)"
          startOpacity={0.8}
          endFillColor="rgb(203, 241, 250)"
          endOpacity={0.3}
          hideDataPoints={true}
          scrollToEnd={true}
          // pointerConfig={{
          //   pointerStripHeight: 160,
          //   pointerStripColor: "lightgray",
          //   pointerStripWidth: 2,
          //   pointerColor: "lightgray",
          //   radius: 6,
          //   pointerLabelWidth: 100,
          //   pointerLabelHeight: 90,
          //   activatePointersOnLongPress: true,
          //   autoAdjustPointerLabelPosition: false,
          //   pointerLabelComponent: (items) => {
          //     return (
          //       <View
          //         style={{
          //           height: 90,
          //           width: 150,
          //           justifyContent: "center",
          //           marginTop: -30,
          //           marginLeft: -40
          //         }}
          //       >
          //         <Text
          //           style={{
          //             color: "white",
          //             fontSize: 14,
          //             marginBottom: 6,
          //             textAlign: "center"
          //           }}
          //         >
          //           {items[0].label}
          //         </Text>
          //         <View
          //           style={{
          //             paddingHorizontal: 14,
          //             paddingVertical: 6,
          //             borderRadius: 16,
          //             backgroundColor: "white"
          //           }}
          //         >
          //           <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          //             {items[0].valuestr}
          //           </Text>
          //         </View>
          //       </View>
          //     );
          //   }
          // }}
        /> */}
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

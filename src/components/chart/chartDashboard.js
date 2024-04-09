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

const ChartDashboard = () => {
  const account = useSelector((state) => state.authen?.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  const [walletsLog, setWalletsLog] = useState([]);
  const [walletsLogDataValue, setWalletsLogDataValue] = useState([]);

  const [balanceOfWalletData, setBalanceOfWalletData] = useState([]);
  const [balanceOfWalletData2, setBalanceOfWalletData2] = useState([]);

  async function fetchWalletLogData(accountID) {
    await walletServices
      .getAllWallet(accountID)
      .then((response) => {
        response.sort((a, b) => b.balance - a.balance);
        console.log("response fetchWalletLogData sort: ", response);
        setWalletsLog(response);
        fetchBalanceAllByDayAWallet(accountID, response[0].walletID);
        // let walletsLogDataValue = response?.map((item) => ({
        //   value: Math.round(item.balance),
        //   label: item.name,
        //   valuestr: item.balanceStr
        // }));
        // setWalletsLogDataValue(walletsLogDataValue);
      })
      .catch((error) => {
        console.error("Error fetchWalletLogData Dashboard data:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu các ví từ server");
      });
  }

  async function fetchBalanceAllByDayAWallet(accountID, walletID) {
    await dashboardServices
      .getBalanceAllByDayAWallet(accountID, walletID)
      .then((response) => {
        console.log("response fetchBalanceAllByDayAWallet: ", response);
        // slide last 10 item
        response = response.slice(Math.max(response.length - 10, 1));
        let balanceWalletLog = response?.map((item) => ({
          value: Math.round(item.totalAmount / 1000 ),
          label: item.date
        }));
        setBalanceOfWalletData(balanceWalletLog);
      })
      .catch((error) => {
        console.error(
          "Error fetchBalanceAllByDayAWallet Dashboard data:",
          error
        );
        Alert.alert("Lỗi", "Không thể lấy dữ liệu lịch sử số dư ví từ server");
      });
  }

  const data = [{ value: 1500 }, { value: 3000 }, { value: 2006 }, { value: 4000 }];

  useEffect(() => {
    if (account?.accountID) {
      fetchWalletLogData(account?.accountID);
    }
  }, [shouldFetchData]);

  return (
    <View style={styles.view_Container}>
      {/* <Text>ChartDashboard</Text>
      <LineChart
        areaChart
        curved
        animationDuration={2000}
        isAnimated
        data={balanceOfWalletData}
        initialSpacing={2}
        noOfSections={3}
        rulesType="solid"
        startFillColor="rgb(46, 217, 255)"
        startOpacity={0.8}
        endFillColor="rgb(203, 241, 250)"
        endOpacity={0.3}
        hideDataPoints={true}
        scrollToEnd={true}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  view_Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "darkgray"
  }
});

export default ChartDashboard;

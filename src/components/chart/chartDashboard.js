import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
  Dimensions
} from "react-native";
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

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import colorLibrary from "../../library/colorLibrary";

const ChartDashboard = () => {
  // data from redux
  const account = useSelector((state) => state.authen?.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  // data constance
  // screen width
  // const screenWidth = Dimensions.get("window").width;

  // // data for chart
  // const [walletsLog, setWalletsLog] = useState([]);
  // const [walletsLogDataValue, setWalletsLogDataValue] = useState([]);

  // const [balanceOfWalletData, setBalanceOfWalletData] = useState([]);

  // const [totalAmountByCategory, setTotalAmountByCategory] = useState([]);
  // const [totalAmountByCategoryDataValue, setTotalAmountByCategoryDataValue] =
  //   useState([]);

  // async function fetchWalletLogData(accountID) {
  //   await walletServices
  //     .getAllWallet(accountID)
  //     .then((response) => {
  //       response.sort((a, b) => b.balance - a.balance);
  //       console.log("response fetchWalletLogData sort: ", response);
  //       setWalletsLog(response);
  //       fetchBalanceAllByDayAWallet(accountID, response[0]?.walletID);
  //       // let walletsLogDataValue = response?.map((item) => ({
  //       //   value: Math.round(item.balance),
  //       //   label: item.name,
  //       //   valuestr: item.balanceStr
  //       // }));
  //       // setWalletsLogDataValue(walletsLogDataValue);
  //     })
  //     .catch((error) => {
  //       console.log("Error fetchWalletLogData Dashboard data:", error);
  //       Alert.alert("Lỗi", "Không thể lấy dữ liệu các ví từ server");
  //     });
  // }

  // async function fetchBalanceAllByDayAWallet(accountID, walletID) {
  //   try {
  //     await dashboardServices
  //       .getBalanceAllByDayAWallet(accountID, walletID)
  //       .then((response) => {
  //         console.log("response fetchBalanceAllByDayAWallet: ", response);
  //         // slide last 10 item
  //         response = response?.slice(Math.max(response.length - 10, 1));
  //         let balanceWalletLog = response?.map((item) => ({
  //           value: Math.round(item.totalAmount / 1000),
  //           label: item.date
  //         }));
  //         setBalanceOfWalletData(balanceWalletLog);
  //       });
  //   } catch (error) {
  //     console.log("Error fetchBalanceAllByDayAWallet Dashboard data:", error);
  //     Alert.alert("Lỗi", "Không thể lấy dữ liệu các ví từ server");
  //   }
  // }

  // async function fetchTotalAmountByCategory(accountID, time, type) {
  //   // console.log("fetchTotalAmountByCategory time: ", time);
  //   // console.log("fetchTotalAmountByCategory accountID: ", accountID);
  //   await dashboardServices
  //     .getTotalAmountByCategory(accountID, time, type)
  //     .then((response) => {
  //       console.log("response fetchTotalAmountByCategory: ", response);
  //       setTotalAmountByCategory(response);
  //       let totalAmountByCategoryDataValue =
  //         response?.categoryWithTransactionData?.map((item) => ({
  //           value: item?.percentage,
  //           valueStr: item?.percentageStr,
  //           // random color code
  //           color: colorLibrary.getRandomColor(),
  //           label: item?.category?.nameVN
  //           // // shiftX = 20 if item.category.categoryID === 2, else 0
  //           // shiftX: item?.category?.categoryType?.categoryTypeID === 2 ? 2 : 0,
  //           // // shiftY = 20 if item.category.categoryID === 2, else
  //           // shiftY: item?.category?.categoryType?.categoryTypeID === 2 ? -2 : 0
  //         }));
  //       console.log(
  //         "totalAmountByCategoryDataValue: ",
  //         totalAmountByCategoryDataValue
  //       );
  //       setTotalAmountByCategoryDataValue(totalAmountByCategoryDataValue);
  //     })
  //     .catch((error) => {
  //       console.log(
  //         "Error fetchTotalAmountByCategory Dashboard data:",
  //         error
  //       );
  //       Alert.alert(
  //         "Lỗi",
  //         "Không thể lấy dữ liệu các tổng tiền theo hạng mục từ server"
  //       );
  //     });
  // }
  // useEffect(() => {
  //   if (account?.accountID) {
  //     const time = datetimeLibrary.getTimeWeekBefore(0)[2];
  //     // fetchWalletLogData(account?.accountID);
  //     fetchTotalAmountByCategory(account?.accountID, time, 2);
  //   }
  // }, [shouldFetchData]);

  // const RenderDot = (color) => {
  //   return (
  //     <View
  //       style={{
  //         height: 10,
  //         width: 10,
  //         borderRadius: 5,
  //         backgroundColor: color,
  //         marginRight: 10
  //       }}
  //     />
  //   );
  // };

  return (
    <View style={styles.view_Container}>
      <View style={styles.view_PieChart_Donut_parent}>
        <View style={styles.view_PieChart_Donut}>
          {/* <PieChart
            data={totalAmountByCategoryDataValue}
            donut
            strokeColor="white"
            strokeWidth={2}
            textColor="black"
            radius={screenWidth / 3.5}
            innerRadius={screenWidth / 7}
            textSize={20}
            focusOnPress
            sectionAutoFocus
            showTextBackground
            textBackgroundRadius={26}
          /> */}
        </View>
        <View style={styles.view_PieChart_Donut_Infor}>
          {/* <FlatList
            data={totalAmountByCategoryDataValue || []}
            keyExtractor={(item) => item?.label}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 3
                }}
              >
                <View style={styles.view_PieChart_Dot} />
                <Text style={{ flex: 8 }}>
                  {item?.label + " " + item?.valueStr}
                </Text>
              </View>
            )}
          /> */}
        </View>
      </View>
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
  view_PieChart_Dot: {
    height: 10,
    width: 10,
    borderRadius: 2,
    // backgroundColor: item.color,
    marginHorizontal: 5,
    flex: 1
  },
  view_PieChart_Donut: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    flex: 2.5
    // width: "100%"
  },
  view_PieChart_Donut_Infor: {
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
    // alignItems: "flex-end",
    flex: 1,
    width: "100%"
  },
  view_PieChart_Donut_parent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "flex-end",
    alignItems: "flex-end"
    // borderWidth: 0.5,
    // borderColor: "darkgray"
  },
  view_Container: {
    flex: 1,
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
    // alignItems: "flex-end",
    backgroundColor: "white"
    // borderWidth: 0.5,
    // borderColor: "darkgray"
  }
});

export default ChartDashboard;
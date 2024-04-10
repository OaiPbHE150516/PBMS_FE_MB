import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
  Dimensions,
  ScrollView
} from "react-native";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid
} from "react-native-gifted-charts";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// redux & slice
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../redux/dataSlice";

// services
import dashboardServices from "../../services/dashboardServices";
import walletServices from "../../services/walletServices";

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import colorLibrary from "../../library/colorLibrary";
import { screenWidth } from "react-native-gifted-charts/src/utils";

const Tab = createMaterialTopTabNavigator();

const PieChartDashboard = () => {
  const account = useSelector((state) => state.authen?.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  // data state for PieChart
  const [totalAmountByCategory, setTotalAmountByCategory] = useState([]);
  const [totalAmountByCategoryDataValue, setTotalAmountByCategoryDataValue] =
    useState([]);
  const [dataInCenter, setDataInCenter] = useState({});

  const [dataExpenses, setDataExpenses] = useState({});
  const [dataIncomes, setDataInCenterIncomes] = useState({});
  const [dataTransfers, setDataTransfers] = useState({});

  // data constance
  const screenWidth = Dimensions.get("window").width;
  const TYPE_EXPENSE = 2;
  const TYPE_INCOME = 1;
  const TYPE_TRANSFER = 3;

  useEffect(() => {
    if (account?.accountID) {
      handleToFetchData();
    }
  }, [shouldFetchData]);

  async function handleToFetchData() {
    const time = datetimeLibrary.getTimeWeekBefore(0)[2];
    const dataExpenses = await fetchTotalAmountByCategory(
      account?.accountID,
      time,
      TYPE_EXPENSE
    );
    setDataExpenses(dataExpenses);
    const dataIncomes = await fetchTotalAmountByCategory(
      account?.accountID,
      time,
      TYPE_INCOME
    );
    setDataInCenterIncomes(dataIncomes);

    const dataTransfers = await fetchTotalAmountByType(
      account?.accountID,
      time
    );
    // console.log("dataTransfers: ", dataTransfers);
    setDataTransfers(dataTransfers);
  }

  async function fetchTotalAmountByType(accountID, time) {
    try {
      const response = await dashboardServices.getTotalAmountByType(
        accountID,
        time
      );
      let count = 1;
      let dataChart = response?.categoryWithTransactionData?.map((item) => ({
        value: item?.percentage,
        valueStr: item?.percentageStr,
        color: colorLibrary.getColorByIndex(count++),
        label: item?.categoryType?.name,
        totalAmountStr: item?.totalAmountStr
      }));
      const returnData = {
        dataChart: dataChart,
        data: response
      };
      return returnData;
    } catch (error) {
      console.error("Error fetchTotalAmountByType Dashboard data:", error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy dữ liệu các tổng tiền theo loại từ server"
      );
    }
  }

  async function fetchTotalAmountByCategory(accountID, time, type) {
    try {
      const response = await dashboardServices.getTotalAmountByCategory(
        accountID,
        time,
        type
      );
      let count = colorLibrary.getRandomIndex();
      let dataChart = response?.categoryWithTransactionData?.map((item) => ({
        value: item?.percentage,
        valueStr: item?.percentageStr,
        color: colorLibrary.getColorByIndex(count++),
        label: item?.category?.nameVN,
        totalAmountStr: item?.totalAmountStr
      }));
      const returnData = {
        dataChart: dataChart,
        data: response
      };
      return returnData;
    } catch (error) {
      console.error("Error fetchTotalAmountByCategory Dashboard data:", error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy dữ liệu các tổng tiền theo hạng mục từ server"
      );
    }
  }

  const ALabelPieChartInfor = ({ item }) => {
    return (
      <View style={styles.view_APieChart_Infor}>
        <View
          style={[styles.view_PieChart_Dot, { backgroundColor: item.color }]}
        />
        <Text style={{ flex: 6 }}>{item?.label}</Text>
        {/* <Text style={styles.text_PercentageStr}>{item?.valueStr}</Text> */}
      </View>
    );
  };

  const APieChart = ({ data, title, titleColor }) => {
    // console.log("APieChart data: ", data);
    const [thisDataInCenter, setThisDataInCenter] = useState({});
    function handle(data) {
      // console.log("handle data: ", data);
      setThisDataInCenter({
        number: data?.valueStr,
        text: data?.label,
        amountStr: data?.totalAmountStr
      });
    }

    return (
      <View
        style={[
          styles.view_PieChart_Donut_parent,
          { width: screenWidth * 0.98 }
        ]}
      >
        <View style={styles.view_PieChart_Donut}>
          <PieChart
            data={data?.dataChart || []}
            donut
            strokeColor="white"
            strokeWidth={2}
            textColor="black"
            radius={screenWidth / 4}
            innerRadius={screenWidth / 8}
            textSize={20}
            focusOnPress
            sectionAutoFocus
            extraRadiusForFocused={10}
            showTextBackground
            textBackgroundRadius={26}
            onPress={(data) => {
              handle(data);
            }}
            centerLabelComponent={() => {
              return (
                <View style={styles.view_InCenterPieChart}>
                  <Text style={styles.text_InCenterPieChart_Number}>
                    {thisDataInCenter?.number}
                  </Text>
                  <Text style={styles.text_InCenterPieChart_Amount}>
                    {thisDataInCenter?.amountStr}
                  </Text>
                  <Text style={styles.text_InCenterPieChart_Label}>
                    {thisDataInCenter?.text}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View style={styles.view_PieChart_Donut_Infor}>
          <View style={styles.view_TitleOfPieChart}>
            <Text style={styles.text_TitleOfPieChart}>{title}</Text>
            <Text
              style={[
                styles.text_TitleOfPieChart_TotalAmount,
                { color: titleColor }
              ]}
            >
              {data?.data?.totalAmountOfRangeStr}
            </Text>
          </View>

          <View>
            <FlatList
              data={data?.dataChart || []}
              keyExtractor={(item) => item?.label}
              scrollEnabled={false}
              renderItem={({ item }) => <ALabelPieChartInfor item={item} />}
            />
          </View>
        </View>
      </View>
    );
  };

  // return hello world
  return (
    <View style={styles.view_Container}>
      <View style={styles.view_Header}>
        <Text style={styles.text_Header}>
          {"Tổng tiền các hạng mục tuần này"}
        </Text>
      </View>
      <ScrollView
        style={styles.scrollview_Container_PieChart}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        {dataExpenses && (
          <APieChart data={dataExpenses} title="Tổng chi" titleColor="red" />
        )}
        {dataIncomes && (
          <APieChart data={dataIncomes} title="Tổng thu" titleColor="green" />
        )}
        {dataTransfers && (
          <APieChart
            data={dataTransfers}
            title="Tổng thu chi"
            titleColor="black"
          />
        )}
      </ScrollView>

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
  text_InCenterPieChart_Amount:{
    fontSize: 17,
    fontFamily: "OpenSans_500Medium"
  },
  text_TitleOfPieChart_TotalAmount: {
    fontSize: 20,
    fontFamily: "OpenSans_500Medium",
    textAlign: "right"
    // marginTop: 10
  },
  view_TitleOfPieChart: {
    alignItems: "flex-end",
    alignContent: "center",
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    marginBottom: 30,
    paddingRight: 20
  },
  text_TitleOfPieChart: {
    fontSize: 18,
    fontFamily: "OpenSans_400Regular",
    color: "black",
    textAlign: "right"
  },
  scrollview_Container_PieChart: {
    // borderWidth: 2,
    // borderColor: "red"
  },
  text_InCenterPieChart_Label: {
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    color: "black"
  },
  text_InCenterPieChart_Number: {
    fontSize: 22,
    fontFamily: "OpenSans_700Bold",
    color: "black"
  },
  view_InCenterPieChart: {
    justifyContent: "center",
    alignItems: "center"
  },
  text_PercentageStr: {
    fontSize: 15,
    fontFamily: "OpenSans_500Medium"
  },
  view_APieChart_Infor: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 3,
    marginHorizontal: 2
    // borderWidth: 0.1,
    // borderColor: "darkgray"
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
  },
  view_PieChart_Dot: {
    height: 10,
    width: 10,
    borderRadius: 2,
    marginHorizontal: 5,
    flex: 1
  },
  view_PieChart_Donut: {
    // alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // borderWidth: 0.5,
    // borderColor: "red",
    flex: 2
    // width: "100%"
  },
  view_PieChart_Donut_Infor: {
    // justifyContent: "space-between",
    alignContent: "center",
    // alignItems: "center",
    flex: 1,
    width: "100%"
    // borderWidth: 0.5,
    // borderColor: "darkgray"
  },
  view_PieChart_Donut_parent: {
    flexDirection: "row",
    justifyContent: "space-around",
    // borderWidth: 2,
    // borderColor: "green",
    alignContent: "flex-end",
    paddingHorizontal: 5
  },
  view_Container: {
    flex: 1,
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
    // alignItems: "flex-end",
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
    marginVertical: 5,

    // borderWidth: 0.5,
    // borderColor: "darkgray",
    borderRadius: 5
  }
});

export default PieChartDashboard;

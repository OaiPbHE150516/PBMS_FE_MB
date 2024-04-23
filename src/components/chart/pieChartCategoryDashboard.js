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
  ScrollView,
  Pressable
} from "react-native";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid
} from "react-native-gifted-charts";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SegmentedButtons } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux & slice
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../redux/dataSlice";

// services
import dashboardServices from "../../services/dashboardServices";
import walletServices from "../../services/walletServices";
import transactionServices from "../../services/transactionServices";

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import colorLibrary from "../../library/colorLibrary";
import currencyLibrary from "../../library/currencyLIbrary";
import { screenWidth } from "react-native-gifted-charts/src/utils";

// components
import NotiNoData from "../noti/notiNoData";

const Tab = createMaterialTopTabNavigator();

const PieChartCategoryDashboard = () => {
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
  const [dataTags, setDataTags] = useState({});
  const [dataTransaction, setDataTransaction] = useState({});
  const [maxValueDataTransaction, setMaxValueDataTransaction] = useState(0);

  // screen state
  const [isLoadingDataTransaction, setIsLoadingDataTransaction] =
    useState(true);
  const [isLoadingDataExpenses, setIsLoadingDataExpenses] = useState(false);
  const [isLoadingDataIncomes, setIsLoadingDataIncomes] = useState(false);
  const [isLoadingDataTransfers, setIsLoadingDataTransfers] = useState(false);
  const [isLoadingDataTags, setIsLoadingDataTags] = useState(false);
  const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);

  // data constanst
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const TYPE_EXPENSE = 2;
  const TYPE_INCOME = 1;
  const TYPE_TRANSFER = 3;
  const TAB_WEEK = "week";
  const TAB_MONTH = "month";
  const LOGO_URI = "../../../assets/images/logo.png";
  const GAP_OF_ROUND_UP = 500;

  // state for PieChart
  const [selectedTab, setSelectedTab] = useState(TAB_WEEK);

  useEffect(() => {
    if (account?.accountID) {
      let time = datetimeLibrary.getTimeWeekBefore(0)[2];
      // change time if selectedTab is month
      if (selectedTab === TAB_MONTH) {
        time = datetimeLibrary.getTimeThisMonthByNumMonth(0)[2];
      }
      console.log("time: ", time);
      setIsReadyToDisplay(false);
      handleToFetchData(time);
    }
  }, [shouldFetchData, selectedTab]);

  async function handleToFetchData(time) {
    setDataExpenses({});
    const dataExpenses = await fetchTotalAmountByCategory(
      account?.accountID,
      time,
      TYPE_EXPENSE
    );
    setDataExpenses(dataExpenses);

    setDataInCenterIncomes({});
    const dataIncomes = await fetchTotalAmountByCategory(
      account?.accountID,
      time,
      TYPE_INCOME
    );
    setDataInCenterIncomes(dataIncomes);

    setDataTransfers({});
    const dataTransfers = await fetchTotalAmountByType(
      account?.accountID,
      time
    );
    setDataTransfers(dataTransfers);

    setDataTags({});
    const dataTags = await fetchTotalAmountByTag(account?.accountID, time);
    setDataTags(dataTags);

    setIsLoadingDataTransaction(true);
    setDataTransaction({});
    const dataTransaction = await fetchTransactionData(
      account?.accountID,
      time
    );
    let values = dataTransaction?.dataChart?.map((item) => item?.value);
    let maxValueDataTransaction = Math.max(...values);
    let roundUpMaxValue = currencyLibrary.roundUpToNearestGap(
      maxValueDataTransaction,
      GAP_OF_ROUND_UP
    );
    setMaxValueDataTransaction(roundUpMaxValue);
    setDataTransaction(dataTransaction);
    setIsLoadingDataTransaction(false);

    // setIsLoadingDataExpenses(false);
    // setIsLoadingDataIncomes(false);
    // setIsLoadingDataTransfers(false);
    // setIsLoadingDataTags(false);
    // setIsLoadingDataTransaction(false);
    setIsReadyToDisplay(true);
  }

  async function fetchTransactionData(accountID, time) {
    try {
      let returnData = {};
      await transactionServices
        .getTransactionWeekByDay(accountID, time)
        .then((res) => {
          let dataChart = res?.transactionByDayW?.map((item) => [
            {
              value: item?.totalAmountIn / 1000,
              label: datetimeLibrary.convertDateToDayMonth(
                item?.dayDetail?.date
              ),
              spacing: 5,
              labelWidth: 50,
              totalAmount: item?.totalAmountIn,
              totalAmountStr: item?.totalAmountInStr,
              frontColor: "#00b894",
              sideColor: "#55efc4",
              topColor: "#00cec9"
            },
            {
              value: item?.totalAmountOut / 1000,
              totalAmount: item?.totalAmountOut,
              totalAmountStr: item?.totalAmountOutStr,
              frontColor: "#ff7675",
              sideColor: "#fab1a0",
              topColor: "#e17055"
            }
          ]);
          dataChart = dataChart?.reverse();
          let dataChart2 = [];
          dataChart?.forEach((item) => {
            item?.forEach((subItem) => {
              dataChart2?.push(subItem);
            });
          });
          returnData = {
            dataChart: dataChart2,
            data: res
          };
        })
        .catch((error) => {
          console.log("Error fetchTransactionData Dashboard data:", error);
          Alert.alert("Lỗi", "Không thể lấy dữ liệu các giao dịch từ server");
        });
      return returnData;
    } catch (error) {
      console.log("Error fetchTransactionData Dashboard data:", error);
      Alert.alert("Lỗi", "Không thể lấy dữ liệu các giao dịch từ server");
    }
  }

  async function fetchTotalAmountByType(accountID, time) {
    try {
      let returnData = {};
      await dashboardServices
        .getTotalAmountByType(accountID, time)
        .then((res) => {
          // console.log("res: ", res);
          let count = 1;
          let dataChart = res?.categoryWithTransactionData?.map((item) => ({
            value: item?.percentage,
            valueStr: item?.percentageStr,
            color: colorLibrary.getColorByIndex(count++),
            categoryTypeID: item?.categoryType?.categoryTypeID,
            label:
              item?.categoryType?.categoryTypeID === TYPE_INCOME
                ? "Thu"
                : "Chi",
            totalAmount: item?.totalAmount,
            totalAmountStr: item?.totalAmountStr,
            frontColor:
              item?.categoryType?.categoryTypeID === TYPE_INCOME
                ? colorLibrary.getIncomeColor()
                : colorLibrary.getExpenseColor()
          }));
          // sort dataChart by totalAmount
          // dataChart.sort((a, b) => a.totalAmount - b.totalAmount);
          // sort dataChart by categoryTypeID
          dataChart?.sort((a, b) => a.categoryTypeID - b.categoryTypeID);
          returnData = {
            dataChart: dataChart,
            data: res
          };
        })
        .catch((error) => {
          console.log("Error fetchTotalAmountByType Dashboard data:", error);
          Alert.alert(
            "Lỗi",
            "Không thể lấy dữ liệu các tổng tiền theo loại từ server"
          );
        });
      // console.log("returnData fetchTotalAmountByType: ", returnData);
      return returnData;
    } catch (error) {
      console.log("Error fetchTotalAmountByType Dashboard data:", error);
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
      console.log("Error fetchTotalAmountByCategory Dashboard data:", error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy dữ liệu các tổng tiền theo hạng mục từ server"
      );
    }
  }

  async function fetchTotalAmountByTag(accountID, time) {
    try {
      const response = await dashboardServices.getTotalAmountByTag(
        accountID,
        time
      );
      console.log("fetchTotalAmountByTag response: ", response);
      let count = colorLibrary.getRandomIndex();
      let dataChart = response?.tagWithProductData?.map((item) => ({
        value: item?.percentage,
        valueStr: item?.percentageStr,
        color: colorLibrary.getColorByIndex(count++),
        label: item?.tag?.primaryTag,
        childTags: item?.tag?.childTags,
        tagWithTotalAmounts: item?.tagWithTotalAmounts,
        totalAmountStr: item?.totalAmountStr
      }));
      const returnData = {
        dataChart: dataChart,
        data: response
      };
      return returnData;
    } catch (error) {
      console.log("Error fetchTotalAmountByTag Dashboard data:", error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy dữ liệu các tổng tiền theo nhãn tag từ server"
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
          {data?.dataChart && (
            <PieChart
              data={data?.dataChart || []}
              donut
              isAnimated={true}
              animationDuration={2000}
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
                    <Text style={styles.text_InCenterPieChart_Label}>
                      {thisDataInCenter?.text}
                    </Text>
                    <Text style={styles.text_InCenterPieChart_Amount}>
                      {thisDataInCenter?.amountStr}
                    </Text>
                  </View>
                );
              }}
            />
          )}
          {/* <Text>{data?.dataChart?.length}</Text> */}
          {data?.dataChart?.length === 0 && <NotiNoData />}
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
          <View
            style={[
              styles.view_FlatlistItemInChart,
              { borderLeftWidth: 0.5, borderLeftColor: "darkgray" }
            ]}
          >
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

  const ABarChart = ({ data }) => {
    return (
      <View style={styles.view_AmountExpenseIncome}>
        <View style={styles.view_AmountExpenseIncome_BarChart}>
          <BarChart
            horizontal
            showGrid
            hideRules
            barWidth={20}
            barBorderRadius={5}
            width={screenWidth / 2.5}
            height={screenWidth / 5}
            data={data?.dataChart}
            spacing={15}
            yAxisThickness={0}
            xAxisThickness={0}
            hideYAxisText
            disableScroll
          />
        </View>
        <View style={styles.view_AmountExpenseIncome_Infor}>
          {data?.dataChart && (
            <View>
              <View>
                <Text
                  style={[
                    styles.text_TotalAmount,
                    { color: data?.dataChart[0]?.frontColor }
                  ]}
                >
                  {data?.dataChart[0]?.totalAmountStr}
                </Text>
                <Text
                  style={[
                    styles.text_TotalAmount,
                    { color: data?.dataChart[1]?.frontColor }
                  ]}
                >
                  {data?.dataChart[1]?.totalAmountStr}
                </Text>
              </View>
              <View
                style={{
                  borderTopWidth: 0.5,
                  borderTopColor: "darkgray"
                }}
              >
                <Text
                  style={[
                    styles.text_TotalAmount,
                    {
                      fontSize: 20,
                      fontFamily: "OpenSans_600SemiBold",
                      textAlign: "right",
                      marginVertical: 5
                    }
                  ]}
                >
                  {data?.data.minusAmountOfRangeStr}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const NotiLoadingData = ({ title }) => {
    return (
      <View style={styles.view_Center}>
        <Text style={styles.text_20OInco400}>{title}</Text>
        {/* <Image source={require(LOGO_URI)} style={styles.image_Logo_NoData} /> */}
      </View>
    );
  };

  return (
    <View style={styles.view_Container}>
      <View
        style={[
          styles.view_Header,
          { width: screenWidth, justifyContent: "space-between" }
        ]}
      >
        <Text style={styles.text_Header}>
          {"Tổng tiền thu chi các hạng mục"}
        </Text>
        <View style={styles.view_TimeType}>
          <Pressable
            style={[
              styles.pressable_SegmentButton,
              {
                backgroundColor: selectedTab === TAB_WEEK ? "#b2bec3" : "white"
              }
            ]}
            onPress={() => setSelectedTab(TAB_WEEK)}
          >
            {selectedTab === TAB_MONTH && (
              <View style={{ marginHorizontal: 2 }}>
                <Icon
                  name="calendar-week"
                  size={15}
                  color={selectedTab === TAB_WEEK ? "white" : "#2d3436"}
                />
              </View>
            )}
            {selectedTab === TAB_WEEK && (
              <Text
                style={{
                  color: selectedTab === TAB_WEEK ? "white" : "#2d3436",
                  marginHorizontal: 2
                }}
              >
                {"Tuần"}
              </Text>
            )}
          </Pressable>
          <Pressable
            style={[
              styles.pressable_SegmentButton,
              {
                backgroundColor: selectedTab === TAB_MONTH ? "#b2bec3" : "white"
                // justifyContent:
                //   selectedTab === TAB_MONTH ? "center" : "flex-start"
              }
            ]}
            onPress={() => setSelectedTab(TAB_MONTH)}
          >
            {selectedTab === TAB_WEEK && (
              <View style={{ marginHorizontal: 2 }}>
                <Icon
                  name="calendar"
                  size={15}
                  color={selectedTab === TAB_MONTH ? "white" : "#2d3436"}
                />
              </View>
            )}
            {selectedTab === TAB_MONTH && (
              <Text
                style={{
                  color: selectedTab === TAB_MONTH ? "white" : "#2d3436",
                  marginHorizontal: 2
                }}
              >
                {"Tháng"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
      {isReadyToDisplay ? (
        <View>
          <View style={styles.view_ExpenseIncomeChart}>
            {isLoadingDataTransfers ? (
              <NotiLoadingData
                title={"Đang tải dữ liệu giao dịch thu chi..."}
              />
            ) : (
              dataTransfers && <ABarChart data={dataTransfers} />
            )}
          </View>
          <ScrollView
            style={[
              styles.scrollview_Container_PieChart,
              {
                height: screenHeight / 3
              }
            ]}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
            {isLoadingDataExpenses ? (
              <NotiLoadingData
                title={"Đang tải dữ liệu giao dịch chi tiêu..."}
              />
            ) : (
              dataExpenses && (
                <APieChart
                  data={dataExpenses}
                  title="Tổng chi"
                  titleColor="red"
                />
              )
            )}
            {isLoadingDataIncomes ? (
              <NotiLoadingData title={""} />
            ) : (
              dataIncomes && (
                <APieChart
                  data={dataIncomes}
                  title="Tổng thu"
                  titleColor="green"
                />
              )
            )}
            {isLoadingDataTags ? (
              <NotiLoadingData title={""} />
            ) : (
              dataTags && (
                <APieChart
                  data={dataTags}
                  title="Tổng tiền theo nhãn"
                  titleColor="blue"
                />
              )
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

          <View style={{}}>
            <View style={styles.view_BarChartTransaction}>
              {isLoadingDataTransaction ? (
                <View style={styles.view_NoData}>
                  <NotiNoData title={"Đang tải dữ liệu giao dịch..."} />
                </View>
              ) : (
                <BarChart
                  data={dataTransaction?.dataChart || []}
                  height={250}
                  barWidth={20}
                  spacing={30}
                  hideRules
                  xAxisThickness={1}
                  xAxisColor={"gray"}
                  yAxisThickness={1}
                  yAxisColor={"gray"}
                  yAxisTextStyle={{
                    color: "gray",
                    fontSize: 16,
                    fontFamily: "OpenSans_400Regular"
                  }}
                  noOfSections={3}
                  isAnimated={true}
                  scrollToEnd={true}
                  scrollAnimation={true}
                  scrollAnimationDuration={2000}
                  stepValue={GAP_OF_ROUND_UP}
                  // isThreeD
                  maxValue={maxValueDataTransaction}
                  onPress={(data) => {
                    console.log("data: ", data);
                  }}
                />
              )}
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            width: screenWidth,
            height: screenHeight / 5,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center"
          }}
        >
          <NotiLoadingData title={"Đang tải dữ liệu..."} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text_20OInco400: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular",
    alignSelf: "center",
    textAlign: "center",
    position: "relative"
  },
  view_Center: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  view_BarChartTransaction: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 5
  },
  view_TimeType: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#b2bec3",
    borderRadius: 5,
    marginHorizontal: 5
  },
  text_NoData: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular"
  },
  view_NoData: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    // borderWidth: 1,
    width: "100%",
    height: "100%"
  },
  image_Logo_NoData: {
    flex: 1,
    width: "75%",
    height: "75%",
    resizeMode: "contain"
  },
  pressable_SegmentButton: {
    padding: 5,
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row"
  },
  view_ABarChart_Infor: {
    flex: 1,
    // justifyContent: "center",
    // alignContent: "center",
    // alignItems: "center",
    borderWidth: 0.5,
    borderColor: "darkgray"
  },
  text_TotalAmount: {
    fontSize: 17,
    fontFamily: "OpenSans_500Medium",
    textAlign: "right",
    marginVertical: 5
  },
  view_AmountExpenseIncome_Infor: {
    // backgroundColor: "lightgray",
    flex: 1.5,
    // justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-end",
    alignSelf: "flex-start",
    marginRight: 20
    // borderWidth: 1,
    // borderColor: "blue"
  },
  view_AmountExpenseIncome_BarChart: {
    width: "100%",
    height: "100%",
    flex: 3,
    justifyContent: "center"
    // alignContent: "center",
    // alignItems: "center",
    // borderWidth: 1,
    // borderColor: "green"
  },
  view_AmountExpenseIncome: {
    // borderWidth: 1,
    // borderColor: "red",
    flexDirection: "row",
    width: screenWidth * 0.97,
    height: screenWidth / 4,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  view_ExpenseIncomeChart: {
    // borderWidth: 1,
    // borderColor: "darkgray",
    height: 100,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  view_FlatlistItemInChart: {
    paddingHorizontal: 5
  },
  text_InCenterPieChart_Amount: {
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
    textAlign: "left",
    flexWrap: "wrap",
    flex: 2
  },
  view_Header: {
    flexDirection: "row",
    paddingVertical: 5,
    // borderWidth: 1,
    // borderColor: "darkgray",
    paddingHorizontal: 10,
    alignContent: "center"
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

export default PieChartCategoryDashboard;

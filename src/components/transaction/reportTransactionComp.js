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
import { useNavigation, useIsFocused } from "@react-navigation/native";

// redux & slice
import { useSelector, useDispatch } from "react-redux";

// services
import dashboardServices from "../../services/dashboardServices";

// components

// constants

// library
import datetimeLibrary from "../../library/datetimeLibrary";
import colorLibrary from "../../library/colorLibrary";
import currencyLibrary from "../../library/currencyLIbrary";
import { screenWidth } from "react-native-gifted-charts/src/utils";

const ReportTransactionComp = ({ time }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  const [dataExpenses, setDataExpenses] = useState({});
  const [dataIncomes, setDataInCenterIncomes] = useState({});
  const [dataTransfers, setDataTransfers] = useState({});
  const [dataTags, setDataTags] = useState({});

  // data constance
  const screenWidth = Dimensions.get("window").width;
  const TYPE_EXPENSE = 2;
  const TYPE_INCOME = 1;
  const TYPE_TRANSFER = 3;

  useEffect(() => {
    if (account?.accountID) {
      handleToFetchData();
    }
  }, [account, shouldFetchData]);

  async function handleToFetchData() {
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
    setDataTransfers(dataTransfers);

    const dataTags = await fetchTotalAmountByTag(account?.accountID, time);
    setDataTags(dataTags);
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
        });
      // console.log("returnData fetchTotalAmountByType: ", returnData);
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

  async function fetchTotalAmountByTag(accountID, time) {
    try {
      const response = await dashboardServices.getTotalAmountByTag(
        accountID,
        time
      );
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
      console.error("Error fetchTotalAmountByTag Dashboard data:", error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy dữ liệu các tổng tiền theo tag từ server"
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

  const ACellItem = ({ item }) => {
    const [showDetail, setShowDetail] = useState(false);
    return (
      <Pressable
        style={({ pressed }) => [
          styles.pressable_ACellItem,
          { backgroundColor: pressed ? "#dfe6e9" : "white" }
        ]}
        onPress={() => setShowDetail(!showDetail)}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
            bottom: -10
          }}
        >
          <View
            style={[
              styles.view_PieChart_Dot,
              {
                backgroundColor: item.color,
                flex: 2,
                width: "auto",
                height: 20
              }
            ]}
          />
          <View style={{ flex: 6, marginHorizontal: 5 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "OpenSans_400Regular",
                textAlign: "left"
              }}
            >
              {item?.label}
            </Text>
          </View>
          <View style={{ flex: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "OpenSans_400Regular",
                textAlign: "right"
              }}
            >
              {item?.valueStr}
            </Text>
          </View>
          <View style={{ flex: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "OpenSans_600SemiBold",
                textAlign: "right"
              }}
            >
              {item?.totalAmountStr}
            </Text>
          </View>
        </View>
        {showDetail && (
          <View style={{ bottom: -10, marginHorizontal: 10 }}>
            {item?.tagWithTotalAmounts && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  borderBottomWidth: 0.25,
                  borderBottomColor: "darkgray"
                }}
              >
                <Text
                  style={[
                    styles.text_17OpenSans400,
                    {
                      flex: 2
                    }
                  ]}
                >
                  {"Tag"}
                </Text>
                <Text
                  style={[
                    styles.text_17OpenSans400,
                    {
                      textAlign: "center"
                    }
                  ]}
                >
                  {"Số lượng"}
                </Text>
                <Text
                  style={[
                    styles.text_17OpenSans400,
                    {
                      textAlign: "right"
                    }
                  ]}
                >
                  {"Tổng tiền"}
                </Text>
              </View>
            )}

            <FlatList
              data={item?.tagWithTotalAmounts || []}
              keyExtractor={(item) => item?.tag}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderBottomWidth: 0.15,
                    borderBottomColor: "darkgray"
                  }}
                >
                  <Text
                    style={[
                      styles.text_15OpenSans400,
                      {
                        flex: 2
                      }
                    ]}
                  >
                    {item?.tag}
                  </Text>
                  <Text
                    style={[
                      styles.text_15OpenSans400,
                      {
                        flex: 1,
                        textAlign: "center"
                      }
                    ]}
                  >
                    {item?.numberOfProduct}
                  </Text>
                  <Text
                    style={[
                      styles.text_15OpenSans400,
                      {
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "OpenSans_600SemiBold"
                      }
                    ]}
                  >
                    {item?.totalAmountStr}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </Pressable>
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
      <ScrollView
        style={[
          styles.view_PieChart_Donut_parent,
          { width: screenWidth * 0.98, height: "100%" }
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            // height: "50%",
            width: "100%"
            // borderWidth: 5,
            // borderColor: "blue"
          }}
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
          </View>
        </View>
        <View
          style={{
            // borderWidth: 5,
            // borderColor: "red",
            width: "100%",
            flex: 1
            // height: "50%"
          }}
        >
          <FlatList
            data={data?.dataChart || []}
            keyExtractor={(item) => item?.label}
            scrollEnabled={false}
            renderItem={({ item }) => <ACellItem item={item} />}
            ListFooterComponent={<View style={{ height: 100 }}></View>}
          />
          {/* <View style={{ height: 500 }}></View> */}
        </View>
      </ScrollView>
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

  return (
    <View style={styles.container}>
      <View style={styles.view_Header}>
        <Text style={styles.text_Header}>
          {"Tổng tiền các hạng mục thời gian này: "}
          {time}
        </Text>
      </View>
      <View style={styles.view_ExpenseIncomeChart}>
        {dataTransfers && <ABarChart data={dataTransfers} />}
      </View>
      <ScrollView
        style={styles.scrollview_Container_PieChart}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={true}
      >
        {dataExpenses && (
          <APieChart data={dataExpenses} title="Tổng chi" titleColor="red" />
        )}
        {dataIncomes && (
          <APieChart data={dataIncomes} title="Tổng thu" titleColor="green" />
        )}
        {dataTags && (
          <APieChart
            data={dataTags}
            title="Tổng tiền theo nhãn"
            titleColor="blue"
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text_17OpenSans400: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inconsolata_500Medium"
  },
  text_15OpenSans400: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular"
  },
  pressable_ACellItem: {
    // borderWidth: 2,
    // borderColor: "green",
    flexDirection: "column",
    // alignContent: "center",
    // alignItems: "center",
    width: "95%",
    minHeight: 40,
    height: "auto",
    marginVertical: 5,
    marginHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#b2bec3",
    borderRadius: 10,
    paddingBottom: 10
  },
  container: {
    // flex: 1,
    backgroundColor: "white",
    // alignItems: "center",
    // justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%"
    // borderWidth: 5,
    // borderColor: "green"
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
    // borderColor: "darkgray"
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
    alignContent: "center"
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    // marginBottom: 30,
    // paddingRight: 20
  },
  text_TitleOfPieChart: {
    fontSize: 18,
    fontFamily: "OpenSans_400Regular",
    color: "black",
    textAlign: "right"
  },
  scrollview_Container_PieChart: {
    // borderWidth: 2,
    // borderColor: "red",
    height: "100%"
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
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
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
    alignItems: "center"
    // backgroundColor: "lightgray",
    // borderWidth: 0.5,
    // borderColor: "red",
    // flex: 2
    // width: "100%"
  },
  view_PieChart_Donut_Infor: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end"
    // flex: 1,
    // width: "100%"
    // borderWidth: 0.5,
    // borderColor: "darkgray"
  },
  view_PieChart_Donut_parent: {
    flexDirection: "column",
    // justifyContent: "space-around",
    // borderWidth: 2,
    // borderColor: "red",
    alignContent: "flex-end"
    // paddingHorizontal: 5
  },
  view_Container: {
    flex: 1,
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
    // alignItems: "flex-end",
    backgroundColor: "white",
    // justifyContent: "center",
    flex: 1,
    marginVertical: 5,

    // borderWidth: 0.5,
    // borderColor: "darkgray",
    borderRadius: 5
  }
});

export default ReportTransactionComp;

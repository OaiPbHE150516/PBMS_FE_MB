import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  Pressable,
  Modal
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";

// import TransactionComponent from "../../components/transaction/transactionComponent";
import datetimeLibrary from "../../library/datetimeLibrary";

import { setDatenow } from "../../redux/datedisplaySlice";
import { VAR } from "../../constants/var.constant";

// components
import TransCompTest from "../../components/transaction/transCompTest";
import ReportTransactionComp from "../../components/transaction/reportTransactionComp";

// function pushDataForCompoents() {
//   for (let i = 2; i < 20; i++) {
//     dataWeekForComponents.push({
//       name: datetimeLibrary.getTimeWeekBefore(i)[3],
//       component: TransactionComponent,
//       time: datetimeLibrary.getTimeWeekBefore(i)[2]
//     });
//   }
// }

// services
import walletServices from "../../services/walletServices";

export const TranCompTest = (route) => {
  return <TransCompTest initialParams={{ time: route.params.time }} />;
};

// data component
const Stack = createStackNavigator();

const TransactionScreen = () => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);

  const [isLoading, setIsLoading] = useState(true);

  // data
  const [totalBalance, setTotalBalance] = useState(0);
  const [timeRangeType, setTimeRangeType] = useState(1);

  const [monthDataToShow, setMonthDataToShow] = useState([]);
  const [weekDataToShow, setWeekDataToShow] = useState([]);

  // const
  const WEEK_TIME_RANGE = 1;
  const MONTH_TIME_RANGE = 2;
  const MAX_TIME_RANGE = 20;

  // screen data
  const [isModalMenuVisible, setIsModalMenuVisible] = useState(false);
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  async function fetchTotalBalance(accountID) {
    try {
      await walletServices.getTotalBalance(accountID).then((response) => {
        setTotalBalance(response);
      });
    } catch (error) {
      console.log("Error fetchTotalBalance data:", error);
    }
  }

  const dispatch = useDispatch();

  useEffect(() => {
    // if (account !== null) {
    //   fetchData();
    //   // dispatch(getTotalBalance(account.accountID));
    // }
    if (account?.accountID) {
      fetchTotalBalance(account?.accountID);
    }
    console.log("useEffect timeRangeType: ", timeRangeType);
    // if (isFocused) {
    loadTimeToTab(timeRangeType);
    // }
  }, [shouldFetchData, timeRangeType, isFocused]);

  function handleLoading(loading) {
    // wait 1s to show loading
    // console.log("handleLoading: ", loading);
    // if (!loading) loadTimeToTab();
    // setTimeout(() => {
    //   setIsLoading(loading);
    // }, 1000);
  }

  function loadTimeToTab(time) {
    if (time === 0) return;
    console.log("loadTimeToTab");
    setIsLoading(true);
    for (let i = 2; i < MAX_TIME_RANGE; i++) {
      console.log("time: ", i);
      dataWeekForComponents.push({
        name: datetimeLibrary.getTimeWeekBefore(i)[3],
        time: datetimeLibrary.getTimeWeekBefore(i)[2]
      });
      // same for month
      dataMonthForComponets.push({
        name: datetimeLibrary.getTimeThisMonthByNumMonth(i)[4],
        time: datetimeLibrary.getTimeThisMonthByNumMonth(i)[2]
      });
    }
    setWeekDataToShow([]);
    setWeekDataToShow(dataWeekForComponents);

    setMonthDataToShow([]);
    setMonthDataToShow(dataMonthForComponets);
    setIsLoading(false);
  }

  const TabWeek = createMaterialTopTabNavigator();
  const TabMonth = createMaterialTopTabNavigator();

  const dataMonthForComponets = [
    {
      name: VAR.THIS_MONTH_VN,
      time: datetimeLibrary.getTimeThisMonthByNumMonth(0)[2]
    },
    {
      name: VAR.LAST_MONTH_VN,
      time: datetimeLibrary.getTimeThisMonthByNumMonth(1)[2]
    }
  ];

  const dataWeekForComponents = [
    {
      name: VAR.THIS_WEEK_VI,
      time: datetimeLibrary.getTimeWeekBefore(0)[2]
    },
    {
      name: VAR.LAST_WEEK_VI,
      time: datetimeLibrary.getTimeWeekBefore(1)[2]
    }
  ];

  function fetchData() {
    dispatch(setDatenow(datetimeLibrary.getTimeThisWeek()[2].toString()));
  }

  function handlePressableMenu() {
    console.log("handlePressableMenu");
    setIsModalMenuVisible(true);
  }

  function handleOnPressTimeRange() {
    // change time range, if time range is week, change to month, vice versa
    setTimeRangeType(
      timeRangeType === WEEK_TIME_RANGE ? MONTH_TIME_RANGE : WEEK_TIME_RANGE
    );
    console.log("timeRangeType: ", timeRangeType);
    setIsModalMenuVisible(false);
  }

  const ModalMenu = () => {
    return (
      <View style={styles.view_ModalMenu}>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "lightgray" : "white",
              flexDirection: "row",
              justifyContent: "space-around"
            },
            styles.pressable_AnItemMenu
          ]}
          onPress={handleOnPressTimeRange}
        >
          <Text style={styles.text_AnItemMenu}>{"Khoảng thời gian"}</Text>
          <Text style={[styles.text_AnItemMenu, { fontSize: 20 }]}>
            {timeRangeType === WEEK_TIME_RANGE ? "Tuần" : "Tháng"}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: pressed ? "lightgray" : "white" },
            styles.pressable_AnItemMenu
          ]}
        >
          <Text style={styles.text_AnItemMenu}>{"Menu"}</Text>
        </Pressable>
      </View>
    );
  };

  const SecondScreen = () => {
    return <ReportTransactionComp />;
  };

  const WeekReportScreen = () => {
    return (
      <View style={{
        flex: 1,
        marginHorizontal: 5,
        // borderWidth: 5,
        // borderColor: "green"
        // backgroundColor: "red"
      }}>
        <ReportTransactionComp time={datetimeLibrary.getTimeWeekBefore(0)[2]} />
      </View>
    );
  };

  // same with month
  const MonthReportScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          marginHorizontal: 5,
        }}
      >
        <ReportTransactionComp
          time={datetimeLibrary.getTimeThisMonthByNumMonth(0)[2]}
        />
      </View>
    );
  };

  return (
    <View style={styles.parentView}>
      <View style={styles.view_HeaderScreen}>
        <View style={[styles.viewTotalBalance, { flex: 9 }]}>
          <Text style={styles.labelTotalBalance}>{"Số dư:"}</Text>
          <Text style={styles.textTotalBalance}>{totalBalance}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              // handlePressableMenu();
              setIsModalMenuVisible(true);
            }}
          >
            <Icon name="bars" size={30} color="#2d3436" />
          </Pressable>
        </View>
      </View>
      {timeRangeType === WEEK_TIME_RANGE && !isLoading && (
        <TabWeek.Navigator
          style={styles.viewL}
          screenOptions={tabScreenOptions}
          initialRouteName="ScreenWeek0"
        >
          <TabWeek.Screen
            name={"WeekReportScreen"}
            component={WeekReportScreen}
            options={{
              tabBarLabel: "Báo cáo tuần này"
            }}
          />
          {weekDataToShow?.map((item, index) => {
            return (
              <TabWeek.Screen
                // navigationKey={item?.name}
                key={index}
                name={`ScreenWeek${index}`}
                component={TransCompTest}
                initialParams={{ time: item?.time }}
                options={{
                  tabBarLabel: item?.name
                }}
              />
            );
          }, [])}
        </TabWeek.Navigator>
      )}

      {timeRangeType === MONTH_TIME_RANGE && !isLoading && (
        <TabMonth.Navigator
          style={styles.viewL}
          screenOptions={tabScreenOptions}
          initialRouteName="ScreenMonth0"
        >
          <TabMonth.Screen
            name={"MonthReportScreen"}
            component={MonthReportScreen}
            options={{
              tabBarLabel: "Báo cáo tháng này"
            }}
          />
          {monthDataToShow?.map((item, index) => {
            return (
              <TabMonth.Screen
                // navigationKey={item?.name}
                key={index}
                name={`ScreenMonth${index}`}
                component={TransCompTest}
                initialParams={{ time: item?.time }}
                options={{
                  tabBarLabel: item?.name
                }}
              />
            );
          }, [])}
        </TabMonth.Navigator>
      )}

      <Modal
        visible={isModalMenuVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.view_ModalMenu_Background}>
          <Pressable
            style={{
              flex: 1,
              width: "100%"
              // backgroundColor: "red"
            }}
            onPress={() => {
              setIsModalMenuVisible(false);
            }}
          />
          <View style={styles.view_ModalMenu}>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "lightgray" : "white",
                  flexDirection: "row",
                  justifyContent: "space-around"
                },
                styles.pressable_AnItemMenu
              ]}
              onPress={handleOnPressTimeRange}
            >
              <Text style={styles.text_AnItemMenu}>{"Khoảng thời gian"}</Text>
              <Text style={[styles.text_AnItemMenu, { fontSize: 20 }]}>
                {timeRangeType !== WEEK_TIME_RANGE ? "Tuần" : "Tháng"}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                { backgroundColor: pressed ? "lightgray" : "white" },
                styles.pressable_AnItemMenu
              ]}
            >
              <Text style={styles.text_AnItemMenu}>{"Menu"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const tabScreenOptions = {
  tabBarScrollEnabled: true,
  tabBarStyle: {
    alignSelf: "flex-end",
    flexDirection: "row"
  },
  tabBarItemStyle: {
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "row"
  },
  tabBarLabelStyle: {
    fontSize: 15,
    fontFamily: "Inconsolata_500Medium",
    color: "darkgray",
    textTransform: "none",
    letterSpacing: 0
  },
  tabBarIndicatorStyle: {
    backgroundColor: "tomato"
  },
  swipeEnabled: true,
  lazy: true,
  lazyPreloadDistance: 0
};

const styles = StyleSheet.create({
  view_Center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text_AnItemMenu: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    letterSpacing: 1,
    marginHorizontal: 20
  },
  pressable_AnItemMenu: {
    width: "100%",
    height: 50,
    // marginHorizontal: 10,
    marginVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgray"
  },
  view_ModalMenu: {
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "lightgray",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  view_ModalMenu_Background: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  view_HeaderScreen: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white"
  },
  parentView: {
    width: "100%",
    height: "100%",
    flex: 1
    // borderWidth: 5,
    // borderColor: "green",
  },
  viewL: {
    // minHeight: Dimensions.get("window").height - 200,
    // minHeight: "95%",
    // marginHorizontal: 5
    // marginBottom: 85,
    // flex: 1,
    // backgroundColor: "red",
    // paddingHorizontal: 5,
  },
  viewTotalBalance: {
    // width: "90%",
    margin: 10,
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#ccc",
    borderRadius: 5,
    borderBottomWidth: 1
  },
  labelTotalBalance: {
    fontSize: 18,
    fontFamily: "OpenSans_400Regular",
    textAlign: "left"
  },
  textTotalBalance: {
    fontSize: 25,
    fontFamily: "OpenSans_700Bold",
    textAlign: "right"
    // fontFamily: "Inconsolata_900Black"
  }
});

export default TransactionScreen;
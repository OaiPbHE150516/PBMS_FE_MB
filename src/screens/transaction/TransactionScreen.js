import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// import TransactionComponent from "../../components/transaction/transactionComponent";
import datetimeLibrary from "../../library/datetimeLibrary";

import { setDatenow } from "../../redux/datedisplaySlice";
import { VAR } from "../../constants/var.constant";

import { getTotalBalance } from "../../redux/walletSlice";
import { setTransCompIsLoading } from "../../redux/transactionSlice";
import TransCompTest from "../../components/transaction/transCompTest";

// function pushDataForCompoents() {
//   for (let i = 2; i < 20; i++) {
//     dataForCompoents.push({
//       name: datetimeLibrary.getTimeWeekBefore(i)[3],
//       component: TransactionComponent,
//       time: datetimeLibrary.getTimeWeekBefore(i)[2]
//     });
//   }
// }

export const TranCompTest = (route) => {
  return <TransCompTest initialParams={{ time: route.params.time }} />;
};

const TransactionScreen = () => {
  const account = useSelector((state) => state.authen.account);
  const totalBalance = useSelector((state) => state.wallet.totalBalance);
  // const datenow = useSelector((state) => state.datedisplay.datenow);

  const Tab = createMaterialTopTabNavigator();

  const dispatch = useDispatch();

  const dataForCompoents = [
    {
      name: VAR.THIS_WEEK_VI,
      time: datetimeLibrary.getTimeWeekBefore(0)[2]
    },
    {
      name: VAR.LAST_WEEK_VI,
      time: datetimeLibrary.getTimeWeekBefore(1)[2]
    }
  ];

  for (let i = 2; i < 20; i++) {
    dataForCompoents.push({
      name: datetimeLibrary.getTimeWeekBefore(i)[3],
      time: datetimeLibrary.getTimeWeekBefore(i)[2]
    });
  }

  const fetchData = () => {
    dispatch(setDatenow(datetimeLibrary.getTimeThisWeek()[2].toString()));
  };

  useEffect(() => {
    if (account !== null) {
      fetchData();
      // dispatch(getTotalBalance(account.accountID));
    }
  }, [account]);

  // const handleTabPress = (a) => {
  //   console.log("Tab pressed:", a);
  //   dispatch(setDatenow(a));
  //   dispatch(getTotalBalance(account.accountID));
  // };

  // const handleTabBlur = (a) => {
  //   console.log("Tab blur:", a);
  //   dispatch(setTransCompIsLoading(true));
  // };

  return (
    <View style={styles.parentView}>
      <View style={styles.viewTotalBalance}>
        <Text style={styles.labelTotalBalance}>Số dư:</Text>
        <Text style={styles.textTotalBalance}>{totalBalance}</Text>
      </View>
      <Tab.Navigator
        style={styles.viewL}
        screenOptions={{
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
        }}
        // initialRouteName={VAR.THIS_WEEK_EN}
      >
        {dataForCompoents.map((item, index) => {
          return (
            <Tab.Screen
              navigationKey={item.name}
              key={index}
              name={item.name}
              component={TransCompTest}
              initialParams={{ time: item.time }}
              options={{
                tabBarLabel: item.name
              }}
              listeners={{
                focus: (e) => {
                  // handleTabPress(item.time);
                },
                tabLongPress: (e) => {
                  console.log("long press: ", e.target);
                },
                blur: (e) => {
                  // handleTabBlur(e);
                }
              }}
            />
          );
        }, [])}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: {
    // minHeight: "95%",
    // margin: 10,
    flex: 1,
    // borderWidth: 5,
    // borderColor: "green",
  },
  viewL: {
    // minHeight: Dimensions.get("window").height - 200,
    // minHeight: "95%",
    marginHorizontal: 5,
    // marginBottom: 85,
    // flex: 1,
    // backgroundColor: "red"
  },
  viewTotalBalance: {
    margin: 10,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#ccc",
    borderRadius: 5,
    borderBottomWidth: 1
  },
  labelTotalBalance: {
    fontSize: 15,
    textAlign: "left"
  },
  textTotalBalance: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right"
    // fontFamily: "Inconsolata_900Black"
  }
});

export default TransactionScreen;

// put this to the Tab.Navigator
// sceneContainerStyle={{ backgroundColor: "white" }}
// tabBar={({ state, descriptors, navigation }) => {
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         justifyContent: "space-around",
//         alignItems: "center",
//         backgroundColor: "white",
//         borderBottomWidth: 1,
//         borderBottomColor: "lightgray"
//       }}
//     >
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: "tabPress",
//             target: route.key,
//             canPreventDefault: true
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: "tabLongPress",
//             target: route.key
//           });
//         };

//         return (
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               borderBottomWidth: 3,
//               borderBottomColor: isFocused ? "tomato" : "white"
//             }}
//             key={index}
//           >
//             <Button
//               title={label}
//               onPress={onPress}
//               onLongPress={onLongPress}
//             />
//           </View>
//         );
//       })}
//     </View>
//   );
// }}

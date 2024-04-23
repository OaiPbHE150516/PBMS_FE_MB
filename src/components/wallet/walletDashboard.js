import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  FlatList,
  Pressable,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

import { VAR } from "../../constants/var.constant";
import { LineChart } from "react-native-gifted-charts";

// redux & slice
import { useSelector, useDispatch } from "react-redux";

// services
import walletServices from "../../services/walletServices";

const WalletDashboard = ({ navigation }) => {
  const account = useSelector((state) => state.authen.account);
  const shouldFetchData = useSelector((state) => state.data.shouldFetchData);
  const [eachWallet, setEachWallet] = useState({});

  const WIDTH_SCREEN = Dimensions.get("window").width;

  async function fetchWalletData(accountID) {
    // console.log("fetchWalletData accountID: ", accountID);
    try {
      await walletServices
        .getTotalBalanceEachWallet(accountID)
        .then((response) => {
          // set EachWallet is top 2 wallet of response
          // sort response by balance
          // response.sort((a, b) => b.balance - a.balance);
          // console.log("response fetchWalletData: ", response);
          setEachWallet(response.slice(0, 2));
        });
    } catch (error) {
      console.log("Error fetchWalletData data:", error);
    }
  }

  useEffect(() => {
    if (account?.accountID) {
      fetchWalletData(account?.accountID);
    }
  }, [shouldFetchData]);

  const lineData = [
    { value: 0, dataPointText: "0" },
    { value: 10, dataPointText: "10" },
    { value: 8, dataPointText: "8" },
    { value: 58, dataPointText: "58" },
    { value: 56, dataPointText: "56" },
    { value: 78, dataPointText: "78" },
    { value: 74, dataPointText: "74" },
    { value: 98, dataPointText: "98" }
  ];

  const lineData2 = [
    { value: 0, dataPointText: "0" },
    { value: 20, dataPointText: "20" },
    { value: 18, dataPointText: "18" },
    { value: 40, dataPointText: "40" },
    { value: 36, dataPointText: "36" },
    { value: 60, dataPointText: "60" },
    { value: 54, dataPointText: "54" },
    { value: 85, dataPointText: "85" }
  ];

  return (
    eachWallet && (
      <View style={styles.viewStyle}>
        <View style={styles.view_Header}>
          <Text style={styles.text_Header}>{"Ví"}</Text>
          {/* a pressable to see full wallet by navigation to "walletscreen" */}
          <Pressable
            style={({ pressed }) => [
              styles.pressable_ViewAll,
              { opacity: pressed ? 0.5 : 1 }
            ]}
            onPress={() => {
              // callback();
              navigation.push(VAR.SCREEN.REPORT.WALLET);
            }}
          >
            {/* <Text style={styles.text_ViewAll}>{"Xem báo cáo "}</Text> */}
            <Icon name="chevron-right" size={15} color="#0984e3" />
          </Pressable>
        </View>
        <FlatList
          scrollEnabled={false}
          data={eachWallet || []}
          keyExtractor={(item) => item?.walletID}
          renderItem={({ item }) => {
            return (
              <View style={styles.walletItem}>
                <Text style={styles.name}>{item?.name}</Text>
                <Text style={styles.balance}>{item?.balance}</Text>
              </View>
            );
          }}
        />
        {/* <LineChart
          width={WIDTH_SCREEN}
          data={lineData}
          data2={lineData2}
          isAnimated={true}
          animateOnDataChange={true}
          animateTogether={true}
          animationDuration={2000}
          animationEasing={"ease-in-out"}
          scrollAnimation={true}
          height={250}
          showVerticalLines
          spacing={44}
          initialSpacing={0}
          color1="skyblue"
          color2="orange"
          textColor1="green"
          dataPointsHeight={6}
          dataPointsWidth={6}
          dataPointsColor1="blue"
          dataPointsColor2="red"
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={13}
        /> */}
      </View>
    )
  );
};
const styles = StyleSheet.create({
  text_ViewAll: {
    color: "#0984e3",
    fontSize: 15,
    fontFamily: "OpenSans_600SemiBold"
  },
  pressable_ViewAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 5,
    width: "50%"
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
    // borderBottomWidth: 1,
    // borderBottomColor: "lightgray"
  },
  viewStyle: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
    // borderWidth: 0.5,
    // borderColor: "darkgray",
    borderRadius: 5,
    marginVertical: 5
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "darkgray",
    // borderWidth: 1,
    // borderColor: "darkgray",
    width: "98%",
    flex: 1,
    marginHorizontal: 2
  },

  name: {
    fontSize: 15,
    fontFamily: "OpenSans_500Medium"
  },

  balance: {
    fontSize: 18,
    fontFamily: "OpenSans_600SemiBold",
    color: "seagreen",
    marginLeft: 20
  }
});

export default WalletDashboard;

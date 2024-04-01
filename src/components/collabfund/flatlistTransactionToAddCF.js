import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Animated,
  Image,
  ActivityIndicator
} from "react-native";
// node_modules library
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";
import transactionServices from "../../services/transactionServices";

// library
import { VAR } from "../../constants/var.constant";

// components

const FlatListTransactionToAddCF = ({ callback }) => {
  const account = useSelector((state) => state.authen?.account);
  const [nowLastExpensesTransaction, setNowLastExpensesTransaction] = useState(
    []
  );
  const [isFetchingData, setIsFetchingData] = useState(false);

  const fetchLastNumberDayExpensesTransaction = async () => {
    try {
      const response = await transactionServices
        .getLastNumberExpensesTransaction(
          account?.accountID,
          VAR.NUMBER_LASTDAY_EXPENSES_TRANSACTION
        )
        .then((response) => {
          console.log("response: ", response);
          setNowLastExpensesTransaction(response);
          setIsFetchingData(false);
        });
    } catch (error) {
      console.error(
        "Error fetching data fetchLastNumberDayExpensesTransaction:",
        error
      );
    }
  };

  useEffect(() => {
    if (account) {
      setIsFetchingData(true);
      fetchLastNumberDayExpensesTransaction();
    }
  }, [account]);

  const onHandlePress = () => {
    callback({ data: "data" });
  };

  function onHandleATransactionInDayPress({ aTransaction }) {
    console.log("aTransaction: ", aTransaction);
  }

  function onHandleNewTransactionPress() {
    console.log("onHandleNewTransactionPress");
  }

  const ADayHasTransaction = ({ aDay }) => {
    return (
      <View style={styles.view_ADayHasTransaction}>
        <View style={styles.view_ADayHasTransaction_Header}>
          <Text style={styles.text_ADayHasTransactionShort_Date}>
            {aDay.dayDetail?.shortDate}
          </Text>
        </View>
        <FlatList
          style={styles.view_ADayHasTransaction_FlatList}
          data={aDay.transactions}
          keyExtractor={(item) => item.transactionID}
          renderItem={({ item }) => <ATransactionInDay aTransaction={item} />}
        />
      </View>
    );
  };

  const ATransactionInDay = ({ aTransaction }) => {
    return (
      <Pressable style={styles.view_ATransactionInDay}>
        <View style={styles.view_ATransactionInDay_Time}>
          <Text style={styles.text_ATransactionInDay_Time}>
            {aTransaction?.timeStr}
          </Text>
        </View>
        <View style={styles.view_ATransactionInDay_Cate}>
          <Text style={styles.text_ATransactionInDay_Normal}>
            {aTransaction?.category?.nameVN}
          </Text>
        </View>
        <View style={styles.view_ATransactionInDay_Note}>
          <Text style={styles.text_ATransactionInDay_Note}>
            {aTransaction?.note}
          </Text>
        </View>
        <View style={styles.view_ATransactionInDay_TotalAmount}>
          <Text style={styles.text_ATransactionInDay_TotalAmount}>
            {aTransaction?.totalAmountStr}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.view_Container}>
      <View style={styles.view_Container_Header}>
        <Text style={styles.text_Container_Header}>
          {"Chọn giao dịch gần đây"}
        </Text>
      </View>
      <View style={styles.view_MainContent}>
        {isFetchingData ? (
          // <ActivityIndicator size="large" color="#0000ff" />
          <View style={styles.view_Center}>
            <Text>{"Đang tải dữ liệu..."}</Text>
          </View>
        ) : !nowLastExpensesTransaction ||
          nowLastExpensesTransaction.length === 0 ? (
          <View>
            <Text>{"Chưa có giao dịch nào"}</Text>
          </View>
        ) : (
          <FlatList
            style={styles.view_LastExpensesTransaction_FlatList}
            data={nowLastExpensesTransaction}
            keyExtractor={(item) => item.keyExtractor}
            renderItem={({ item }) => <ADayHasTransaction aDay={item} />}
          />
        )}
      </View>
      <View style={styles.view_Actionable}>
        <Pressable
          style={styles.pressable_Actionable_NewTransaction}
          onPress={() => onHandleNewTransactionPress()}
        >
          <Text>{"Thêm giao dịch mới"}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text_Container_Header: {
    fontFamily: "Inconsolata_500Medium",
    fontSize: 20
  },
  view_Container_Header: {
    height: "5%",
    borderWidth: 1,
    borderColor: "red",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  view_MainContent: {
    height: "80%"
  },
  view_Actionable: {
    height: "15%",
    borderWidth: 1,
    borderColor: "red",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center"
  },
  pressable_Actionable_NewTransaction: {
    backgroundColor: "darkgray"
  },
  view_ATransactionInDay_Time: {
    flex: 1
  },
  text_ATransactionInDay_Time: {
    fontFamily: "Inconsolata_400Regular",
    fontSize: 18
  },
  view_ATransactionInDay_Cate: {
    flex: 2
  },
  text_ATransactionInDay_Normal: {
    fontFamily: "Inconsolata_400Regular",
    fontSize: 16
  },
  view_ATransactionInDay_Note: {
    flex: 2
  },
  text_ATransactionInDay_Note: {
    fontFamily: "Inconsolata_400Regular",
    fontSize: 16
  },
  view_ATransactionInDay_TotalAmount: {
    flex: 2
  },
  text_ATransactionInDay_TotalAmount: {
    textAlign: "right",
    fontFamily: "OpenSans_500Medium",
    fontSize: 18
  },
  view_LastExpensesTransaction_FlatList: {
    width: "100%"
    // borderWidth: 1,
    // borderColor: "red"
  },
  view_ATransactionInDay: {
    padding: 5,
    borderBottomWidth: 0.25,
    borderBottomColor: "darkgray",
    borderLeftWidth: 2,
    borderLeftColor: "darkgray",
    borderRadius: 5,
    marginHorizontal: 2,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  view_ADayHasTransaction_FlatList: {
    padding: 5
  },
  text_ADayHasTransactionShort_Date: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
  },
  view_ADayHasTransaction_Header: {
    // backgroundColor: "lightgray",
    borderBottomWidth: 1.5,
    borderBottomColor: "darkgray",
    padding: 5,
    borderRadius: 5
  },
  view_ADayHasTransaction: {
    borderRadius: 10,
    marginHorizontal: 2,
    marginVertical: 5
  },
  view_Center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center"
  },
  view_Container: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    width: "100%"
  }
});

export default FlatListTransactionToAddCF;

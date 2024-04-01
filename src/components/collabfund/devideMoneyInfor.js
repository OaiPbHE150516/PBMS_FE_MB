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
  Image
} from "react-native";
// node_modules library
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

const DevideMoneyInfor = ({ collabFund }) => {
  const account = useSelector((state) => state.authen?.account);

  const [nowDivideMoneyInfor, setNowDivideMoneyInfor] = useState([]);

  async function fetchDivideMoneyInfor() {
    try {
      const data = {
        data: {
          collabFundID: collabFund?.collabFundID,
          accountID: account?.accountID
        }
      };
      const response = await collabFundServices.getDivideMoneyInfor(data);
      setNowDivideMoneyInfor(response);
    } catch (error) {
      console.error("Error fetching data collab fund participants:", error);
    }
  }

  useEffect(() => {
    if (account) {
      fetchDivideMoneyInfor();
    }
  }, [account]);

  async function handlePressableDivideMoney() {
    console.log("handlePressableDivideMoney");
  }

  const AnAccountDMInfor = ({ item }) => {
    return (
      <View style={styles.viewAnAccountDMInfor}>
        <Image
          source={{ uri: item?.account?.pictureURL }}
          style={{ width: 30, height: 30, borderRadius: 30 }}
        />
        <View style={styles.viewAnAccountRightInfor}>
          <View style={styles.viewAnAccountDMInforFirst}>
            <Text style={styles.textAccountName}>
              {item?.account.accountName}
            </Text>
            <Text style={styles.textTotalAmount}>{item?.totalAmountStr}</Text>
            <Text style={styles.textTransactionCount}>
              {item?.transactionCount}
            </Text>
          </View>
          <View style={styles.viewAnAccountDMInforFirst}>
            <Text style={styles.textMoneyActionLabel}>{"Số dư"}</Text>
            <Text style={styles.textMoneyAction}>{item?.moneyActionStr}</Text>
          </View>
        </View>
      </View>
    );
  };

  const An_CFDM_Result = ({ item }) => {
    return (
      <View style={styles.viewAn_CFDM_Result}>
        {/* <Text style={styles.text_cfdm_result_label}>{item?.fromAccount?.accountName}</Text>
        <Text style={styles.text_cfdm_result_number}>{item?.fromAccountTotalAmount}</Text> */}
        <View style={styles.viewAnAccount_CFDM}>
          <Image
            source={{ uri: item?.fromAccount?.pictureURL }}
            style={{ width: 30, height: 30, borderRadius: 30 }}
          />
          <Text style={styles.textAccountName_CFDM}>
            {item?.fromAccount?.accountName}
          </Text>
        </View>
        <View style={styles.view_CFDM_Transfer}>
          <Icon name="angle-right" size={20} color="black" />
          <Text style={{ fontSize: 17, fontFamily: "OpenSans_500Medium" }}>
            {item?.dividingAmountStr}
          </Text>
          <Icon name="angle-right" size={20} color="black" />
        </View>
        <View style={styles.viewAnAccount_CFDM}>
          <Image
            source={{ uri: item?.toAccount?.pictureURL }}
            style={{ width: 30, height: 30, borderRadius: 30 }}
          />
          <Text style={styles.textAccountName_CFDM}>
            {item?.toAccount?.accountName}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.viewModalMoreDetail}>
      {/* <View style={styles.viewModalHeader}>
        <Text>{"Chia tiền cho các bên tham gia"}</Text>
      </View> */}
      <View style={styles.viewModalMoreDetailDivideMoneyContent}>
        <View style={styles.viewTableHeader}>
          {/* <View style={styles.viewAnAccountDMInfor}>
        <Image
          source={{ uri: " " }}
          style={{ width: 30, height: 30, borderRadius: 30 }}
        />
        <View style={styles.viewAnAccountRightInfor}>
          <View style={styles.viewAnAccountDMInforFirst}>
            <Text style={styles.textAccountName}>{"Người tham gia"}</Text>
            <Text style={styles.textTotalAmount}>{"Số tiền đã đóng"}</Text>
            <Text style={styles.textTransactionCount}>
              {"Số lần giao dịch"}
            </Text>
          </View>
        </View>
      </View> */}
          <Text style={styles.textLabelHeaderChildInContent}>
            {"Danh sách đóng góp"}
          </Text>
        </View>
        <View style={styles.viewFlatListDMInfor}>
          <FlatList
            data={nowDivideMoneyInfor?.listDVMI}
            keyExtractor={(item) => item?.account?.accountID}
            renderItem={({ item }) => <AnAccountDMInfor item={item} />}
          />
        </View>
        {/* <View style={styles.viewTableHeader}>
          <Text style={styles.textLabelHeaderChildInContent}>
            {"Chi tiết"}
          </Text>
        </View> */}
        <View style={styles.view_cfdm_result}>
          <View style={styles.view_a_cfdm_result}>
            <Text style={styles.text_cfdm_result_label}>
              {"Tổng số tiền (T): "}
            </Text>
            <Text style={styles.text_cfdm_result_number}>
              {nowDivideMoneyInfor?.cfdividingmoney_result?.totalAmountStr}
            </Text>
          </View>
          <View style={styles.view_a_cfdm_result}>
            <Text style={styles.text_cfdm_result_label}>
              {"Số người tham gia (N): "}
            </Text>
            <Text style={styles.text_cfdm_result_number}>
              {nowDivideMoneyInfor?.cfdividingmoney_result?.numberParticipant}
            </Text>
          </View>
          <View style={styles.view_a_cfdm_result}>
            <Text style={styles.text_cfdm_result_label}>
              {"Tiền trung bình cộng (Ti): "}
            </Text>
            <Text style={styles.text_cfdm_result_number}>
              {nowDivideMoneyInfor?.cfdividingmoney_result?.averageAmountStr}
            </Text>
          </View>
          <View style={styles.view_a_cfdm_result}>
            <Text style={styles.text_cfdm_result_label}>{"Số dư(S): "}</Text>
            <Text style={styles.text_cfdm_result_number}>
              {nowDivideMoneyInfor?.cfdividingmoney_result?.remainAmountStr}
            </Text>
          </View>
        </View>
        {/* <View style={styles.viewTableHeader}>
          <Text style={styles.textLabelHeaderChildInContent}>
            {"Chi tiết chuyển tiền"}
          </Text>
        </View> */}
        <View style={styles.viewCFDM_Result}>
          <FlatList
            data={nowDivideMoneyInfor?.cfdm_detail_result}
            keyExtractor={(item) => item?.cF_DividingMoneyDetailID}
            renderItem={({ item }) => <An_CFDM_Result item={item} />}
          />
        </View>
      </View>
      <View style={styles.viewModalMoreDetailAction}>
        <Pressable
          style={styles.pressableDivideMoneyAction}
          onPress={() => {
            handlePressableDivideMoney();
          }}
        >
          <Text style={styles.textPressableDivideMoneyAction}>
            {"Chia tiền"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textPressableDivideMoneyAction: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    color: "white"
  },
  pressableDivideMoneyAction: {
    backgroundColor: "#63ADF2",
    borderWidth: 1,
    borderColor: "darkgray",
    height: 40,
    width: "40%",
    marginHorizontal: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  textLabelHeaderChildInContent: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium"
  },
  view_CFDM_Transfer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    flex: 1
  },
  textAccountName_CFDM: {
    fontSize: 18,
    fontFamily: "Inconsolata_500Medium",
    flexWrap: "wrap",
    flex: 1,
    marginHorizontal: 5
  },
  viewAnAccount_CFDM: {
    flexDirection: "row",
    width: "35%",
    alignContent: "center",
    alignItems: "center",
    padding: 2
    // justifyContent: "space-around",
  },
  viewAn_CFDM_Result: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "darkgray"
  },
  viewCFDM_Result: {
    // borderWidth: 1,
    // borderColor: "green",
    flex: 1
  },
  viewFlatListDMInfor: {},
  text_cfdm_result_label: {
    fontSize: 18,
    fontFamily: "Inconsolata_600SemiBold",
    flex: 1,
    textAlign: "right",
    marginHorizontal: 5
  },
  text_cfdm_result_number: {
    fontSize: 20,
    fontFamily: "OpenSans_400Regular",
    flex: 1,
    marginHorizontal: 5
  },
  view_a_cfdm_result: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center"
  },
  view_cfdm_result: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
    // borderWidth: 0.5,
    // borderColor: "red"
  },
  viewTableHeader: {
    alignContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "darkgray",
    marginTop: 10,
    marginBottom: 2
  },
  textMoneyActionLabel: {
    flex: 1,
    textAlign: "right",
    marginHorizontal: 15,
    fontFamily: "OpenSans_300Light_Italic"
  },
  textMoneyAction: {
    fontSize: 16,
    fontFamily: "OpenSans_500Medium_Italic",
    textAlign: "right"
    // flex: 5
  },
  viewAnAccountRightInfor: {
    flexDirection: "column",
    flex: 1,
    // borderWidth: 0.5,
    marginHorizontal: 2,
    justifyContent: "space-around"
  },
  textAccountName: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    flex: 4
    // borderWidth: 0.5,
    // borderColor: "blue"
  },
  textTotalAmount: {
    fontSize: 18,
    fontFamily: "OpenSans_500Medium",
    flex: 3,
    // borderWidth: 0.5,
    // borderColor: "green",
    textAlign: "right"
  },
  textTransactionCount: {
    fontSize: 18,
    fontFamily: "Inconsolata_400Regular",
    flex: 1,
    // borderWidth: 0.5,
    // borderColor: "red",
    textAlign: "right"
  },

  viewAnAccountDMInfor: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "darkgray",
    marginVertical: 2
  },
  viewAnAccountDMInforFirst: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5
  },
  viewModalHeader: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "lightblue"
  },
  viewModalMoreDetailDivideMoneyContent: {
    // borderWidth: 10,
    // borderColor: "darkgray",
    flex: 5,
    justifyContent: "flex-start"
  },
  viewModalMoreDetailAction: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    padding: 10,
    // backgroundColor: "lightblue",
    flex: 1
  },
  viewModalMoreDetail: {
    backgroundColor: "white",
    width: "100%",
    minHeight: "10%",
    height: "auto",
    maxHeight: "70%",
    zIndex: 10,
    flex: 1,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "darkgray"
  }
});

export default DevideMoneyInfor;

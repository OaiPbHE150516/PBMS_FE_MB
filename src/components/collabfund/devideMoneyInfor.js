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

// const
import { API } from "../../constants/api.constant";

// redux
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

const DevideMoneyInfor = ({ collabFund }) => {
  const account = useSelector((state) => state.authen?.account);

  const [nowDivideMoneyInfor, setNowDivideMoneyInfor] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const [isPressableDivideMoney, setIsPressableDivideMoney] = useState(false);

  const [isMoreDetailVisible, setIsMoreDetailVisible] = useState(true);

  async function fetchDivideMoneyInfor() {
    try {
      const data = {
        data: {
          collabFundID: collabFund?.collabFundID,
          accountID: account?.accountID
        }
      };
      await collabFundServices.getDivideMoneyInfor(data).then((response) => {
        setNowDivideMoneyInfor(response);
        setIsFetchingData(false);
        setIsPressableDivideMoney(true);
      });
    } catch (error) {
      console.log("Error fetchDivideMoneyInfor data:", error);
      Alert.alert("Lỗi", "Lấy dữ liệu chia tiền không thành công", [
        { text: "OK" }
      ]);
    }
  }

  useEffect(() => {
    if (account) {
      setIsFetchingData(true);
      fetchDivideMoneyInfor();
    }
  }, [account, collabFund]);

  async function postDivideMoney() {
    try {
      const jsonHeader = {
        "Content-Type": "application/json"
      };
      const data = {
        data: {
          collabFundID: collabFund?.collabFundID,
          accountID: account?.accountID
        }
      };
      // const response = await axios.post(
      //   API.COLLABFUND.POST_DIVIDE_MONEY,
      //   data,
      //   {
      //     jsonHeader
      //   }
      // );
      // console.log("response postDivideMoney:", response.data);

      await collabFundServices
        .postDivideMoney(data)
        .then((response) => {
          console.log("response postDivideMoney:", response);
        })
        .finally(() => {
          setIsPressableDivideMoney(false);
          Alert.alert("Thành công", "Chia tiền thành công", [{ text: "OK" }]);
        })
        .catch((error) => {
          console.log("Error postDivideMoney data:", error);
          Alert.alert("Lỗi", "Chia tiền không thành công", [{ text: "OK" }]);
        });
    } catch (error) {
      console.log("Error postDivideMoney data:", error);
      Alert.alert("Lỗi", "Chia tiền không thành công", [{ text: "OK" }]);
    }
  }

  async function handlePressableDivideMoney() {
    console.log("handlePressableDivideMoney");

    await postDivideMoney();
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

  const ViewMoreDetail = () => {
    return (
      <View>
        <View style={styles.viewTableHeader}>
          <Text style={styles.textLabelHeaderChildInContent}>
            {"Danh sách đóng góp"}
          </Text>
        </View>
        <View style={styles.viewFlatListDMInfor}>
          <FlatList
            data={nowDivideMoneyInfor?.listDVMI}
            keyExtractor={(item) => item?.account?.accountID}
            renderItem={({ item }) => <AnAccountDMInfor item={item} />}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.viewTableHeader}>
          <Text style={styles.textLabelHeaderChildInContent}>
            {"Thông tin chuyển tiền"}
          </Text>
        </View>
        <View style={styles.viewCFDM_Result}>
          <FlatList
            data={nowDivideMoneyInfor?.cfdm_detail_result}
            keyExtractor={(item) => item?.cF_DividingMoneyDetailID}
            renderItem={({ item }) => <An_CFDM_Result item={item} />}
            scrollEnabled={false}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.viewModalMoreDetail}>
      {/* <View style={styles.viewModalHeader}>
        <Text>{"Chia tiền cho các bên tham gia"}</Text>
      </View> */}
      <ScrollView style={styles.viewModalMoreDetailDivideMoneyContent}>
        <View style={styles.viewTableHeader}>
          <Text style={styles.textLabelHeaderChildInContent}>
            {"Chi tiết chi tiêu chung"}
          </Text>
        </View>
        {isFetchingData ? (
          // <ActivityIndicator size="large" color="#0000ff" />
          <View style={styles.viewCenter}>
            <Text>{"Đang tải dữ liệu..."}</Text>
          </View>
        ) : !nowDivideMoneyInfor || nowDivideMoneyInfor.length === 0 ? (
          <View style={styles.viewCenter}>
            <Text>{"Không có dữ liệu"}</Text>
          </View>
        ) : (
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
        )}
        {isMoreDetailVisible ? <ViewMoreDetail /> : null}
        <Pressable
          onPress={() => {
            setIsMoreDetailVisible(!isMoreDetailVisible);
          }}
          style={styles.pressable_SeeMoreDetail}
        >
          <Text style={styles.text_SeeMoreDetail}>
            {isMoreDetailVisible ? "Ẩn" : "Chi tiết"}
          </Text>
          <Icon
            name={isMoreDetailVisible ? "chevron-up" : "chevron-down"}
            size={15}
            color="#74b9ff"
          />
        </Pressable>
      </ScrollView>
      <View style={styles.viewModalMoreDetailAction}>
        <Pressable
          style={styles.pressableDivideMoneyAction}
          onPress={() => {
            handlePressableDivideMoney();
          }}
          disabled={!isPressableDivideMoney}
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
  text_SeeMoreDetail: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    color: "#74b9ff",
    marginHorizontal: 5
  },
  pressable_SeeMoreDetail: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "40%"
  },
  viewCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center"
  },
  textPressableDivideMoneyAction: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium",
    color: "white"
  },
  pressableDivideMoneyAction: {
    backgroundColor: "#74b9ff",
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
    borderBottomWidth: 0.25,
    borderBottomColor: "darkgray",
    marginTop: 10,
    marginBottom: 5
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
    flex: 5
    // justifyContent: "flex-start"
  },
  viewModalMoreDetailAction: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    padding: 10
    // backgroundColor: "lightblue",
    // flex: 1
  },
  viewModalMoreDetail: {
    backgroundColor: "white",
    width: "100%",
    minHeight: "10%",
    // height: 600,
    height: "auto",
    maxHeight: "90%",
    zIndex: 10,
    flex: 1,
    borderRadius: 10,
    // borderWidth: 0.5,
    // borderColor: "red",
    paddingBottom: 20
  }
});

export default DevideMoneyInfor;

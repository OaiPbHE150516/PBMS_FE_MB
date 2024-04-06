import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Switch,
  RefreshControl,
  Modal,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

// redux
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

const CfHistoryComponent = ({ route }) => {
  const { collabFund } = route.params;
  const account = useSelector((state) => state.authen?.account);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [history, setHistory] = useState([]);

  async function fetchCollabFundHistory() {
    try {
      setIsRefreshing(true);
      await collabFundServices
        .getCollabFundDivideMoneyHistory({
          data: {
            collabFundID: collabFund?.collabFundID,
            accountID: account?.accountID
          }
        })
        .then((response) => {
          console.log("fetchCollabFundHistory response: ", response);
          setHistory(response);
          setIsRefreshing(false);
        })
        .catch((error) => {
          console.log("fetchCollabFundHistory error: ", error);
          Alert.alert("Lỗi khi lấy dữ liệu lịch sử chi tiêu chung: ", error);
          setIsRefreshing(false);
        });
    } catch (error) {
      console.log("fetchCollabFundHistory error: ", error);
      Alert.alert("Lỗi khi lấy dữ liệu lịch sử chi tiêu chung: ", error);
    }
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCollabFundHistory();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchCollabFundHistory();
  }, [account]);

  const CFDM_Detail = ({ item }) => {
    return (
      <View style={styles.viewAn_CFDM_Result}>
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
          <Icon name="angle-right" size={15} color="darkgray" />
          <Text style={styles.text_DividingAmount_CFDM}>
            {item?.dividingAmountStr}
          </Text>
          <Icon name="angle-right" size={15} color="darkgray" />
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

  const AnHistoryDM_Item = ({ item }) => {
    return (
      <View style={styles.view_AnHistoryDM_Item}>
        <View style={styles.view_AnHistoryDM_ItemInfor}>
          {/* <View style={styles.view_AnHistoryDM_ItemInfor_Money}> */}
          <View style={{ flex: 1 }}>
            <Text style={styles.text_Date}>
              {item.createTimeDetail.fullDate +
                " " +
                item.createTimeDetail.monthYearStr}
            </Text>
          </View>
          <View style={styles.view_AnHistoryDM_ItemInfor_Money_LabelMoney}>
            <Text style={styles.text_Label_Money}>{"Tổng tiền: "}</Text>
            <Text style={styles.text_Label_MoneyNumber}>
              {item.totalAmountStr}
            </Text>
          </View>
          <View style={styles.view_AnHistoryDM_ItemInfor_Money_LabelMoney}>
            <Text style={styles.text_Label_Money}>{"Số người tham gia: "}</Text>
            <Text style={styles.text_Label_MoneyNumber}>
              {item.numberParticipant}
            </Text>
          </View>
          <View style={styles.view_AnHistoryDM_ItemInfor_Money_LabelMoney}>
            <Text style={styles.text_Label_Money}>{"Tiền trung bình: "}</Text>
            <Text style={styles.text_Label_MoneyNumber}>
              {item.averageAmountStr}
            </Text>
          </View>
          {/* </View> */}
        </View>
        <View style={styles.view_DM_Detail}>
          <FlatList
            data={item.list_CFDM_Detail_VM_DTO}
            renderItem={({ item }) => <CFDM_Detail item={item} />}
            keyExtractor={(item) => item.cF_DividingMoneyDetailID}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.view_Container}>
      <FlatList
        style={styles.flatlist_HistoryDivideMoney}
        data={history || []}
        renderItem={({ item }) => <AnHistoryDM_Item item={item} />}
        keyExtractor={(item) => item.cF_DividingMoneyID}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text_Date: {
    fontSize: 14,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center"
  },
  text_Label_MoneyNumber: {
    fontSize: 18,
    fontFamily: "OpenSans_500Medium",
    textAlign: "right"
  },
  text_Label_Money: {
    fontSize: 16,
    fontFamily: "OpenSans_400Regular"
  },
  view_AnHistoryDM_ItemInfor_Money_LabelMoney: {
    flexDirection: "row",
    justifyContent: "space-between",
    // borderWidth: 0.5,
    // borderColor: "red",
    flex: 1
  },
  text_DividingAmount_CFDM: {
    fontSize: 16,
    fontFamily: "OpenSans_500Medium"
    // marginHorizontal: 5
  },
  view_CFDM_Transfer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    width: "30%"
  },
  textAccountName_CFDM: {
    fontSize: 16,
    fontFamily: "Inconsolata_500Medium",
    flexWrap: "wrap",
    flex: 1,
    marginHorizontal: 5,
    width: "100%"
  },
  viewAnAccount_CFDM: {
    flexDirection: "row",
    width: "auto",
    // flex: 5,
    maxWidth: "35%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "darkgray",
    padding: 3
    // justifyContent: "space-around",
  },
  viewAn_CFDM_Result: {
    flexDirection: "row",
    position: "relative",
    alignSelf: "center",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "darkgray",
    // flex: 1,
    width: "100%",
    margin: 2
    // borderWidth: 1,
    // borderColor: "green"
  },
  view_DM_Detail: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1
    // borderWidth: 1,
    // borderColor: "red"
  },
  view_AnHistoryDM_ItemInfor: {
    flexDirection: "column",
    justifyContent: "space-between",
    // alignContent: "center",
    // alignItems: "center",
    // padding: 10,
    marginVertical: 5,
    width: "100%"
  },
  view_AnHistoryDM_Item: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 2,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 10,
    paddingHorizontal: 5
  },
  flatlist_HistoryDivideMoney: {
    flex: 1
  },
  view_Container: {
    flex: 1
  }
});

export default CfHistoryComponent;

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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/FontAwesome6";

// components

// redux
import {
  getTotalBalance,
  getAllWallet,
  getTotalBalanceEachWallet,
  createWallet
} from "../../redux/walletSlice";

const WalletsManagerScreen = () => {
  const account = useSelector((state) => state.authen?.account);
  const navigation = useNavigation();
  const wallets = useSelector((state) => state.wallet?.wallets);
  const totalBalance = useSelector((state) => state.wallet?.totalBalance);
  const totalBalanceEachWallet = useSelector(
    (state) => state.wallet?.totalBalanceEachWallet
  );

  const [currentWallets, setCurrentWallets] = useState(wallets);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalAddWalletVisible, setIsModalAddWalletVisible] = useState(false);
  const [isShouldDarkModalBackground, setIsShouldDarkModalBackground] =
    useState(false);
  const [newWallet, setNewWallet] = useState({
    accountID: account?.accountID,
    name: "",
    balance: "",
    currencyID: 2
  });

  const dispatch = useDispatch();

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchWalletData();
    setCurrentWallets(wallets);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  async function fetchWalletData() {
    try {
      dispatch(getTotalBalance(account?.accountID));
      dispatch(getAllWallet(account?.accountID));
      dispatch(getTotalBalanceEachWallet(account?.accountID));
    } catch (error) {
      Alert.alert("Error fetching wallet data:", error);
      console.error("Error fetching wallet data:", error);
    }
  }

  useEffect(() => {
    if (account !== null) {
      fetchWalletData();
    }
  }, [account]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddWallet = () => {
    setIsModalAddWalletVisible(!isModalAddWalletVisible);
  };

  function clearFormAddWallet() {
    setNewWallet({
      accountID: account?.accountID,
      name: "",
      balance: "",
      currencyID: 2
    });
  }

  const handleAddWalletModal = () => {
    // Alert if name is empty or duplicate with existing wallet
    if (newWallet?.name === "") {
      Alert.alert("Tên ví không được để trống");
      return;
    }
    if (wallets.some((wallet) => wallet?.name === newWallet?.name)) {
      Alert.alert("Tên ví đã tồn tại");
      return;
    }

    const wallet = {
      accountID: newWallet?.accountID,
      name: newWallet?.name?.trim(),
      balance: parseInt(newWallet?.balance?.replace(/\./g, "")),
      currencyID: 2
    };
    dispatch(createWallet(wallet));
    setIsModalAddWalletVisible(!isModalAddWalletVisible);
    onRefresh();
    clearFormAddWallet();
  };

  const handleCancelAddWalletModal = () => {
    setIsModalAddWalletVisible(!isModalAddWalletVisible);
    setIsShouldDarkModalBackground(false);
    clearFormAddWallet();
  };

  const AnItemWalet = ({ wallet }) => {
    return (
      <View style={styles.viewAnItemWallet}>
        <View style={styles.viewAnItemWalletInfor}>
          <Text style={styles.textNameWallet}>{wallet?.name}</Text>
          <Text style={styles.textBalanceWallet}>{wallet?.balanceStr}</Text>
        </View>
        <View style={styles.viewAnItemWalletAction}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
          />
          <View style={styles.viewAnItemWalletActionRight}>
            <Pressable style={styles.pressableAnWalletAction}>
              <Icon name="eye" size={18} color="darkgray" />
            </Pressable>
            <Pressable>
              <Icon name="ellipsis" size={18} color="darkgray" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const handleOnChangeTextBalance = (text) => {
    let formattedNumber = text
      .replace(/\./g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setNewWallet({ ...newWallet, balance: formattedNumber });
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <Pressable
          style={styles.pressableBack}
          onPress={() => {
            handleBack();
          }}
        >
          <Icon name="chevron-left" size={22} color="#3498db" />
        </Pressable>
        <Text style={styles.modalTextHeader}>{"Quản lý ví"}</Text>
      </View>
      <View style={[styles.viewTotalBalance, styles.shadowCard]}>
        <Text style={styles.textLabelTotalBalance}>{"Tổng số dư:"}</Text>
        {totalBalance === null ? (
          <ActivityIndicator size="small" color="tomato" />
        ) : (
          <Text style={styles.textNumberTotalBalance}>{totalBalance}</Text>
        )}
      </View>
      <View style={[styles.viewAllWallet, styles.shadowCard]}>
        <FlatList
          data={currentWallets || wallets}
          keyExtractor={(item) => item.walletID}
          renderItem={({ item }) => <AnItemWalet wallet={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              title="Refreshing"
            />
          }
        />
      </View>
      <View style={[styles.viewWalletAction]}>
        <Pressable
          style={[styles.pressableAddWallet, styles.pressableAddWalletAction]}
          onPressIn={() => {
            handleAddWallet();
          }}
        >
          <Text>{"Thêm ví"}</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalAddWalletVisible}
        onShow={() => {
          console.log("Modal Add Wallet is shown");
          setIsShouldDarkModalBackground(true);
        }}
      >
        <BlurView
          intensity={0}
          tint="dark"
          style={[
            styles.viewAddWalletModal,
            {
              backgroundColor: isShouldDarkModalBackground
                ? "rgba(0,0,0,0.05)"
                : null
            }
          ]}
        >
          <View style={[styles.shadowCard, styles.viewAddWalletModalContent]}>
            <Text>{"Thêm ví mới"}</Text>
            <View style={styles.viewAddWalletName}>
              <Text style={styles.textLabelAddWallet}>{"Tên ví"}</Text>
              <TextInput
                style={[styles.textInput, styles.textInputStyle]}
                value={newWallet?.name}
                onChangeText={(text) =>
                  setNewWallet({ ...newWallet, name: text })
                }
              />
            </View>
            <View style={styles.viewAddWalletName}>
              <Text style={styles.textLabelAddWallet}>
                {"Số dư ban đầu( VND - đ )"}
              </Text>
              <TextInput
                style={[styles.textInputNumber, styles.textInputStyle]}
                value={newWallet?.balance}
                onChangeText={(text) => handleOnChangeTextBalance(text)}
                keyboardType={Platform.OS === "ios" ? "numeric" : "number-pad"}
              />
            </View>
            <View style={styles.viewAddWalletModalAction}>
              <Pressable
                style={[
                  styles.pressableAddWalletAction,
                  styles.pressableCancelAddWallet
                ]}
                onPress={() => {
                  handleCancelAddWalletModal();
                }}
              >
                <Text>{"Hủy"}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.pressableAddWalletAction,
                  styles.pressableAddWallet
                ]}
                onPress={() => {
                  handleAddWalletModal();
                }}
              >
                <Text>{"Lưu"}</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  textLabelAddWallet: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular",
    alignSelf: "flex-start",
    marginHorizontal: 5,
    marginVertical: 2
  },
  textInputStyle: {
    height: 40,
    width: "100%",
    borderColor: "darkgray",
    borderWidth: 0.25,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10
  },
  textInputNumber: {
    fontSize: 25,
    fontFamily: "OpenSans_400Regular"
  },
  textInput: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular"
  },
  viewAddWalletName: {
    flexDirection: "column",
    width: "100%",
    // justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 5
  },
  viewAddWalletModalContent: {
    flexDirection: "column",
    width: "90%",
    minHeight: "40%",
    height: "auto",
    maxHeight: "100%",
    // flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "darkgray",
    padding: 10
  },
  viewAddWalletModalAction: {
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "darkgray",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center"
  },
  blurviewAddWalletModal: {
    // width: "95%",
    // height: "auto",
    // minHeight: "50%",
    // maxHeight: "70%",
    // justifyContent: "space-between",
    // alignItems: "center",
    // alignContent: "center"
    // bottom: "5%"
  },
  viewAddWalletModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  viewWalletAction: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  pressableCancelAddWallet: {},
  pressableAddWalletAction: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "20%"
  },
  pressableAddWallet: {
    backgroundColor: "lightgray"
  },
  pressableAnWalletAction: {
    marginHorizontal: 10
  },
  viewAnItemWalletActionRight: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    marginHorizontal: 5
  },
  viewAnItemWalletInfor: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 10
  },
  viewAnItemWalletAction: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center"
  },
  shadowCard: {
    padding: 10,
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderBottomColor: "darkgray",
    borderBottomWidth: 0.25,
    // add shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  viewAllWallet: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "95%",
    width: "auto",
    maxWidth: "98%",
    maxHeight: "80%"
  },
  viewAnItemWallet: {
    flexDirection: "column",
    justifyContent: "space-between",
    borderBottomColor: "darkgray",
    borderBottomWidth: 0.25,
    paddingVertical: 2,
    paddingHorizontal: 5,
    width: "100%",
    marginVertical: 5
  },
  textNameWallet: {
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
  },
  textBalanceWallet: {
    fontSize: 20,
    fontFamily: "OpenSans_600SemiBold"
  },
  viewTotalBalance: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "95%",
    width: "auto",
    maxWidth: "98%"
  },
  textLabelTotalBalance: {
    fontSize: 25,
    textAlign: "left",
    fontFamily: "Inconsolata_500Medium"
    // borderWidth: 1
  },
  textNumberTotalBalance: {
    fontSize: 25,
    textAlign: "right",
    fontFamily: "OpenSans_600SemiBold"
    // borderWidth: 1
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  viewHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderBottomColor: "darkgray",
    borderBottomWidth: 0.25,
    // add shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 2
  },
  modalTextHeader: {
    fontSize: 30,
    // fontWeight: "bold",
    fontFamily: "Inconsolata_500Medium"
    // marginTop: 10
  },
  pressableBack: {
    alignSelf: "flex-start",
    margin: 2,
    position: "absolute",
    top: 2,
    left: 8,
    flex: 1,
    // borderWidth: 1,
    width: "20%"
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  },
  buttonText: {
    color: "white",
    fontSize: 20
  }
});

export default WalletsManagerScreen;

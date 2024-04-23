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
  Platform,
  ScrollView,
  Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

import {
  TextInput as PaperTextInput,
  Chip as PaperChip
} from "react-native-paper";

// redux
import { useSelector, useDispatch } from "react-redux";
import collabFundServices from "../../services/collabFundServices";

const CfPaticianComponent = ({ route }) => {
  const { collabFund } = route.params;
  const account = useSelector((state) => state.authen?.account);

  const [nowParticipants, setNowParticipants] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isShowModalAddParticipant, setIsShowModalAddParticipant] =
    useState(false);
  const [currentSearchText, setCurrentSearchText] = useState("");
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const [accountsSelected, setAccountsSelected] = useState([]);

  useEffect(() => {
    if (account) {
      fetchCollabFundParticipants();
    }
  }, [account]);

  async function fetchCollabFundParticipants() {
    try {
      const data = {
        data: {
          collabFundID: collabFund?.collabFundID,
          accountID: account?.accountID
        }
      };
      const response = await collabFundServices.getCollabFundParticipants(data);
      setNowParticipants(response);
    } catch (error) {
      console.log("Error fetchCollabFundParticipants data:", error);
    }
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCollabFundParticipants();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  function handleOnFocusSearch() {
    setIsShowSearchResult(true);
  }

  function handleOnBlurSearch() {
    // setCurrentSearchText("");
    // setSearchResult([]);
    // setIsShowSearchResult(false);
  }

  function handleOnChangeTextSearch(text) {
    setCurrentSearchText(text);
  }

  function hanleSelectedAnAccount(account) {
    if (
      accountsSelected.length === 0 ||
      !accountsSelected.some((item) => item.accountID === account.accountID)
    ) {
      setAccountsSelected((prevAccounts) => [...prevAccounts, account]);
      // update search result
      setSearchResult((prevSearchResult) =>
        prevSearchResult.filter((item) => item.accountID !== account.accountID)
      );
    }
  }

  function hanleDeleteAnAccountSelected(account) {
    // console.log("Delete account: ", account);
    let tempAccountsSelected = accountsSelected.filter(
      (item) => item.accountID !== account.accountID
    );
    setAccountsSelected(tempAccountsSelected);
    // update search result
    let tempSearchResult = searchResult;
    tempSearchResult.push(account);
  }

  function handleOnPressSelectedAccount(account) {
    console.log("onPressSelectedAccount: ", account);
  }

  function handleCancelSearch() {
    setIsShowSearchResult(false);
    setCurrentSearchText("");
    // hide keyboard
    Keyboard.dismiss();
  }

  function handleCloseAddParticipant() {
    setIsShowModalAddParticipant(false);
    setCurrentSearchText("");
    setSearchResult([]);
    setIsShowSearchResult(false);
    setAccountsSelected([]);
  }

  function handleSaveAddParticipant() {
    console.log("Save add participant");
    console.log("Accounts selected: ", accountsSelected);
    inviteParticipants();
  }

  async function inviteParticipants() {
    try {
      const listInvited = accountsSelected.map((account) => account.accountID);

      const data = {
        data: {
          collabFundID: collabFund?.collabFundID,
          accountID: account?.accountID,
          accountMemberIDs: listInvited
        }
      };
      // console.log("Invite participants data: ", data);
      await collabFundServices
        .inviteParticipants(data)
        .then((response) => {
          console.log("Invite participants response: ", response);
          handleCloseAddParticipant();
          onRefresh();
        })
        .catch((error) => {
          console.log("Error inviteParticipants data:", error);
          const errorMessage =
            typeof error === "string"
              ? error
              : "Lỗi khi mời người tham gia quỹ hợp tác";
          Alert.alert("Lỗi khi mời người tham gia quỹ hợp tác", errorMessage, [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed")
            }
          ]);
        })
        .then(() => {
          console.log("Invite participants done");
          // alert success
          Alert.alert(
            "Mời người tham gia quỹ hợp tác thành công",
            "Đã mời người tham gia quỹ hợp tác thành công",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed")
              }
            ]
          );
        });
    } catch (error) {
      console.log("Error inviteParticipants data:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : "Lỗi khi mời người tham gia quỹ hợp tác";
      Alert.alert("Lỗi khi mời người tham gia quỹ hợp tác", errorMessage, [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]);
    }
  }

  useEffect(() => {
    if (currentSearchText) {
      setIsShowSearchResult(true);
      searchAccountByKeyword(currentSearchText);
    }
  }, [currentSearchText]);

  async function searchAccountByKeyword(keyword) {
    try {
      keyword = keyword.trim();
      if (!keyword) {
        return;
      }
      setSearchResult([]);
      const data = await collabFundServices.searchAccountByKeyword(keyword);
      const filteredData = data
        .filter((item) => item.accountID !== account?.accountID)
        .filter(
          (item) =>
            !accountsSelected.some(
              (selected) => selected.accountID === item.accountID
            )
        )
        // filter out accounts that are already in the participants list
        .filter(
          (item) =>
            !nowParticipants?.active.some(
              (participant) => participant.accountID === item.accountID
            ) &&
            !nowParticipants?.pending.some(
              (participant) => participant.accountID === item.accountID
            ) &&
            !nowParticipants?.inactive.some(
              (participant) => participant.accountID === item.accountID
            )
        );
      setSearchResult(filteredData);
    } catch (error) {
      console.log("Error searchAccountByKeyword data:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : "Lỗi khi tìm kiếm người tham gia quỹ hợp tác";
      Alert.alert("Lỗi khi tìm kiếm người tham gia quỹ hợp tác", errorMessage, [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]);
    }
  }

  const AnParticipantItem = ({ item }) => {
    return (
      <View
        style={[
          styles.viewParticipantItem,
          styles.shadowCard,
          { borderWidth: item?.isFundholder ? 2 : 0 }
        ]}
      >
        <Image
          source={{
            uri:
              item?.pictureURL !== " " &&
              item?.pictureURL !== null &&
              item?.pictureURL !== undefined &&
              item?.pictureURL !== ""
                ? item?.pictureURL
                : "https://picsum.photos/200/300"
          }}
          style={styles.participantImage}
        />
        <View style={styles.viewParticipantItemInfor}>
          <Text style={styles.participantName}>{item?.accountName}</Text>
          <Text style={styles.participantEmail}>{item?.emailAddress}</Text>
        </View>
        <View style={styles.viewParticipantItemAction}>
          <Text style={styles.textParticipantLasttime}>
            {item?.lastTimeStr}
          </Text>
          <Pressable onPress={() => {}}>
            <Icon name="ellipsis" size={20} color="black" />
          </Pressable>
        </View>
      </View>
    );
  };

  const FlatListParticipants = ({ data, title }) => {
    return (
      <View style={styles.viewAFlatListParticipants}>
        <Text style={styles.textTitleOfFlatList}>{title}</Text>
        {data?.length === 0 ? (
          <Text style={styles.textNoData}>{"..."}</Text>
        ) : (
          <FlatList
            data={data || []}
            scrollEnabled={false}
            renderItem={({ item }) => <AnParticipantItem item={item} />}
            keyExtractor={(item) => item?.accountID}
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.scrollview_Container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* a pressable to add participant */}
      <Pressable
        style={({ pressed }) => [
          styles.pressable_AddParticipant,
          {
            opacity: pressed ? 0.5 : 1
          }
        ]}
        onPress={() => {
          setIsShowModalAddParticipant(true);
        }}
      >
        <Icon name="user-plus" size={20} color="black" />
        <Text
          style={{
            fontSize: 20,
            fontFamily: "OpenSans_500Medium",
            marginHorizontal: 5
          }}
        >
          {"Mời người tham gia"}
        </Text>
      </Pressable>
      <FlatListParticipants
        data={nowParticipants?.active}
        title={"Đang hoạt động"}
      />
      <FlatListParticipants
        data={nowParticipants?.pending}
        title={"Đang chờ"}
      />
      <FlatListParticipants
        data={nowParticipants?.inactive}
        title={"Không hoạt động"}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowModalAddParticipant}
      >
        <View style={styles.view_ModalBackground}>
          <Pressable
            style={{ flex: 1, width: "100%" }}
            onPress={() => handleCloseAddParticipant()}
          />
          <View style={styles.view_ModalAddParticipants}>
            <View
              style={{
                marginVertical: 10,
                width: "100%",
                height: "auto"
                // borderWidth: 1,
                // borderColor: "red",
                // marginHorizontal: 10
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <PaperTextInput
                  style={{ flex: 1, backgroundColor: "white" }}
                  mode="outlined"
                  label="Tìm người tham gia"
                  placeholder="vd: Phạm A, apham@gmail.com ..."
                  // right={
                  //   <PaperTextInput.Icon
                  //     icon="close-thick"
                  //     onPress={() => {
                  //       handleCancelSearch();
                  //     }}
                  //   />
                  // }
                  value={currentSearchText}
                  onChangeText={(text) => {
                    handleOnChangeTextSearch(text);
                  }}
                  onFocus={() => {
                    handleOnFocusSearch();
                  }}
                  onBlur={() => {
                    handleOnBlurSearch();
                  }}
                />
                <Pressable
                  onPress={() => {
                    handleCancelSearch();
                  }}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.2 : 1 },
                    {
                      position: "absolute",
                      left: "90%",
                      width: "10%",
                      height: "50%",
                      alignItems: "center"
                    }
                  ]}
                >
                  <Icon name="xmark" size={25} color="#636e72" />
                </Pressable>
              </View>
              {accountsSelected.length > 0 && (
                // <ScrollView
                //   style={{
                //     borderWidth: 1
                //   }}
                // >
                <View
                  style={{
                    flexDirection: "column",
                    height: "auto",
                    width: "100%",
                    flexWrap: "wrap"
                  }}
                >
                  <Text>{"Mời người tham gia: "}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap"
                    }}
                  >
                    {accountsSelected.map((account) => {
                      return (
                        <PaperChip
                          style={{
                            padding: 2,
                            margin: 2
                          }}
                          key={account?.accountID}
                          // icon="account"
                          avatar={
                            <Image
                              source={{
                                uri: account?.pictureURL
                                  ? account?.pictureURL
                                  : "https://picsum.photos/200/200"
                              }}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 30
                              }}
                            />
                          }
                          onPress={() => {
                            handleOnPressSelectedAccount(account);
                          }}
                          onClose={() => {
                            hanleDeleteAnAccountSelected(account);
                          }}
                        >
                          {account?.accountName}
                        </PaperChip>
                      );
                    })}
                  </View>
                </View>
                // </ScrollView>
              )}
              {isShowSearchResult && (
                <View style={styles.view_SearchResult}>
                  <Text style={styles.text_LabelSearch}>
                    {"Kết quả tìm kiếm: " + searchResult.length + " người"}
                  </Text>
                  {searchResult[0]?.accountName && (
                    <FlatList
                      scrollEnabled={true}
                      data={searchResult}
                      keyExtractor={(item) => item?.accountID}
                      renderItem={({ item }) => {
                        return (
                          <Pressable
                            onPress={() => {
                              hanleSelectedAnAccount(item);
                            }}
                            style={({ pressed }) => [
                              { opacity: pressed ? 0.2 : 1 },
                              styles.pressable_Item_AccountSearch
                            ]}
                          >
                            <View
                              style={
                                styles.view_SearchResult_AnAccountItem_Infor
                              }
                            >
                              <Image
                                source={{
                                  uri: item?.pictureURL
                                    ? item?.pictureURL
                                    : "https://picsum.photos/200/200"
                                }}
                                style={styles.image_AnAvatar}
                              />
                              <View style={{ flexDirection: "column" }}>
                                <Text
                                  style={{
                                    fontSize: 17,
                                    fontFamily: "OpenSans_500Medium"
                                  }}
                                >
                                  {item?.accountName}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    fontFamily: "OpenSans_400Regular_Italic"
                                  }}
                                >
                                  {item?.emailAddress}
                                </Text>
                              </View>
                            </View>
                            <Icon name="user-plus" size={20} color="#636e72" />
                          </Pressable>
                        );
                      }}
                    />
                  )}
                </View>
              )}
              <View style={styles.view_Action}>
                {/* 2 pressable is cancel and save */}
                <Pressable
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.5 : 1
                    },
                    styles.pressabel_Action
                  ]}
                  onPress={() => {
                    handleCloseAddParticipant();
                  }}
                >
                  <Text style={styles.text_Action}>{"Hủy"}</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.5 : 1,
                      backgroundColor: "#dfe6e9"
                    },
                    styles.pressabel_Action
                  ]}
                  onPress={() => {
                    handleSaveAddParticipant();
                  }}
                >
                  <Text style={styles.text_Action}>{"Mời"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text_Action: {
    fontSize: 20,
    fontFamily: "OpenSans_500Medium"
  },
  pressabel_Action: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "darkgray",
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  view_Action: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 10
  },
  text_LabelSearch: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular_Italic",
    marginHorizontal: 10
  },
  view_SearchResult: {
    width: "100%",
    height: "50%",
    borderWidth: 0.5,
    borderColor: "#636e72",
    borderRadius: 5,
    top: 0
  },
  image_AnAvatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginHorizontal: 2
  },
  view_SearchResult_AnAccountItem_Infor: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    flex: 2
  },
  pressable_Item_AccountSearch: {
    // width: "90%",
    flex: 1,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#636e72"
  },
  view_ModalAddParticipants: {
    flex: 3,
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 20
  },
  view_ModalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  scrollview_Container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%"
  },
  pressable_AddParticipant: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 10
  },
  textParticipantLasttime: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular"
    // color: "gray"
  },
  viewParticipantItemAction: {
    flexDirection: "column",
    // borderWidth: 1,
    flex: 1,
    justifyContent: "space-around",
    alignContent: "flex-end",
    alignItems: "flex-end"
  },
  textNoData: {
    fontSize: 15,
    fontFamily: "OpenSans_400Regular_Italic",
    alignSelf: "center",
    color: "gray"
  },
  textTitleOfFlatList: {
    fontSize: 20,
    fontFamily: "Inconsolata_600SemiBold",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 5
  },
  viewAFlatListParticipants: {
    justifyContent: "center",
    // alignItems: "center",
    alignContent: "center"
  },
  viewParticipantItemInfor: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: 10
    // width: "100%"
  },
  viewParticipantItem: {
    flexDirection: "row",
    marginHorizontal: 2,
    marginVertical: 2,
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: "98%",
    flex: 1
    // borderWidth: 1,
    // borderColor: "red",
    // alignSelf: "center"
  },
  participantImage: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  participantEmail: {
    fontSize: 15,
    fontFamily: "Inconsolata_400Regular"
  },
  participantName: {
    fontSize: 22,
    fontFamily: "Inconsolata_500Medium"
  },
  shadowCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 8,
    borderBottomWidth: 0.25,
    borderBottomColor: "darkgray"
  }
});

export default CfPaticianComponent;

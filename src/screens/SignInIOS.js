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
  Pressable
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import pbms from "../api/pbms";
import { API } from "../constants/api.constant";
import { signinHardcode } from "../redux/authenSlice";

const SignInIOS = ({callback}) => {
  const navigation = useNavigation();

  const [accounts, setAccounts] = useState([]);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const accounts = await pbms.get(
        "https://pbms-be-api-vqj42lqqmq-as.a.run.app/api/test/getAllAccount"
      );
      setAccounts(accounts.data);
      // console.log("accounts:", accounts.data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const handleAnAccountItemClicked = (account) => {
    dispatch(signinHardcode(account));
    saveData("userInfo", JSON.stringify(account));
    setTimeout(() => {
      // navigation.navigate("Home");
      callback(true);
    }, 100);
  };

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const AnAccountItem = ({ account }) => {
    return (
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? "#b2bec3" : "white"
          },
          styles.viewAnAccountItem
        ]}
        onPress={() => handleAnAccountItemClicked(account)}
      >
        <Text>{account.accountID}</Text>
        <Text>{account.accountName}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.viewContainer}>
      <Text>SignInIOS</Text>
      <View style={styles.viewFlatList}>
        <FlatList
          style={styles.flatList}
          data={accounts}
          keyExtractor={(item) => item.accountID}
          renderItem={({ item }) => <AnAccountItem account={item} />}
        />
      </View>
      {/* <Button title="Go to Home" onPress={() => navigation.navigate("Home")} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  viewAnAccountItem: {
    borderWidth: 1,
    borderColor: "black",
    width: Dimensions.get("window").width - 20,
    margin: 5,
    padding: 5
  },
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  flatList: {
    // flex: 1,
    // borderWidth: 1,
    // borderColor: "black",
    // height: 300,
    // width: Dimensions.get("window").width
  },
  viewFlatList: {
    // flex: 1,
    borderWidth: 1,
    borderColor: "black",
    height: "80%",
    width: Dimensions.get("window").width - 20
  }
});

export default SignInIOS;

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Button, StyleSheet, Platform } from "react-native";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome6";
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFonts,
  Inconsolata_200ExtraLight,
  Inconsolata_300Light,
  Inconsolata_400Regular,
  Inconsolata_500Medium,
  Inconsolata_600SemiBold,
  Inconsolata_700Bold,
  Inconsolata_800ExtraBold,
  Inconsolata_900Black
} from "@expo-google-fonts/inconsolata";

import {
  OpenSans_300Light,
  OpenSans_300Light_Italic,
  OpenSans_400Regular,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold,
  OpenSans_800ExtraBold_Italic
} from "@expo-google-fonts/open-sans";

import HomeScreen from "./src/screens/HomeScreen";
import TransactionScreen from "./src/screens/transaction/TransactionScreen";
import AddTransactionScreen from "./src/screens/transaction/AddTransactionScreen";
import TestScreen from "./src/screens/TestScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignInIOS from "./src/screens/SignInIOS";
import MyAccount from "./src/screens/MyAccount";
import CollabFundScreen from "./src/screens/collabfund/collabFundScreenv2";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isSignin, setIsSignin] = useState(false);

  useEffect(() => {
    checkUserSignedIn();
  });

  async function checkUserSignedIn() {
    try {
      //setIsSignin(false);
      // const userInfo = await AsyncStorage.getItem("userInfo");
      // if (userInfo === null || userInfo === "") {
      //   // console.log("false: ", userInfo);
      //   setIsSignin(false);
      // } else {
      //   // console.log("true: ", userInfo);
      //   setIsSignin(true);
      // }
    } catch (error) {
      console.error("Error checking user signed in:", error);
    }
  }

  const callBackSignIn = (isSignIn) => {
    console.log("isSignIn: ", isSignIn);
    setIsSignin(isSignIn);
  };

  const callBackSignOut = (isSignOut) => {
    console.log("isSignOut: ", isSignOut);
    setIsSignin(isSignOut);
  };

  const [fontsLoaded] = useFonts({
    Inconsolata_200ExtraLight,
    Inconsolata_300Light,
    Inconsolata_400Regular,
    Inconsolata_500Medium,
    Inconsolata_600SemiBold,
    Inconsolata_700Bold,
    Inconsolata_800ExtraBold,
    Inconsolata_900Black,
    OpenSans_300Light,
    OpenSans_300Light_Italic,
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_500Medium,
    OpenSans_500Medium_Italic,
    OpenSans_600SemiBold,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold,
    OpenSans_800ExtraBold_Italic
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const MyAccountScreen = ({ navigation }) => {
    return <MyAccount navigation={navigation} callback={callBackSignOut} />;
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "#eee" }]}
        edges={["right", "top", "left"]}
      >
        <Provider store={store}>
          <NavigationContainer>
            {/* if the user is not signed in then show SigninIOS*/}
            {!isSignin ? (
              <SignInIOS callback={callBackSignIn} />
            ) : (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                      case "Home":
                        iconName = focused ? "home" : "home-outline";
                        break;
                      case "Settings":
                        iconName = focused ? "settings" : "settings-outline";
                        break;
                      // case "Signin":
                      //   iconName = focused ? "log-in" : "log-in-outline";
                      //   break;
                      case "Transaction":
                        iconName = focused ? "cash" : "cash-outline";
                        break;
                      case "AddTransaction":
                        iconName = focused
                          ? "add-circle"
                          : "add-circle-outline";
                        break;
                      case "MyAccount":
                        iconName = focused ? "grid" : "grid-outline";
                        break;
                      case "CollabFund":
                        iconName = focused ? "people" : "people-outline";
                        break;
                    }
                    return (
                      <Ionicons
                        name={iconName}
                        size={
                          route.name == "AddTransaction"
                            ? size * 2.2
                            : size * 1.1
                        }
                        color={color}
                        style={{
                          position: "absolute",
                          bottom: -30,
                          top: route.name == "AddTransaction" ? -12 : 15,
                          borderRadius: 50,
                          padding: route.name == "AddTransaction" ? 5 : 0
                        }}
                      />
                    );
                  },
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                  headerShown: false,
                  tabBarShowLabel: false,
                  tabBarStyle: {
                    backgroundColor: "white",
                    borderTopWidth: 0,
                    shadowColor: "darkgray",
                    shadowOffset: {
                      width: 0,
                      height: 10
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.5,
                    elevation: 5,
                    position: "absolute",
                    bottom: 20,
                    left: 10,
                    right: 10,
                    borderRadius: 20,
                    height: 60,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    display: route.name == "Signin" ? "none" : "flex"
                  }
                })}
              >
                {/* if platform is IOS then add SignInIOS, if Android add SignInScreen */}
                {/* {Platform.OS === "ios" ? (
                  <Tab.Screen name="Signin" component={SignInIOS} />
                ) : (
                  // <Tab.Screen name="Signin" component={SigninScreen} />
                  <Tab.Screen name="Signin" component={SignInIOS} />
                )} */}
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Transaction" component={TransactionScreen} />
                <Tab.Screen
                  name="AddTransaction"
                  component={AddTransactionScreen}
                />
                <Tab.Screen name="CollabFund" component={CollabFundScreen} />
                {/* <Tab.Screen name="Settings" component={TestScreen} /> */}
                {/* if the user is signed in then add MyAccount screen */}
                {/* {isSignin ? ( */}
                <Tab.Screen
                  name="MyAccount"
                  component={MyAccountScreen}
                  // initialParams={{ callback: callBackSignOut }}
                />
                {/* // ) : null} */}
              </Tab.Navigator>
            )}
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

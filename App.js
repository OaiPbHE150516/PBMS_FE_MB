import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
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

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
//   isErrorWithCode
// } from "@react-native-google-signin/google-signin";

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
// import SigninScreen from "./src/screens/SigninScreen";
import SignInIOS from "./src/screens/SignInIOS";
import MyAccount from "./src/screens/MyAccount";
import CollabFundScreen from "./src/screens/collabfund/collabFundScreenv2";
import NewAddTransactionScreen from "./src/screens/transaction/newAddTransactionScreen";

const { width, height } = Dimensions.get("window");

// //remove comment below import statement to enable SignInAndroid in Android platform
let SignInAndroid;
if (Platform.OS === "android") {
  SignInAndroid = require("./src/screens/SignInAndroid").default;
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
      console.log("Error checking user signed in:", error);
    }
  }

  const callBackSignIn = (isSignIn) => {
    console.log("isSignIn: ", isSignIn);
    setIsSignin(isSignIn);
  };

  const callBackSignOut = (isSignOut) => {
    console.log("isSignOut: ", isSignOut);
    setIsSignin(isSignOut);
    handleSignOut();
  };

  const handleSignOut = async () => {
    try {
      //// remove code below to enable sign out
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
    } catch (error) {
      console.log("Error signing out: ", error);
      Alert.alert("Error signing out: ");
    }
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
        style={[
          styles.container,
          { backgroundColor: "rgba(0,0,0,0)", width, height }
        ]}
        edges={["right", "top", "left"]}
      >
        <GestureHandlerRootView style={styles.container}>
          <Provider store={store}>
            <NavigationContainer>
              {/* if the user is not signed in then show SigninIOS*/}
              {!isSignin ? (
                Platform.OS === "ios" ? (
                  <SignInIOS callback={callBackSignIn} />
                ) : (
                  <SignInAndroid callback={callBackSignIn}/>
                )
              ) : (
                // null
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarHideOnKeyboard: Platform.OS !== "ios",
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
                        // case "AddTransaction":
                        //   iconName = focused
                        //     ? "add-circle"
                        //     : "add-circle-outline";
                        //   break;
                        case "MyAccount":
                          iconName = focused ? "grid" : "grid-outline";
                          break;
                        case "CollabFund":
                          iconName = focused ? "people" : "people-outline";
                          break;
                        case "NewAddTransaction":
                          iconName = focused
                            ? "add-circle"
                            : "add-circle-outline";
                          break;
                      }
                      return (
                        <Ionicons
                          name={iconName}
                          size={
                            route.name == "NewAddTransaction"
                              ? size * 2.5
                              : size * 1.2
                          }
                          color={color}
                          style={{
                            position: "absolute",
                            bottom: -30,
                            top: route.name == "NewAddTransaction" ? -15 : 15,
                            borderRadius: 50,
                            padding: route.name == "NewAddTransaction" ? 5 : 0
                          }}
                        />
                      );
                    },
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "gray",
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                      // backgroundColor: "white",
                      borderTopWidth: 0.25,
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
                      borderWidth: 0.75,
                      borderColor: "darkgray",
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
                  <Tab.Screen
                    name="Transaction"
                    component={TransactionScreen}
                  />
                  {/* <Tab.Screen
                    name="AddTransaction"
                    component={AddTransactionScreen}
                  /> */}
                  <Tab.Screen
                    // NewAddTransactionScreen
                    name="NewAddTransaction"
                    component={NewAddTransactionScreen}
                  />
                  <Tab.Screen name="CollabFund" component={CollabFundScreen} />
                  {/* <Tab.Screen name="Settings" component={TestScreen} /> */}
                  {/* if the user is signed in then add MyAccount screen */}
                  {/* {isSignin ? ( */}
                  <Tab.Screen
                    name="MyAccount"
                    component={MyAccountScreen}
                    listeners={({ navigation }) => ({
                      tabLongPress: (e) => {
                        setIsSignin(false);
                        handleSignOut();
                      }
                    })}
                    // initialParams={{ callback: callBackSignOut }}
                  />

                  {/* // ) : null} */}
                </Tab.Navigator>
              )}
            </NavigationContainer>
          </Provider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

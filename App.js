import * as React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./src/store/store";

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

const Tab = createBottomTabNavigator();

export default function App() {
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
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "#eee" }]}
        edges={["right", "top", "left"]}
      >
        <Provider store={store}>
          <NavigationContainer>
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
                    case "Welcome":
                      iconName = focused ? "person" : "person-outline";
                      break;
                    case "Transaction":
                      iconName = focused ? "cash" : "cash-outline";
                      break;
                    case "AddTransaction":
                      iconName = focused ? "add-circle" : "add-circle-outline";
                      break;
                  }
                  return (
                    <Ionicons
                      name={iconName}
                      size={route.name == "AddTransaction" ? size * 2 : size}
                      color={color}
                      style={{
                        position: "absolute",
                        bottom: -10,
                        top: route.name == "AddTransaction" ? -12 : 15,
                        // backgroundColor:
                        //   route.name == "AddTransaction" ? "tomato" : null,
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
                  borderColor: "lightgray"
                }
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Transaction" component={TransactionScreen} />
              <Tab.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
              />
              {/* <Tab.Screen name="TestScreen" component={TestScreen} /> */}
            </Tab.Navigator>
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

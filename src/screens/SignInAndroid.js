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
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { BlurView } from "expo-blur";

import { signin, signout } from "../redux/authenSlice";
import { setIsNeedSignOutNow } from "../redux/authenSlice";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  isErrorWithCode
} from "@react-native-google-signin/google-signin";

const imageBackground = { uri: "https://picsum.photos/1080/1920" };

const SignInAndroid = ({ callback }) => {
  // const navigation = useNavigation();
  const isNeedSignOutNow = useSelector(
    (state) => state.authen?.isNeedSignOutNow
  );
  const dispatch = useDispatch();
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com",
      androidClientId:
        "461985987390-v47dreoeqkfsgh6fn513dgokstu8i8gf.apps.googleusercontent.com",
      // androidClientId:
      //   "461985987390-p2vekcu9quj88910pqiftjctqegp5rl1.apps.googleusercontent.com",
      offlineAccess: true,
      // scopes: ["profile", "email"],
      requestIdToken:
        "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com"
    });
  };

  const handleIsSignOutBefore = async () => {
    try {
      if (isNeedSignOutNow) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut().finally(() => {
          setIsNeedSignOutNow(false);
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const signInWithGoogle = async () => {
    handleIsSignOutBefore();
    console.log("signInWithGoogle");
    try {
      // setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn()
        .then((userInfo) => {
          console.log("userInfo: ", userInfo);
          dispatch(signin(userInfo.idToken));
        })
        .finally(() => {
          callback(true);
        })
        .catch((error) => {
          console.log("error: ", error);
          Alert.alert(
            "Error",
            "Có lỗi xảy ra, vui lòng thử lại sau" + error.message
          );
          switch (error.code) {
            case statusCodes.SIGN_IN_CANCELLED:
              console.log("User cancelled the sign in");
              Alert.alert("Cancelled", "User cancelled the sign in");
              break;
            case statusCodes.IN_PROGRESS:
              console.log("Sign in is already in progress");
              Alert.alert("In progress", "Sign in is already in progress");
              break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              console.log("Play services are not available");
              Alert.alert("Play services", "Play services are not available");
              break;
            default:
              console.log("Something went wrong here:", error.message);
              Alert.alert("Error", "Something went wrong: " + error.message);
              console.log("error.code: ", error.code);
              break;
          }
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBackground} style={styles.imageBackground}>
        <View style={styles.view_Center}>
          {/* <Image
            style={{ width: "50%", height: "50%", top: "-15%" }}
            source={require("../../assets/images/save-money.png")}
            resizeMode="contain"
          /> */}
          <View style={styles.view_Title}>
            <Text style={styles.text_Title}>{"Welcome to"}</Text>
            <Text style={styles.text_Title_Big}>{"FAS"}</Text>
            <View style={styles.view_Description}>
              <Text style={styles.text_Description}>
                {"Trợ lý quản lý thu chi cá nhân"}
              </Text>
            </View>
          </View>

          <Pressable
            onPressIn={() => {
              console.log("onPressIn");
              // setIsLoading(true);
            }}
            onPress={signInWithGoogle}
            style={(pressed) => {
              return [
                styles.pressable_SigninWithGoogle,
                {
                  backgroundColor: pressed ? "#b2bec3" : "#dfe6e9"
                }
              ];
            }}
          >
            <Image
              source={require("../../assets/7123025_logo_google_g_icon.png")}
              style={{ width: 60, height: 60 }}
            />
            <Text style={styles.text_SigninWithGoogle}>
              {"Sign in with Google"}
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  text_Description: {
    fontSize: 20,
    fontFamily: "OpenSans_300Light",
    textAlign: "left"
  },
  view_Description: {
    alignSelf: "flex-start"
  },
  view_Title: {
    alignSelf: "flex-start"
  },
  text_Title_Big: {
    fontSize: 50,
    fontFamily: "OpenSans_500Medium",
    textAlign: "left",
    color: "#ff7675"
  },
  text_Title: {
    fontSize: 25,
    fontFamily: "OpenSans_400Regular",
    textAlign: "left"
  },
  view_Center: {
    // flex: 1,
    position: "absolute",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: "50%",
    borderWidth: 0.5,
    borderColor: "darkgray",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: "darkgray",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.5,
    elevation: 5,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  pressable_SigninWithGoogle: {
    width: "90%",
    height: 50,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    borderWidth: 0.5,
    borderColor: "darkgray",
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "darkgray",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.5,
    elevation: 5
  },
  text_SigninWithGoogle: {
    fontSize: 20,
    fontFamily: "Inconsolata_400Regular",
    textAlign: "left"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0"
  },
  button: {
    width: 192,
    height: 48
  }
});

export default SignInAndroid;

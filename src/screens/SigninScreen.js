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

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  isErrorWithCode
} from "@react-native-google-signin/google-signin";

const SigninScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    // configureGoogleSignIn();
    GoogleSignin.configure({
      webClientId:
        "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com",
      androidClientId:
        "461985987390-p2vekcu9quj88910pqiftjctqegp5rl1.apps.googleusercontent.com",
      offlineAccess: true,
      scopes: ["profile", "email"],
      requestIdToken: "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com",
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo: ", userInfo);
      // Handle successful sign in here
    } catch (error) {
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
    }
  };
  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SigninScreen;

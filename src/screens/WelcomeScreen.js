import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const WelcomeScreen = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = async () => {
    await GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID",
      offlineAccess: true,
      scopes: ["profile", "email"],
    });
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      // Handle successful sign in here
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the sign in");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services are not available");
      } else {
        console.log("Something went wrong:", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome!</Text>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
  },
});

export default WelcomeScreen;

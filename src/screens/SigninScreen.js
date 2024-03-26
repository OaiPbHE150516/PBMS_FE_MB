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
  TextInput
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
  const [androidClientId, setAndroidClientId] = useState("");
  useEffect(() => {
    // configureGoogleSignIn();
    GoogleSignin.configure({
      webClientId:
        "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com",
      androidClientId: androidClientId,
      offlineAccess: true,
      scopes: ["profile", "email"],
      requestIdToken:
        "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com"
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo: ", userInfo);
      // Handle successful sign in here
      // alert("Signed in successfully");
      Alert.alert("Signed in successfully: ", userInfo.user.email);
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

  const handleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log("Signed out successfully");
      Alert.alert("Signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Error signing out: ");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textInput}>
        <TextInput
          onChangeText={(text) => {
            setAndroidClientId(text);
          }}
          numberOfLines={2}
          multiline={true}
        >
          {androidClientId}
        </TextInput>
      </View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
      <Pressable
        onPress={() => {
          handleSignOut();
        }}
      >
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    width: "80%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20
  }
});

export default SigninScreen;

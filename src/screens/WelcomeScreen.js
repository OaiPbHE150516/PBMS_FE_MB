import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import {
//   GoogleSignin
//   // GoogleSigninButton,
//   // statusCodes,
//   // isErrorWithCode,
// } from "@react-native-google-signin/google-signin";

const WelcomeScreen = () => {
  // const navigation = useNavigation();
  // useEffect(() => {
  //   configureGoogleSignIn();
  // }, []);

  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   return () => {
  //     GoogleSignin.configure({
  //       webClientId:
  //         "461985987390-j27u8421jr49d8kndibdnrasvjg0nrno.apps.googleusercontent.com",
  //       androidClientId:
  //         "461985987390-j27u8421jr49d8kndibdnrasvjg0nrno.apps.googleusercontent.com",
  //       offlineAccess: true,
  //       scopes: ["profile", "email"]
  //       // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  //       // offlineAccess: true,
  //       // webClientId: '461985987390-j27u8421jr49d8kndibdnrasvjg0nrno.apps.googleusercontent.com',
  //       // accountName: 'Drive',
  //     });
  //   };
  // }, []);

  // const GoogleLogin = async () => {
  //   await GoogleSignin.hasPlayServices();
  //   const userInfo = await GoogleSignin.signIn();
  //   console.log("userInfo: ", userInfo);
  //   console.log("error: ", error);
  //   return userInfo;
  // };

  // const handleGoogleLogin = async () => {
  //   console.log("handleGoogleLogin");
  //   setLoading(true);
  //   try {
  //     console.log("GoogleLogin");
  //     const response = await GoogleLogin();
  //     const { idToken, user } = response;
  //     console.log("idToken: ", idToken);
  //     if (idToken) {
  //       const resp = await authAPI.validateToken({
  //         token: idToken,
  //         email: user.email
  //       });
  //       await handlePostLoginData(resp.data);
  //     }
  //   } catch (apiError) {
  //     setError(
  //       apiError?.response?.data?.error?.message || "Something went wrong"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handlePostLoginData = async (data) => {
  //   const { user, token } = data;
  //   console.log("user: ", user);
  //   console.log("token: ", token);

  //   // await dispatch(signin(user));
  //   // await dispatch(setToken(token));
  //   // await dispatch(getTotalBalance(user.accountID));
  // };

  // const signInWithGoogle = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log(userInfo);
  //     // Handle successful sign in here
  //   } catch (error) {
  //     switch (error.code) {
  //       case statusCodes.SIGN_IN_CANCELLED:
  //         console.log("User cancelled the sign in");
  //         Alert.alert("Cancelled", "User cancelled the sign in");
  //         break;
  //       case statusCodes.IN_PROGRESS:
  //         console.log("Sign in is already in progress");
  //         Alert.alert("In progress", "Sign in is already in progress");
  //         break;
  //       case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
  //         console.log("Play services are not available");
  //         Alert.alert("Play services", "Play services are not available");
  //         break;
  //       default:
  //         console.log("Something went wrong:", error.message);
  //         Alert.alert("Error", "Something went wrong");
  //         break;
  //     }
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome!2</Text>
      {/* <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      /> */}
      <View>
        {/* <Pressable onPress={handleGoogleLogin}>
          <Text>Google Login</Text>
        </Pressable> */}
      </View>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 30
  }
});

export default WelcomeScreen;

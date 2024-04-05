// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Button,
//   Alert,
//   FlatList,
//   Dimensions,
//   Image,
//   Pressable,
//   TextInput,
//   ImageBackground,
//   ActivityIndicator
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useDispatch, useSelector } from "react-redux";
// import { BlurView } from "expo-blur";

// import { signin, signout } from "../redux/authenSlice";

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
//   isErrorWithCode
// } from "@react-native-google-signin/google-signin";

// const imageBackground = { uri: "https://picsum.photos/1080/1920" };

// const SigninScreen = () => {
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(false);
//   const account = useSelector((state) => state.authen.account);
//   const dispatch = useDispatch();

//   const configureGoogleSignIn = () => {
//     GoogleSignin.configure({
//       webClientId:
//         "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com",
//       androidClientId:
//         "461985987390-v47dreoeqkfsgh6fn513dgokstu8i8gf.apps.googleusercontent.com",
//       // androidClientId:
//       //   "461985987390-p2vekcu9quj88910pqiftjctqegp5rl1.apps.googleusercontent.com",
//       offlineAccess: true,
//       // scopes: ["profile", "email"],
//       requestIdToken:
//         "461985987390-sb848ug9vlln2lemncolefu15ckc7ljg.apps.googleusercontent.com"
//     });
//   };

//   // async function lastAccount() {
//   //   const userInfo = await AsyncStorage.getItem("userInfo");
//   //   console.log("userInfo: ", userInfo);
//   //   if (userInfo !== null) {
//   //     dispatch(signin(JSON.parse(userInfo).idToken));
//   //     navigation.navigate("Home");
//   //   }
//   // }

//   async function lastAccount() {
//     const userInfo = await AsyncStorage.getItem("userInfo");
//     // console.log("userInfo: ", userInfo);
//     if (userInfo !== null) {
//       console.log("not null");
//       // console.log("userInfo: ", userInfo);
//       console.log("JSON.parse(userInfo).idToken: ", JSON.parse(userInfo).idToken);
//       dispatch(signin(JSON.parse(userInfo).idToken));
//       setTimeout(() => {
//         setIsLoading(false);
//         navigation.navigate("Home");
//       }, 500);
//     }
//   }

//   useEffect(() => {
//     setIsLoading(true);
//     console.log("account: ", account);
//     configureGoogleSignIn();
//     if (account !== null) {
//       setIsLoading(false);
//       navigation.navigate("Home");
//     }
//     lastAccount();
//   }, []);

//   const saveData = async (key, value) => {
//     try {
//       await AsyncStorage.setItem(key, value);
//     } catch (error) {
//       console.error("Error saving data: ", error);
//     }
//   };

//   const signInWithGoogle = async () => {
//     console.log("signInWithGoogle");
//     try {
//       setIsLoading(true);
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       // Handle successful sign in here
//       //alert("Signed in successfully");
//       // Alert.alert("Signed in successfully: ", userInfo.user.email);
//       // console.log("userInfo: ", userInfo);
//       saveData("userInfo", JSON.stringify(userInfo));
//       dispatch(signin(userInfo.idToken));
//       setIsLoading(false);
//       navigation.navigate("Home");
//     } catch (error) {
//       switch (error.code) {
//         case statusCodes.SIGN_IN_CANCELLED:
//           console.log("User cancelled the sign in");
//           Alert.alert("Cancelled", "User cancelled the sign in");
//           break;
//         case statusCodes.IN_PROGRESS:
//           console.log("Sign in is already in progress");
//           Alert.alert("In progress", "Sign in is already in progress");
//           break;
//         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//           console.log("Play services are not available");
//           Alert.alert("Play services", "Play services are not available");
//           break;
//         default:
//           console.log("Something went wrong here:", error.message);
//           Alert.alert("Error", "Something went wrong: " + error.message);
//           console.log("error.code: ", error.code);
//           break;
//       }
//     }
//   };

//   const handleSignOut = async () => {
//     setIsLoading(false);
//     try {
//       await GoogleSignin.revokeAccess();
//       await GoogleSignin.signOut();
//       // set userInfo to null
//       saveData("userInfo", "");
//       dispatch(signout());
//       console.log("Signed out successfully");
//       Alert.alert("Signed out successfully");
//     } catch (error) {
//       console.error("Error signing out: ", error);
//       Alert.alert("Error signing out: ");
//     }
//   };

//   return (
//     <ImageBackground source={imageBackground} style={styles.container}>
//       {/* a button to sign in with Google custom */}
//       <BlurView intensity={20} tint="light" style={styles.viewCenter}>
//         <Image
//           source={{
//             uri: "https://static.vecteezy.com/system/resources/previews/025/559/670/original/hands-coin-donation-charity-outline-blue-icon-button-logo-community-support-design-vector.jpg"
//           }}
//           style={{ width: "50%", height: "50%" }}
//         />

//         <Pressable
//           onPressIn={() => {
//             setIsLoading(true);
//           }}
//           onPress={signInWithGoogle}
//           style={(pressed) => {
//             return [
//               styles.pressableSigninWithGoogle,
//               {
//                 backgroundColor: pressed ? "rgba(0, 0, 0, 0.1)" : "white"
//               }
//             ];
//           }}
//           disabled={isLoading}
//         >
//           <Image
//             source={require("../../assets/7123025_logo_google_g_icon.png")}
//             style={{ width: 60, height: 60 }}
//           />
//           <Text style={styles.textSigninWithGoogle}>
//             {isLoading ? "Signing in..." : "Sign in with Google"}
//             {/* {"Sign in with Google"} */}
//           </Text>
//         </Pressable>
//         <Pressable
//           onPress={() => {
//             navigation.navigate("Home");
//           }}
//         >
//           <Text>Go to Home</Text>
//         </Pressable>
//         <Pressable
//           onPress={() => {
//             handleSignOut();
//           }}
//         >
//           <Text>Sign out</Text>
//         </Pressable>
//       </BlurView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   viewCenter: {
//     // flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white",
//     width: "80%",
//     height: "45%",
//     borderWidth: 0.5,
//     borderColor: "darkgray",
//     borderRadius: 15,
//     shadowColor: "darkgray",
//     shadowOffset: {
//       width: 0,
//       height: 10
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 3.5,
//     elevation: 5,
//     // top: "20%"
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   pressableSigninWithGoogle: {
//     width: "90%",
//     height: 50,
//     marginHorizontal: 10,
//     marginVertical: 15,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     alignContent: "center",
//     borderWidth: 0.5,
//     borderColor: "darkgray",
//     borderRadius: 15,
//     backgroundColor: "white",
//     shadowColor: "darkgray",
//     shadowOffset: {
//       width: 0,
//       height: 10
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 3.5,
//     elevation: 5
//   },
//   textSigninWithGoogle: {
//     fontSize: 20,
//     fontFamily: "Inconsolata_400Regular",
//     textAlign: "left"
//   },
//   textInput: {
//     width: "80%",
//     height: 50,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 20
//   }
// });

// export default SigninScreen;

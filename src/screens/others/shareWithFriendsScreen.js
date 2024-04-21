import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Image,
  Share
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome6";

const ShareWithFriendsScreen = ({ navigation }) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Chào bạn! Đã bao giờ bạn cảm thấy cần một công cụ đơn giản để quản lý ngân sách cá nhân của mình chưa? Hãy thử ứng dụng của chúng tôi! Với sự hỗ trợ của trí tuệ nhân tạo, ứng dụng giúp bạn theo dõi chi tiêu, lập kế hoạch tài chính và tiết kiệm một cách thông minh. Khám phá các tính năng như phân tích tự động, gợi ý tiết kiệm và báo cáo chi tiêu chi tiết. Quản lý tài chính cá nhân chưa bao giờ dễ dàng đến thế!"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.viewStyle}>
      <View
        style={{
          // flex: 1,
          // width: "100%",
          height: "50%",
          borderWidth: 1,
          borderColor: "darkgray",
          marginHorizontal: 10,
          paddingHorizontal: 5,
          borderRadius: 10,
        }}
      >
        <Text>
          {
            "Nếu thấy ứng dụng hữu ích, bạn có thể share chúng tôi với bạn bè của bạn ngay"
          }
        </Text>
      </View>
      <Pressable
        onPress={onShare}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "lightgray" : "#74b9ff",
            marginTop: 20,
            padding: 10,
            flexDirection: "row",
            width: "50%",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            borderRadius: 10,
            borderBottomWidthdth: 0.5,
            borderBottomColor: "#2d3436"
          }
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "OpenSans_300Light",
            color: "#2d3436"
          }}
        >
          {"Share message"}
        </Text>
        <Icon name="share-from-square" size={30} color="#2d3436" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
});

export default ShareWithFriendsScreen;

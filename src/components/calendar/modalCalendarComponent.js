import React, { useState, useEffect, useRef, Component } from "react";
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
  PanResponder
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Calendar, CalendarList, LocaleConfig } from "react-native-calendars";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";
import { LinearGradient } from "expo-linear-gradient";

export function ModalCalendarComponent() {
  //   const [selected, setSelected] = useState("");

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const initialSelectedIndex = 1;

  return (
    <View style={styles.viewParent}>
      <View>
        <Text>Chọn ngày</Text>
      </View>
      <View style={styles.viewCalendar}>
        <CalendarList
          style={{ alignSelf: "center" }}
          hideArrows={false}
          // hideDayNames={true}
          onDayPress={(day) => {
            console.log("selected day", day);
          }}
          onDayLongPress={(day) => {
            console.log("long selected day", day);
          }}
          onVisibleMonthsChange={(months) => {
            console.log("now these months are visible", months);
          }}
          onMonthChange={(month) => {
            console.log("month changed", month);
          }}
          hideExtraDays={false}
          firstDay={1}
          horizontal={true}
          calendarWidth={385}
          calendarHeight={320}
          pastScrollRange={50}
          futureScrollRange={50}
          scrollEnabled={true}
        />
      </View>
      <View style={styles.viewScrollTime}>
        {/* <ScrollPicker
          dataSource={["1", "2", "3", "4", "5", "6"]}
          selectedIndex={1}
          renderItem={(data, index) => {
            return <Text>{data}</Text>;
          }}
          onValueChange={(data, selectedIndex) => {
            console.log(data + " : " + selectedIndex);
          }}
          wrapperHeight={300}
          wrapperBackground="#FFFFFF"
          itemHeight={60}
          highlightColor="#d8d8d8"
          highlightBorderWidth={2}
        /> */}
        <DynamicallySelectedPicker
          items={[
            {
              value: 1,
              label: "Item 1"
            },
            {
              value: 2,
              label: "Item 2"
            },
            {
              value: 3,
              label: "Item 3"
            },
            {
              value: 4,
              label: "Item 4",
              // itemColor: "blue"
            },
            {
              value: 5,
              label: "Item 5"
            }
          ]}
          onScroll={({ index }) => setSelectedItemIndex(index)}
          onMomentumScrollBegin={({ index }) => setSelectedItemIndex(index)}
          onMomentumScrollEnd={({ index }) => setSelectedItemIndex(index)}
          onScrollBeginDrag={({ index }) => setSelectedItemIndex(index)}
          onScrollEndDrag={({ index }) => setSelectedItemIndex(index)}
          initialSelectedIndex={initialSelectedIndex}
          height={150}
          width={100}
          fontFamily="Inconsolata_500Medium"
          selectedItemBorderColor="darkgray"
          scrollEnabled={true}
          transparentItemRows={1}
        />
        <View style={styles.selectedItemWrapper}>
          <Text>Selected item index {selectedItemIndex}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewScrollTime: {
    flex: 1,
    // backgroundColor: "green",
    borderWidth: 1,
    borderColor: "darkgray",
    // height: "80%",
  },
  viewParent: {
    flex: 1
  },
  viewCalendar: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 5
    // margin: 5,
  }
});

LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12"
  ],
  monthNamesShort: [
    "Th.1",
    "Th.2",
    "Th.3",
    "Th.4",
    "Th.5",
    "Th.6",
    "Th.7",
    "Th.8",
    "Th.9",
    "Th.10",
    "Th.11",
    "Th.12"
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy"
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay"
};
LocaleConfig.defaultLocale = "vi";

// export default ModalCalendarComponent;

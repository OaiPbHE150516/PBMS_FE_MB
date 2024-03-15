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
import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";

const hourInDay = [
  {
    value: 0,
    label: "00",
    itemColor: "black"
  }
];

const minuteInHour = [
  {
    value: 0,
    label: "00",
    itemColor: "black"
  }
];

function pushDataForHourInDay() {
  console.log("pushDataForhourInDay");
  for (let i = 1; i < 24; i++) {
    let hour = i < 10 ? "0" + i : i;
    hourInDay.push({
      value: hour,
      label: hour + "",
      itemColor: "black"
    });
  }
}

function pushDataForMinuteInHour() {
  for (let i = 0; i < 60; i += 5) {
    if (i === 0) {
      continue;
    }
    console.log("i", i);
    let minute = i < 10 ? "0" + i : i;
    minuteInHour.push({
      value: minute,
      label: minute + "",
      itemColor: "black"
    });
  }
}

export function ModalCalendarComponent() {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const initialSelectedIndex = 1;

  useEffect(() => {
    pushDataForHourInDay();
    pushDataForMinuteInHour();
  }, []);

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
      <View style={styles.viewTimePresent}>
        <Text style={styles.textTimePresent}>
          Chọn giờ: {selectedHour} : {selectedMinute}
        </Text>
      </View>
      <View style={styles.viewScrollTime}>
        {/* <View style={styles.viewScrollHour}>
          <DynamicallySelectedPicker
            items={hourInDay}
            onScroll={({ index }) => setSelectedHour(index)}
            onMomentumScrollBegin={({ index }) => setSelectedHour(index)}
            onMomentumScrollEnd={({ index }) => setSelectedHour(index)}
            onScrollBeginDrag={({ index }) => setSelectedHour(index)}
            onScrollEndDrag={({ index }) => setSelectedHour(index)}
            initialSelectedIndex={initialSelectedIndex}
            height={150}
            width={100}
            fontFamily="OpenSans_500Medium"
            selectedItemBorderColor="darkgray"
            scrollEnabled={true}
            transparentItemRows={1}
          />
        </View>
        <View style={styles.viewScrollMinute}>
          <DynamicallySelectedPicker
            items={minuteInHour}
            onScroll={({ index }) => setSelectedMinute(index)}
            onMomentumScrollBegin={({ index }) => setSelectedMinute(index)}
            onMomentumScrollEnd={({ index }) => setSelectedMinute(index)}
            onScrollBeginDrag={({ index }) => setSelectedMinute(index)}
            onScrollEndDrag={({ index }) => setSelectedMinute(index)}
            initialSelectedIndex={minuteInHour[0]}
            height={150}
            width={100}
            fontFamily="OpenSans_500Medium"
            selectedItemBorderColor="darkgray"
            scrollEnabled={true}
            transparentItemRows={1}
          />
        </View> */}
      </View>
      <View style={styles.selectedItemWrapper}>
        <Text>Selected item index {selectedHour}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewTimePresent: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 10
  },
  textTimePresent: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "Inconsolata_500Medium",
    color: "black"
  },
  viewScrollHour: {
    // backgroundColor: "green",
    // borderWidth: 1,
    // borderColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
  },
  viewScrollMinute: {
    // backgroundColor: "green",
    // borderWidth: 1,
    // borderColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
  },
  viewScrollTime: {
    // flex: 1,
    // backgroundColor: "yellow",
    borderWidth: 1,
    borderColor: "blue",
    flexDirection: "row",
    justifyContent: "center"
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

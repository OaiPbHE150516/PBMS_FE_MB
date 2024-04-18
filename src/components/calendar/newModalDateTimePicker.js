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
  PanResponder,
  ScrollView,
  Image,
  KeyboardAvoidingView
} from "react-native";
import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";
import { useNavigatio, useIsFocused } from "@react-navigation/native";

import {
  startOfWeek,
  endOfWeek,
  format,
  subWeeks,
  subMonths,
  addDays,
  isBefore,
  isAfter,
  isSameDay,
  startOfMonth
} from "date-fns";

// redux
import { useSelector, useDispatch } from "react-redux";

// services

// libraries
import datetimeLibrary from "../../library/datetimeLibrary";

const hourInDay = [];
const minuteInHour = [];
const dayInMonths = [];
const colorEqualNow = "green";
const colorNotEqualNow = "black";
const MAX_DAY_FROM_NOW = 30;

function pushDataToHourInDay() {
  for (let i = 0; i < 24; i++) {
    hourInDay.push({
      label: i.toString(),
      value: i,
      itemColor: colorNotEqualNow
    });
  }
}

// function push data to minuteInHour
function pushDataToMinuteInHour() {
  for (let i = 0; i < 60; i++) {
    minuteInHour.push({
      label: i.toString(),
      value: i,
      itemColor: colorNotEqualNow
    });
  }
}

// function push data to dayInMonths
function pushDataToDayInMonths() {
  for (let i = MAX_DAY_FROM_NOW; i >= 0; i--) {
    dayInMonths.push({
      label: datetimeLibrary.getDayDateByNumDay(i).dayStr,
      value: datetimeLibrary.getDayDateByNumDay(i).day,
      itemColor: colorNotEqualNow,
      day: datetimeLibrary.getDayDateByNumDay(i).day,
      month: datetimeLibrary.getDayDateByNumDay(i).month
    });
  }
  // make last item has color green
  dayInMonths[dayInMonths.length - 1].itemColor = colorEqualNow;
}

if (hourInDay.length === 0) {
  pushDataToHourInDay();
}

if (minuteInHour.length === 0) {
  pushDataToMinuteInHour();
}

if (dayInMonths.length === 0) {
  pushDataToDayInMonths();
}

const NewModalDateTimePicker = ({ selected, callback }) => {
  const isFocused = useIsFocused();

  const fontSizeScrollTime = 20;
  const fontFamilyScrollTime = "OpenSans_500Medium";

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDayInPicker, setSelectedDayInPicker] = useState(0);
  const [returnData, setReturnData] = useState({
    now: new Date(),
    hour: selected?.hour,
    minute: selected?.minute,
    day: selected?.day,
    month: selected?.month,
    year: selected?.year
  });

  // a function calculate selected date in dynamic selected picker

  useEffect(() => {
    console.log("NewModalDateTimePicker isFocused: ", isFocused);
    calculateSelectedDate();
  }, [isFocused]);

  function calculateSelectedDate() {
    // loop through dayInMonths to find selected day
    for (let i = 0; i < dayInMonths.length; i++) {
      // if same day and month
      if (
        dayInMonths[i].day === selected.day &&
        dayInMonths[i].month === selected.month
      ) {
        setSelectedDayInPicker(i);
        break;
      }
    }

    // loop through hourInDay to find selected hour
    for (let i = 0; i < hourInDay.length; i++) {
      if (hourInDay[i].value === datetimeLibrary.getDateTimeNow().hour) {
        hourInDay[i].itemColor = colorEqualNow;
        break;
      }
    }

    // loop through minuteInHour to find selected minute
    for (let i = 0; i < minuteInHour.length; i++) {
      if (minuteInHour[i].value === datetimeLibrary.getDateTimeNow().minute) {
        minuteInHour[i].itemColor = colorEqualNow;
        break;
      }
    }
  }

  function handleScrollHour(hour) {
    console.log("hour: ", hour);
    // set hour in return data
    setReturnData({
      ...returnData,
      hour: hour
    });
  }

  function handleScrollMinute(data) {
    // set minute in return data
    setReturnData({
      ...returnData,
      minute: data
    });
  }

  function handleScrollDay(data) {
    setReturnData({
      ...returnData,
      day: dayInMonths[data].day,
      month: dayInMonths[data].month
    });
  }

  function onCallback() {
    // check that selected day is before now, if true, return it, if not, return now
    callback(returnData);
  }

  // return hello world
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          onCallback();
        }}
        style={{ flex: 1, width: "100%" }}
      />
      <View style={styles.view_Center}>
        <View style={styles.viewHeader}>
          <Text style={styles.textHeader}>{"Thời gian giao dịch"}</Text>
        </View>
        {!isLoading && (
          <View style={styles.viewScrollTime}>
            <View style={styles.viewScrollHour}>
              <DynamicallySelectedPicker
                items={hourInDay}
                initialSelectedIndex={selected?.hour}
                onScroll={({ index }) => handleScrollHour(index)}
                fontSize={fontSizeScrollTime}
                fontFamily={fontFamilyScrollTime}
                selectedItemBorderColor="darkgray"
                transparentItemRows={1}
                height={150}
                width={Dimensions.get("window").width * 0.15}
                // callback={(data) => {
                //   console.log("hour: ", data);
                // }}
              />
            </View>
            <View style={styles.viewScrollMinute}>
              <DynamicallySelectedPicker
                items={minuteInHour}
                initialSelectedIndex={selected?.minute}
                onScroll={({ index }) => handleScrollMinute(index)}
                fontSize={fontSizeScrollTime}
                fontFamily={fontFamilyScrollTime}
                selectedItemBorderColor="darkgray"
                transparentItemRows={1}
                height={150}
                width={Dimensions.get("window").width * 0.15}
                // callback={(data) => {
                //   console.log("minute: ", data);
                // }}
              />
            </View>
            <View style={styles.viewScrollDay}>
              <DynamicallySelectedPicker
                items={dayInMonths}
                initialSelectedIndex={selectedDayInPicker}
                onScroll={({ index }) => handleScrollDay(index)}
                fontSize={fontSizeScrollTime}
                fontFamily={fontFamilyScrollTime}
                selectedItemBorderColor="darkgray"
                transparentItemRows={1}
                height={150}
                width={Dimensions.get("window").width * 0.55}
                // callback={(data) => {
                //   console.log("day: ", data);
                // }}

              />
            </View>
          </View>
        )}
      </View>
      <Pressable
        onPress={() => {
          onCallback();
        }}
        style={{ flex: 1, width: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view_Center: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  viewScrollHour: {
    // backgroundColor: "green",
    // borderWidth: 1,
    // borderColor: "red",
    // borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
  },
  viewScrollDay: {
    // backgroundColor: "green",
    // borderWidth: 1,
    // borderColor: "blue"
    // width: "50%"
  },
  viewScrollMinute: {
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
  },
  viewScrollTime: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 10,
    width: "100%"
    // borderWidth: 1,
    // borderColor: "green"
    // width: "80%",
  },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5
  },
  textHeader: {
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium",
    color: "black"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    // borderWidth: 1,
    // borderColor: "red"
  }
});

export default NewModalDateTimePicker;

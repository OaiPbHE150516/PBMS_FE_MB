import React, { useState, useEffect, useRef, Component } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { Calendar, CalendarList, LocaleConfig } from "react-native-calendars";
import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";
import { useSelector, useDispatch } from "react-redux";
import datetimeLibrary from "../../library/datetimeLibrary";
import {
  startOfWeek,
  endOfWeek,
  format,
  subWeeks,
  addDays,
  isBefore,
  isAfter,
  isSameDay
} from "date-fns";

import { setAddTransactionTime } from "../../redux/transactionSlice";

const hourInDay = [];
const minuteInHour = [];
const dayInMonths = [];

function pushDataForDayInMonths() {
  const timeThisMonth = datetimeLibrary.getTimeThisMonthToNow();
  for (let i = 1; i < timeThisMonth[0].length; i++) {
    dayInMonths.push({
      value: i,
      label: timeThisMonth[0][i].datestr,
      itemColor: "black",
      data: timeThisMonth[0][i].data
    });
  }
  dayInMonths[dayInMonths.length - 1].itemColor = "green";
}
function pushDataForHourInDay() {
  const rawHourInDay = [];
  for (let i = 0; i < 24; i++) {
    if (i === new Date().getHours() + 1) break;
    let hour = i < 10 ? "0" + i : i;
    rawHourInDay.push({
      value: hour,
      label: hour + "",
      itemColor: "black"
    });
  }
  hourInDay.push(...rawHourInDay);
  hourInDay[hourInDay.length - 1].itemColor = "green";
}

function pushDataForMinuteInHour() {
  const rawMinuteInHour = [];
  for (let i = 0; i < 60; i++) {
    if (i === new Date().getMinutes() + 1) break;
    let minute = i < 10 ? "0" + i : i;
    rawMinuteInHour.push({
      value: minute,
      label: minute + "",
      itemColor: "black"
    });
  }
  minuteInHour.push(...rawMinuteInHour);
  minuteInHour[minuteInHour.length - 1].itemColor = "green";
}

export function ModalCalendarComponent({ onDataFromChild }) {
  const fontSizeScrollTime = 20;
  const fontFamilyScrollTime = "OpenSans_500Medium";

  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const addTransactionTime = useSelector(
    (state) => state.transaction.addTransactionTime
  );

  const dispatch = useDispatch();

  function handleScrollHour(index) {
    setSelectedHour(index);
  }

  function handleScrollMinute(index) {
    setSelectedMinute(index);
  }

  function handleScrollDay(index) {
    setSelectedDay(index);
  }

  function handleContinue() {
    dispatch(
      setAddTransactionTime({
        hour: hourInDay[selectedHour].label,
        hourIndex: selectedHour,
        minute: minuteInHour[selectedMinute].label,
        minuteIndex: selectedMinute,
        date: dayInMonths[selectedDay].label,
        dateIndex: selectedDay,
        datetime:
          dayInMonths[selectedDay].data +
          "T" +
          hourInDay[selectedHour].label +
          ":" +
          minuteInHour[selectedMinute].label +
          ":00.000Z"
      })
    );
    onDataFromChild({
      isCalendarVisible: false
    });
  }

  function handleCancel() {
    dispatch(setAddTransactionTime(null));
    onDataFromChild({
      isCalendarVisible: false
    });
  }

  if (dayInMonths.length === 0) {
    pushDataForDayInMonths();
  }

  if (hourInDay.length === 0) {
    pushDataForHourInDay();
  }

  if (minuteInHour.length === 0) {
    pushDataForMinuteInHour();
  }

  useEffect(() => {
    if (addTransactionTime === null) {
      setSelectedHour(hourInDay.length - 1);
      setSelectedMinute(minuteInHour.length - 1);
      setSelectedDay(dayInMonths.length - 1);
    } else {
      setSelectedHour(addTransactionTime.hourIndex);
      setSelectedMinute(addTransactionTime.minuteIndex);
      setSelectedDay(addTransactionTime.dateIndex);
    }
  }, []);

  return (
    <View style={styles.viewParent}>
      <View style={styles.viewHeader}>
        <Text style={styles.textHeader}>Thời gian giao dịch</Text>
      </View>
      <View style={styles.viewScrollTime}>
        <View style={styles.viewScrollHour}>
          <DynamicallySelectedPicker
            items={hourInDay}
            onScroll={({ index }) => handleScrollHour(index)}
            onMomentumScrollBegin={({ index }) => handleScrollHour(index)}
            onMomentumScrollEnd={({ index }) => handleScrollHour(index)}
            onScrollBeginDrag={({ index }) => handleScrollHour(index)}
            onScrollEndDrag={({ index }) => handleScrollHour(index)}
            initialSelectedIndex={selectedHour}
            height={150}
            width={Dimensions.get("window").width * 0.15}
            fontSize={fontSizeScrollTime}
            fontFamily={fontFamilyScrollTime}
            selectedItemBorderColor="darkgray"
            transparentItemRows={1}
          />
        </View>
        <View style={styles.viewScrollMinute}>
          <DynamicallySelectedPicker
            items={minuteInHour}
            onScroll={({ index }) => handleScrollMinute(index)}
            onMomentumScrollBegin={({ index }) => handleScrollMinute(index)}
            onMomentumScrollEnd={({ index }) => handleScrollMinute(index)}
            onScrollBeginDrag={({ index }) => handleScrollMinute(index)}
            onScrollEndDrag={({ index }) => handleScrollMinute(index)}
            initialSelectedIndex={selectedMinute}
            height={150}
            width={Dimensions.get("window").width * 0.15}
            fontSize={fontSizeScrollTime}
            fontFamily={fontFamilyScrollTime}
            selectedItemBorderColor="darkgray"
            transparentItemRows={1}
          />
        </View>
        <View style={styles.viewScrollDay}>
          <DynamicallySelectedPicker
            items={dayInMonths}
            onScroll={({ index }) => handleScrollDay(index)}
            onMomentumScrollBegin={({ index }) => handleScrollDay(index)}
            onMomentumScrollEnd={({ index }) => handleScrollDay(index)}
            onScrollBeginDrag={({ index }) => handleScrollDay(index)}
            onScrollEndDrag={({ index }) => handleScrollDay(index)}
            initialSelectedIndex={selectedDay}
            height={150}
            width={Dimensions.get("window").width * 0.55}
            fontSize={fontSizeScrollTime}
            fontFamily={fontFamilyScrollTime}
            selectedItemBorderColor="darkgray"
            scrollEnabled={true}
            transparentItemRows={1}
          />
        </View>
      </View>
      <View style={styles.viewActionModal}>
        <Pressable
          style={[styles.buttonCloseModal, styles.buttonActionModal]}
          onPress={() => {
            handleCancel();
          }}
        >
          <Text style={styles.textButtonCloseModal}>{"< Hủy"}</Text>
        </Pressable>
        <Pressable
          style={[styles.buttonContinueModal, styles.buttonActionModal]}
          onPress={() => {
            handleContinue();
          }}
        >
          <Text style={styles.textButtonCloseModal}>{"Tiếp tục >"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  viewActionModal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 5,
    marginVertical: 10
  },
  buttonActionModal: {
    // backgroundColor: "lightblue",
    borderWidth: 1,
    borderColor: "darkgray",
    height: 40,
    width: "40%",
    marginHorizontal: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContinueModal: {
    backgroundColor: "lightblue"
  },
  buttonCloseModal: {
    backgroundColor: "white"
  },
  textButtonCloseModal: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inconsolata_500Medium"
  },
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
    fontSize: 25,
    fontFamily: "Inconsolata_500Medium",
    color: "black"
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
  },
  viewScrollMinute: {
    // backgroundColor: "green",
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
  },
  viewScrollTime: {
    // flex: 1,
    // backgroundColor: "yellow",
    // borderWidth: 1,
    // borderColor: "blue",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 10
    // width: "80%",
  },
  viewParent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  viewCalendar: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "darkgray"
    // margin: 5,
  }
});

// LocaleConfig.locales["vi"] = {
//   monthNames: [
//     "Tháng 1",
//     "Tháng 2",
//     "Tháng 3",
//     "Tháng 4",
//     "Tháng 5",
//     "Tháng 6",
//     "Tháng 7",
//     "Tháng 8",
//     "Tháng 9",
//     "Tháng 10",
//     "Tháng 11",
//     "Tháng 12"
//   ],
//   monthNamesShort: [
//     "Th.1",
//     "Th.2",
//     "Th.3",
//     "Th.4",
//     "Th.5",
//     "Th.6",
//     "Th.7",
//     "Th.8",
//     "Th.9",
//     "Th.10",
//     "Th.11",
//     "Th.12"
//   ],
//   dayNames: [
//     "Chủ nhật",
//     "Thứ hai",
//     "Thứ ba",
//     "Thứ tư",
//     "Thứ năm",
//     "Thứ sáu",
//     "Thứ bảy"
//   ],
//   dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
//   today: "Hôm nay"
// };
// LocaleConfig.defaultLocale = "vi";

{
  /* <View>
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
      </View> */
}

{
  /* <View style={styles.viewTimePresent}>
        <Text style={styles.textTimePresent}>
          Chọn giờ: {selectedHour} : {selectedMinute}
        </Text>
        <Text style={styles.textTimePresent}>
          {dayInMonths[selectedDay]?.label}
          {dayInMonths[selectedDay]?.data}
        </Text>
      </View> */
}

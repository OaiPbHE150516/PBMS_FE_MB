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
  startOfMonth,
  addHours
} from "date-fns";

const datetimeLibrary = {
  getCurrentDate: function () {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-GB");
  },

  getStartOfWeek: function () {
    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    return startOfWeek.toLocaleDateString("en-GB");
  },

  getEndOfWeek: function () {
    const currentDate = new Date();
    const endOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6)
    );
    return endOfWeek.toLocaleDateString("en-GB");
  },

  getTimeThisWeek: function () {
    const currentDate = new Date();
    var startdate = addDays(startOfWeek(currentDate), 1);
    var enddate = addDays(endOfWeek(currentDate), 1);
    return [
      startdate,
      enddate,
      format(startdate, "dd-MM-yyyy") + "/" + format(enddate, "dd-MM-yyyy"),
      format(startdate, "dd/MM") + " - " + format(enddate, "dd/MM")
    ];
  },

  getTimeThisWeekToNow: function () {
    const currentDate = new Date();
    var startdate = addDays(startOfWeek(currentDate), 1);
    var enddate = currentDate;
    return [
      startdate,
      enddate,
      format(startdate, "dd-MM-yyyy") + "/" + format(enddate, "dd-MM-yyyy"),
      format(startdate, "dd/MM") + " - " + format(enddate, "dd/MM")
    ];
  },

  // get time of the last week
  // getTimeLastWeek: function () {
  //   const currentDate = new Date();
  // },

  // get time of the last 2 weeks
  getTimeLastWeek: function () {
    const currentDate = new Date();
    const startdate = addDays(startOfWeek(subWeeks(currentDate, 1)), 1);
    const enddate = addDays(endOfWeek(subWeeks(currentDate, 1)), 1);
    return [
      startdate,
      enddate,
      format(startdate, "dd-MM-yyyy") + "/" + format(enddate, "dd-MM-yyyy"),
      format(startdate, "dd/MM") + " - " + format(enddate, "dd/MM")
    ];
  },

  getTimeWeekBefore: function (numWeek) {
    const currentDate = addHours(new Date(), 7);
    // if currentDate is Sunday, then numWeek += 1
    if (currentDate.getDay() === 0) {
      numWeek += 1;
    }
    const startdate = addDays(startOfWeek(subWeeks(currentDate, numWeek)), 1);
    const enddate = addDays(endOfWeek(subWeeks(currentDate, numWeek)), 1);
    const startDateStr000 = format(startdate, "yyyy-MM-dd") + "T00:00:00.000Z";
    const endDateStr000 = format(enddate, "yyyy-MM-dd") + "T23:59:59.000Z";
    return [
      startdate,
      enddate,
      format(startdate, "dd-MM-yyyy") + "/" + format(enddate, "dd-MM-yyyy"),
      format(startdate, "dd/MM") + " - " + format(enddate, "dd/MM"),
      startDateStr000,
      endDateStr000
    ];
  },

  compareTwoDates: function (date1, date2) {
    return isBefore(date1, date2);
  },

  isSameTime: function (date1, date2) {
    return isSameDay(date1, date2);
  },

  getCurrentDay: function () {
    const currentDate = new Date();
    return currentDate.getDate();
  },

  // get from firtst day of the month to current day
  getTimeThisMonth: function () {
    const currentDate = new Date();
    const startdate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const enddate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const array = [{}];
    // push data for array, from startdate to enddate, format dd/MM
    let currentDate2 = new Date(startdate);
    while (currentDate2 <= enddate) {
      let datestr = isSameDay(currentDate2, currentDate)
        ? "currentday"
        : format(currentDate2, "dd/MM");
      array.push({ datestr });
      currentDate2 = addDays(currentDate2, 1);
    }
    return [
      startdate,
      enddate,
      format(startdate, "dd-MM-yyyy") + "/" + format(enddate, "dd-MM-yyyy"),
      format(startdate, "dd/MM") + " - " + format(enddate, "dd/MM"),
      array
    ];
  },

  // get from firtst day of the month to current day
  getTimeThisMonthToNow: function () {
    const currentDate = new Date();
    const startdate = startOfMonth(subMonths(currentDate, 2));
    const enddate = currentDate;
    const array = [{}];
    let currentDate2 = new Date(startdate);
    while (currentDate2 <= enddate) {
      array.push({
        datestr: this.getDayInWeek(currentDate2),
        data: format(currentDate2, "yyyy-MM-dd").toString()
      });
      currentDate2 = addDays(currentDate2, 1);
    }
    return [array];
  },

  // get day in week of the date input
  getDayInWeek: function (date) {
    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy"
    ];
    const result = daysOfWeek[date.getDay()] || "Lỗi";
    return result + " " + format(date, "dd") + " tháng " + format(date, "MM");
  },

  // get hour in day from start time in today to curent time, return array of time
  getTimeInDayToNow: function () {
    const currentDate = new Date();
    const array = [{}];
    // use while loop
    let currenthour = 0;
    while (currenthour <= currentDate.getHours()) {
      let hourstr = currenthour < 10 ? "0" + currenthour : currenthour;
      array.push({ hourstr });
      currenthour++;
    }
    return [array];
  },

  // get current time, return array [hour, minute, day, month, year]
  getCurrentTime: function () {
    const currentDate = new Date();
    // return [
    //   currentDate.getHours(),
    //   currentDate.getMinutes(),
    //   currentDate.getDate(),
    //   currentDate.getMonth() + 1,
    //   currentDate.getFullYear()
    // ];
    return {
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      datetimedata:
        format(currentDate, "yyyy-MM-dd") +
        "T" +
        format(currentDate, "HH:mm") +
        ":00.000Z",
      datetimestr:
        format(currentDate, "HH:mm") + ", " + this.getDayInWeek(currentDate)
    };
  },

  // get currenttime in string format, like 'yyyyMMDDHHmmss'
  getCurrentTimeStr: function () {
    const currentDate = new Date();
    return (
      currentDate.getFullYear() +
      "" +
      (currentDate.getMonth() + 1) +
      "" +
      currentDate.getDate() +
      "" +
      currentDate.getHours() +
      "" +
      currentDate.getMinutes() +
      "" +
      currentDate.getSeconds()
    );
  },

  // get start day and end day of the month by adding numMonth to current month
  getTimeThisMonthByNumMonth: function (numMonth) {
    const currentDate = addHours(new Date(), 7);
    const startdate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - numMonth,
      1
    );
    const enddate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - numMonth + 1,
      0
    );
    const resultMonthStr = "tháng " + format(startdate, "MM");
    const startDateStr000 = format(startdate, "yyyy-MM-dd") + "T00:00:00.000Z";
    const endDateStr000 = format(enddate, "yyyy-MM-dd") + "T23:59:59.000Z";
    return [
      startdate,
      enddate,
      format(startdate, "dd-MM-yyyy") + "/" + format(enddate, "dd-MM-yyyy"),
      format(startdate, "dd/MM") + " - " + format(enddate, "dd/MM"),
      resultMonthStr,
      startDateStr000,
      endDateStr000
    ];
  },

  // get datetime now, local time
  getDateTimeNow: function () {
    const currentDate = new Date();
    return {
      now: currentDate,
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      date: format(currentDate, "yyyy-MM-dd"),
      time: format(currentDate, "HH:mm:ss"),
      datetime:
        format(currentDate, "yyyy-MM-dd") +
        "T" +
        format(currentDate, "HH:mm") +
        ":00.000Z",
      datetimestr:
        format(currentDate, "HH:mm") + ", " + this.getDayInWeek(currentDate)
    };
  },

  // get number day in month
  getNumberDayInMonth: function (month, year) {
    return new Date(year, month, 0).getDate();
  },

  // get number day in month from begin to current day
  getNumberDayInMonthToCurrentDay: function (month, year) {
    const currentDate = new Date();
    return currentDate.getDate();
  },

  // get daydate by day in month, like 'Thứ Năm, 18 tháng 4'
  getDayDate: function (day, month, year) {
    const currentDate = new Date(year, month - 1, day);
    return this.getDayInWeek(currentDate);
  },

  // get daydate by day in month, like 'Thứ Năm, 18 tháng 4' by num day from now
  getDayDateByNumDay: function (numDay) {
    const currentDate = new Date();
    const day = addDays(currentDate, numDay * -1);
    return {
      day: day.getDate(),
      month: day.getMonth() + 1,
      dayStr: this.getDayInWeek(day)
    };
  },

  // convert hour, minute, day, month, year to datetime string, like 'HH: mm" + ", " + "dd/MM/yyyy'
  convertToDateTimeStr: function (hour, minute, day, month, year) {
    month -= 1;
    return (
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (minute < 10 ? "0" + minute : minute) +
      ", " +
      this.getDayInWeek(new Date(year, month, day))
    );
  },

  // convert "HH:mm:ss" to ss number like "00:00:22.1417193" to 22s
  convertToSecond: function (timeStr) {
    const timeArray = timeStr.split(":");
    return parseInt(timeArray[2]).toString() + "s";
  },

  // get time this moment, like '2024-04-18T22:02:00.000Z'
  getTimeStrThisMoment: function () {
    const currentDate = new Date();
    return format(currentDate, "yyyy-MM-dd") + "T" + format(currentDate, "HH:mm") + ":00.000Z";
  },

  // convert dateonly to day / month, like '2024-04-18' to '18/04',
  convertDateToDayMonth: function (dateStr) {
    const dateArray = dateStr.split("-");
    return dateArray[2] + "/" + dateArray[1];
  },

};

export default datetimeLibrary;

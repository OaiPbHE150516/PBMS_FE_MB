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
    const currentDate = new Date();
    const startdate = addDays(startOfWeek(subWeeks(currentDate, numWeek)), 1);
    const enddate = addDays(endOfWeek(subWeeks(currentDate, numWeek)), 1);
    return [
      startdate,
      enddate,
      format(startdate, "dd-MM-yyyy") + "/" + format(enddate, "dd-MM-yyyy"),
      format(startdate, "dd/MM") + " - " + format(enddate, "dd/MM")
    ];
  },

  // compare two dates
  compareTwoDates: function (date1, date2) {
    return isBefore(date1, date2);
  },

  isSameTime: function (date1, date2) {
    return isSameDay(date1, date2);
  },

  // get current day, only day
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
  }
};

export default datetimeLibrary;

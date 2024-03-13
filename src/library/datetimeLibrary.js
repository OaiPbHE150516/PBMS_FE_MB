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
  }
};

export default datetimeLibrary;

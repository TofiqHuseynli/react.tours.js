// import Lang from "fogito-core-ui/build/library/Lang";

// export default class DateLib {
//   // static months = [
//   //     Lang.get('January3'),
//   //     Lang.get('February3'),
//   //     Lang.get('March3'),
//   //     Lang.get('April3'),
//   //     Lang.get('May3'),
//   //     Lang.get('June3'),
//   //     Lang.get('July3'),
//   //     Lang.get('August3'),
//   //     Lang.get('September3'),
//   //     Lang.get('October3'),
//   //     Lang.get('November3'),
//   //     Lang.get('December3'),
//   // ];

//   static value = new Date();

//   static resetValue() {
//     DateLib.value = new Date();
//   }

//   static setValue(date = false) {
//     if (typeof date === "string") {
//       DateLib.value = new Date(...DateLib.getParsedDate(date));
//     } else if (typeof date === "number") {
//       DateLib.value = new Date(date * 1000);
//     }
//     return this;
//   }

//   static getParsedDate(date) {
//     let dateArr = String(date).split(" ");
//     dateArr = dateArr.length > 1 ? dateArr : String(date).split("T");
//     var days = String(dateArr[0]).split("-");
//     var hours = String(dateArr[1]).split(":");
//     if (dateArr.length === 2) {
//       return [
//         parseInt(days[0]),
//         parseInt(days[1]) - 1,
//         parseInt(days[2]),
//         parseInt(hours[0] || 0),
//         parseInt(hours[1] || 0),
//         parseInt(hours[2] || 0),
//       ];
//     } else {
//       return [
//         parseInt(days[0]),
//         parseInt(days[1]) - 1,
//         parseInt(days[2]),
//         "00",
//         "00",
//         "00",
//       ];
//     }
//   }

//   static getUnix() {
//     let date = Math.floor(DateLib.value / 1000);
//     DateLib.resetValue();
//     return date;
//   }

//   static format(format = "Y-m-d H:i:s") {
//     let date = DateLib.value;
//     if (date < 1) date = new Date();
//     let d = date.getDate();
//     if (d < 10) d = "0" + d;
//     let m = date.getMonth() + 1; //January is 0!
//     if (m < 10) m = "0" + m;
//     let Y = date.getFullYear();
//     let H = date.getHours();
//     if (H < 10) H = "0" + H;
//     let i = date.getMinutes();
//     if (i < 10) i = "0" + i;
//     let s = date.getSeconds();
//     if (s < 10) s = "0" + s;

//     let months = DateLib.getShortMonth();
//     let replaceWith = [
//       ["Y", Y],
//       ["m", m],
//       ["M", months[parseInt(m) - 1]],
//       ["w", date.getDay()],
//       ["W", 0],
//       ["d", d],
//       ["H", H],
//       ["i", i],
//       ["s", s],
//     ];
//     for (let key in replaceWith) {
//       let [find, replace] = replaceWith[key];
//       format = format.replace(find, replace);
//     }

//     DateLib.resetValue();
//     return format;
//   }

//   static weekday(n) {
//     let date = DateLib.value;
//     let currentDay = DateLib.value.getDay();
//     let distance = n - currentDay;
//     date.setDate(date.getDate() + distance);
//     return this;
//   }

//   static startOf(type) {
//     let date = DateLib.value;

//     switch (type) {
//       case "day":
//         DateLib.value.setHours(0, 0, 0, 0);
//         break;
//       case "week":
//         DateLib.value = DateLib.setToMonday(DateLib.value).setHours(0, 0, 0, 0);
//         break;
//       case "month":
//         DateLib.value = new Date(date.getFullYear(), date.getMonth(), 1);
//         // DateLib.value = new Date(date.getFullYear(), date.getMonth(), 1,date.getHours(),date.getMinutes(),date.getSeconds());
//         break;
//       case "year":
//         DateLib.value = new Date(date.getFullYear(), 0, 1);
//         break;
//     }
//     return this;
//   }

//   static endOf(type) {
//     let date = DateLib.value;

//     switch (type) {
//       case "day":
//         DateLib.value.setHours(23, 59, 59, 999);
//         break;
//       case "week":
//         DateLib.value.setDate(date.getDate() - date.getDay() + 6);
//         DateLib.value.setHours(23, 59, 59, 999);
//         break;
//       case "isoWeek":
//         DateLib.value.setDate(date.getDate() - date.getDay() + 7);
//         DateLib.value.setHours(23, 59, 59, 999);
//         break;
//       case "month":
//         DateLib.value = new Date(
//           date.getFullYear(),
//           date.getMonth() + 1,
//           0,
//           23,
//           59,
//           59,
//           999
//         );
//         // DateLib.value = new Date(date.getFullYear(), date.getMonth(), 1,date.getHours(),date.getMinutes(),date.getSeconds());
//         break;
//       case "year":
//         DateLib.value = new Date(date.getFullYear(), 11, 31);
//         break;
//     }
//     return this;
//   }

//   static add(amount, type) {
//     let date = DateLib.value;

//     switch (type) {
//       case "day":
//         DateLib.value.setDate(date.getDate() + amount);
//         break;
//       case "week":
//         DateLib.value.setDate(date.getDate() + amount * 7);
//         break;
//       case "month":
//         DateLib.addMonths(DateLib.value, amount);
//         break;
//       case "year":
//         DateLib.addYear(DateLib.value, amount);
//         break;
//     }
//     return this;
//   }

//   static subtract(amount, type) {
//     let date = DateLib.value;

//     switch (type) {
//       case "day":
//         DateLib.value.setDate(date.getDate() - amount);
//         break;
//       case "week":
//         DateLib.value.setDate(date.getDate() - amount * 7);
//         break;
//       case "month":
//         break;
//       case "year":
//         break;
//     }
//     return this;
//   }

//   static set(type, value) {
//     switch (type) {
//       case "minutes":
//         DateLib.value.setMinutes(value);
//         break;
//       case "hours":
//         DateLib.value.setHours(value);
//         break;
//       case "date":
//         DateLib.value.setDate(value);
//         break;
//       case "month":
//         DateLib.value.setMonth(value);
//         break;
//       case "year":
//         DateLib.value.setFullYear(value);
//         break;
//     }
//     return this;
//   }

//   //HELPER METHODS START

//   static addMonths(date, months) {
//     let d = date.getDate();
//     date.setMonth(date.getMonth() + months);
//     if (date.getDate() !== d) {
//       date.setDate(0);
//     }
//     return date;
//   }

//   static addYear(date, months) {
//     let d = date.getDate();
//     date.setFullYear(date.getFullYear() + months);
//     if (date.getDate() !== d) {
//       date.setDate(0);
//     }
//     return date;
//   }

//   static setToMonday(date) {
//     let day = date.getDay() || 7;
//     if (day !== 1) date.setHours(-24 * (day - 1));
//     return date;
//   }

//   //HELPER METHODS END

//   static getWeeks() {
//     return [
//       { value: 1, title: Lang.get("Monday") },
//       { value: 2, title: Lang.get("Tuesday") },
//       { value: 3, title: Lang.get("Wednesday") },
//       { value: 4, title: Lang.get("Thursday") },
//       { value: 5, title: Lang.get("Friday") },
//       { value: 6, title: Lang.get("Saturday") },
//       { value: 7, title: Lang.get("Sunday") },
//     ];
//   }

//   static getShortWeeks() {
//     return [
//       { value: 1, title: Lang.get("MondayShort") },
//       { value: 2, title: Lang.get("TuesdayShort") },
//       { value: 3, title: Lang.get("WednesdayShort") },
//       { value: 4, title: Lang.get("ThursdayShort") },
//       { value: 5, title: Lang.get("FridayShort") },
//       { value: 6, title: Lang.get("SaturdayShort") },
//       { value: 7, title: Lang.get("SundayShort") },
//     ];
//   }

//   static getMonths() {
//     return [
//       { value: 1, title: Lang.get("January") },
//       { value: 2, title: Lang.get("February") },
//       { value: 3, title: Lang.get("March") },
//       { value: 4, title: Lang.get("April") },
//       { value: 5, title: Lang.get("May") },
//       { value: 6, title: Lang.get("June") },
//       { value: 7, title: Lang.get("July") },
//       { value: 8, title: Lang.get("August") },
//       { value: 9, title: Lang.get("September") },
//       { value: 10, title: Lang.get("October") },
//       { value: 11, title: Lang.get("November") },
//       { value: 12, title: Lang.get("December") },
//     ];
//   }

//   static getShortMonth() {
//     return [
//       Lang.get("January3"),
//       Lang.get("February3"),
//       Lang.get("March3"),
//       Lang.get("April3"),
//       Lang.get("May3"),
//       Lang.get("June3"),
//       Lang.get("July3"),
//       Lang.get("August3"),
//       Lang.get("September3"),
//       Lang.get("October3"),
//       Lang.get("November3"),
//       Lang.get("December3"),
//     ];
//   }

//   static getWeek(id) {
//     return DateLib.getWeeks()[id - 1];
//   }

//   static getMonth(id) {
//     return DateLib.getMonths()[id - 1];
//   }

//   static getUnixtime() {
//     let time = new Date().getTime();
//     time = Math.floor(time / 1000);
//     return time;
//   }

//   // Convert unixtime to date format
//   static date(format = "Y-m-d H:i:s", unixtime = 0) {
//     let date = new Date(unixtime * 1000);
//     if (unixtime < 1) date = new Date();
//     let d = date.getDate();
//     if (d < 10) d = "0" + d;
//     let m = date.getMonth() + 1; //January is 0!
//     if (m < 10) m = "0" + m;
//     let Y = date.getFullYear();
//     let H = date.getHours();
//     if (H < 10) H = "0" + H;
//     let i = date.getMinutes();
//     if (i < 10) i = "0" + i;
//     let s = date.getSeconds();
//     if (s < 10) s = "0" + s;

//     let months = DateLib.getShortMonth();
//     let replaceWith = [
//       ["Y", Y],
//       ["m", m],
//       ["M", months[parseInt(m) - 1]],
//       ["w", date.getDay()],
//       ["W", 0],
//       ["d", d],
//       ["H", H],
//       ["i", i],
//       ["s", s],
//     ];
//     for (let key in replaceWith) {
//       let [find, replace] = replaceWith[key];
//       format = format.replace(find, replace);
//     }
//     return format;
//   }

//   static getWeekNumber(unixtime = 0) {
//     let d = new Date(unixtime * 1000);
//     d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
//     let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
//     let W = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
//     return W;
//   }

//   static getWeekDay(unixtime = 0, type) {
//     let W = parseInt(DateLib.date("w", unixtime - 86400));
//     if (type === "short") {
//       W = DateLib.getShortWeeks()[W].title;
//     }
//     // W = DateLib.getWeeks()[W].title
//     return W.toString();
//   }

//   static toTimestamp(strDate) {
//     if (typeof strDate === "string") strDate = strDate.replace(/-/gi, "/");
//     let datum = Date.parse(strDate);
//     return datum / 1000;
//   }

//   // Calculate time elapse from current time
//   static elapse(unixtime) {
//     let time = new Date().getTime();
//     time = Math.floor(time / 1000);
//     let elapse = time - unixtime;
//     if (elapse < 0) elapse = 0;

//     let { d, h, m, s } = DateLib.parseElapse(elapse);

//     return {
//       d: d < 10 ? "0" + d : d,
//       h: h < 10 ? "0" + h : h,
//       m: m < 10 ? "0" + m : m,
//       s: s < 10 ? "0" + s : s,
//     };
//   }

//   static parseElapse(elapse) {
//     let d = Math.floor(elapse / 86400);
//     let h = Math.floor((elapse - d * 86400) / 3600);
//     let m = Math.floor((elapse - d * 86400 - h * 3600) / 60);
//     let s = elapse - d * 86400 - h * 3600 - m * 60;
//     return { d, h, m, s };
//   }

//   static convertSeconds(elapse) {
//     let txt = "";
//     let { d, h, m, s } = DateLib.parseElapse(elapse);
//     if (d > 0) txt += Lang.get("DayShort").replace("{day}", ` ${d} `);
//     if (h > 0) txt += Lang.get("HourShort").replace("{hour}", ` ${h} `);
//     if (m > 0 && (h === 0 || d === 0))
//       txt += Lang.get("MinuteShort").replace("{minute}", ` ${m} `);
//     if (!m && !h && !d)
//       !s
//         ? (txt += 0 + "")
//         : (txt += Lang.get("SecondShort").replace("{second}", ` ${s} `));

//     return txt;
//   }

//   static filterTime(unixtime) {
//     let txt = "";
//     if (!unixtime) {
//       txt = Lang.get("Now");
//     } else {
//       let currentUnixtime = DateLib.getUnixtime();
//       let dif = currentUnixtime - unixtime;
//       if (
//         DateLib.date("Y-m-d", currentUnixtime) ===
//         DateLib.date("Y-m-d", unixtime)
//       ) {
//         txt = Lang.get("Today") + " " + DateLib.date("H:i", unixtime);
//       } else if (
//         DateLib.date("Y-m-d", currentUnixtime - 86400) ===
//         DateLib.date("Y-m-d", unixtime)
//       ) {
//         txt = Lang.get("Yesterday") + " " + DateLib.date("H:i", unixtime);
//       } else if (
//         DateLib.date("Y", currentUnixtime - 86400) !==
//         DateLib.date("Y", unixtime)
//       ) {
//         txt = DateLib.date("d M, Y", unixtime);
//       } else if (dif / 86400 > 1) {
//         txt = DateLib.date("d M", unixtime);
//       }
//     }
//     return txt;
//   }
// }

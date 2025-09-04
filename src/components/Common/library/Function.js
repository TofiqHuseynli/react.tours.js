// import { API_ROUTES } from "@config";
// import { Api, Lang, useToast } from "fogito-core-ui";
// import { FrameLink } from "@components";
// import reactStringReplace from "react-string-replace";
// import React from "react";
// import { Link } from "react-router-dom";

// export const serialize = (obj, prefix) => {
//   let str = [];
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       let keyName = prefix ? `${prefix}[${key}]` : key;
//       let value = obj[key];
//       str.push(
//         typeof value === "object"
//           ? serialize(value, keyName)
//           : `${encodeURIComponent(keyName)}=${encodeURIComponent(value)}`
//       );
//     }
//   }
//   return str.join("&");
// };

// export const inArray = (id, array) => {
//   return array.find((key) => key === id) ? true : false;
// };

// export function genUuid() {
//   var chars = "0123456789abcdef".split("");

//   var uuid = [],
//     rnd = Math.random,
//     r;
//   uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
//   uuid[14] = "4"; // version 4

//   for (var i = 0; i < 36; i++) {
//     if (!uuid[i]) {
//       r = 0 | (rnd() * 16);

//       uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r & 0xf];
//     }
//   }

//   return uuid.join("");
// }

// export const getTimeBySeconds = () => Math.floor(new Date().getTime() / 1000);

// export function getCurrencySymbol(currencyCode) {
//   currencyCode = currencyCode.toLowerCase();
//   let symbol = "";
//   switch (currencyCode) {
//     case "azn":
//       symbol = "₼";
//       break;
//     case "dkk":
//       symbol = "kr.";
//       break;
//     case "eur":
//       symbol = "€";
//       break;
//     case "usd":
//       symbol = "$";
//       break;
//   }

//   return symbol;
// }

// export const prepareInvoicePayLink = (setting) => {
//   let type = setting.type.toLowerCase();

//   let urlParams =
//     "?company=" + setting.id + "&type=" + type + "&callback=" + location.href;

//   let gatewayAuthorizeUrl = Api.convert(API_ROUTES.gatewayAuthorize, true);

//   return gatewayAuthorizeUrl + urlParams;
// };

// export const is = (target, selector) => {
//   return selector === target || target.contains(selector);
// };

// export const isEqual = (first_array = [], second_array = []) => {
//   let result = true;
//   if (first_array.length && second_array.length) {
//     if (first_array.length === second_array.length) {
//       first_array.map((item, key) => {
//         if (item !== second_array[key]) {
//           result = false;
//         }
//       });
//     } else {
//       result = false;
//     }
//   } else {
//     result = false;
//   }
//   return result;
// };

// export const copyToClipBoard = async (copyMe) => {
//   const toast = useToast();

//   try {
//     await navigator.clipboard.writeText(copyMe);
//     toast.fire({ icon: "success", title: Lang.get("CopiedToClipboard") });
//   } catch (err) {
//     toast.fire({ icon: "success", title: Lang.get("FailedToCopy") });
//   }
// };

// export const prepareActivityText = (activity) => {
//   let text = activity.description;
//   if (text) {
//     let element = activity.replacements?.find(
//       (x) => x.key === "journal" || x.key === "invoice"
//     );

//     let ownerId = activity.user?.id;
//     let elementId = element["id"];
//     if (ownerId) {
//       let profileLink = (
//         <FrameLink
//           key={ownerId}
//           to={`/profile/${ownerId}`}
//           target="blank"
//           native
//           className="text-primary-alternative"
//         >
//           {activity.user?.fullname}
//         </FrameLink>
//       );
//       text = reactStringReplace(text, "{who}", (match, i) => profileLink);
//     }

//     if (elementId) {
//       let profileLink = (
//         <Link
//           key={elementId}
//           to={`/invoices/invoice/${elementId}`}
//           className="text-primary-alternative"
//         >
//           {/* {element["title"] ?? Lang.get(element.key)} */}
//           {element["title"]}
//         </Link>
//       );
//       text = reactStringReplace(
//         text,
//         `${element.key}`,
//         (match, i) => profileLink
//       );
//     }
//   }
//   return text;
// };

// export const tableStatusColumn = (status) => {
//   return (
//     <div className="d-flex align-items-center">
//       <span
//         style={{
//           width: 10,
//           height: 10,
//           backgroundColor: status ? "#2ECD89" : "#FDD74D",
//           borderRadius: "50%",
//           marginTop: 2,
//         }}
//       />
//       <p
//         className="text-lowercase mb-0 ml-2 fw-400 lh-20 fs-14"
//         style={{ whiteSpace: "nowrap" }}
//       >
//         {Lang.get(status ? "Active" : "inActive")}
//       </p>
//     </div>
//   );
// };

// export const printElement = (elem) => {
//   let domClone = elem.cloneNode(true);
//   let printSection = document.getElementById("printSection");
//   if (!printSection) {
//     printSection = document.createElement("div");
//     printSection.id = "printSection";
//     document.body.appendChild(printSection);
//   }
//   printSection.innerHTML = "";
//   printSection.appendChild(domClone);
//   window.print();
// };

// export const truncate = (text, length = 200) => {
//   if (text.length > length) {
//     return text.substring(0, length) + "...";
//   }
//   return text;
// };

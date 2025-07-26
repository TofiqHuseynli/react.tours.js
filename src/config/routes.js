import { Inbox } from "@layouts";
import React from "react";

export const CORE_API_URL = "/core";
export const MICROSERVICE_URL = "/mails";

export const API_ROUTES = {
  // Settings
  settings: CORE_API_URL + "/settings",
  translations: CORE_API_URL + "/settings/translations",
  coreActivitiesList: CORE_API_URL + "/activities/list",
  coreTimezonesList: CORE_API_URL + "/data/timezones",

  // Mails
  mailsList: MICROSERVICE_URL + "/mails/list",
  mailsAdd: MICROSERVICE_URL + "/mails/addmail",
  mailsDelete: MICROSERVICE_URL + "/mails/delete",
  mailsInfo: MICROSERVICE_URL + "/mails/info",
  mailList: MICROSERVICE_URL + "/mails/listmails",
  mailMessage: MICROSERVICE_URL + "/mails/singlemessage",
  mailsForward: MICROSERVICE_URL + "/mails/forward",
  mailsReply: MICROSERVICE_URL + "/mails/reply",

  // Connected
  connectedList: MICROSERVICE_URL + "/mailconnections/list",
  connectedDelete: MICROSERVICE_URL + "/mailconnections/delete",
  connectedAdd: MICROSERVICE_URL + "/mailconnections/add",
  connectedEdit: MICROSERVICE_URL + "/mailconnections/edit",
  connectedInfo: MICROSERVICE_URL + "/mailconnections/info",
  connectedConnect: MICROSERVICE_URL + "/mailconnections/connect",
};

// export const MENU_ROUTES = [
//   {
//     path: "/inbox",
//     name: "Inbox",
//     id: "inbox",
//     icon: <i className="symbol feather feather-mail text-danger" />,
//     isExact: false,
//     isHidden: false,
//     component: (props) => <Inbox {...props} type="inbox" />,
//   },
// ];

// let nestedRotues = [];
// mailAddress.map((item) => {
//   nestedRotues.push({
//     path: "/inbox",
//     name: item.email,
//     permission: "tt_statistics",
//     permission_action: "view",
//     isExact: true,
//     component: (props) => <Inbox {...props} email={item.email} />,
//   });
// });

// let MENU_ROUTES = [
//   {
//     path: "/allinbox",
//     name: "All Inbox",
//     // permission: "tt_statistics",
//     // permission_action: "view",
//     icon: <i className="symbol feather feather-mail text-danger" />,
//     isExact: false,
//     component: (props) => <Inbox {...props} />,

//     nestedRoutes: nestedRotues,
//   },
// ];

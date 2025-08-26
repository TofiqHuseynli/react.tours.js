import { Tour } from "@layouts";
import React from "react";

export const CORE_API_URL = "/core";
export const MICROSERVICE_URL = "/tours";

export const API_ROUTES = {
  // Settings
  settings: CORE_API_URL + "/settings",
  translations: CORE_API_URL + "/settings/translations",
  coreActivitiesList: CORE_API_URL + "/activities/list",
  coreTimezonesList: CORE_API_URL + "/data/timezones",

  // oauthConnect: MICROSERVICE_URL + "/mails/oauth",

  // Tour
  tourList: MICROSERVICE_URL + "/tours/list",
  // mailsAdd: MICROSERVICE_URL + "/mails/addmail",
  // mailsDelete: MICROSERVICE_URL + "/mails/delete",
  // mailsInfo: MICROSERVICE_URL + "/mails/info",
  // mailList: MICROSERVICE_URL + "/mails/listmails",
  // mailMessage: MICROSERVICE_URL + "/mails/singlemessage",
  // mailsForward: MICROSERVICE_URL + "/mails/forward",
  // mailsReply: MICROSERVICE_URL + "/mails/reply",

  // Connected
  // connectedList: MICROSERVICE_URL + "/mails/oauth/info",
  // connectedDelete: MICROSERVICE_URL + "/mailconnections/delete",
  // connectedAdd: MICROSERVICE_URL + "/mailconnections/add",
  // connectedEdit: MICROSERVICE_URL + "/mailconnections/edit",
  // connectedInfo: MICROSERVICE_URL + "/mailconnections/info",
  // connectedConnect: MICROSERVICE_URL + "/mailconnections/connect",
};

// let nestedRotues = [
//   {
//     path: "/tourprogram",
//     name: "TourProgram",
//     isExact: false,
//     component: (props) => <Inbox {...props} type="inbox" />,
//   },
//   {
//     path: "/hotel",
//     name: "Hotel",
//     isExact: false,
//     component: (props) => <Inbox {...props} type="inbox" />,
//   },
//   {
//     path: "/services",
//     name: "Services",
//     isExact: false,
//     component: (props) => <Inbox {...props} type="inbox" />,
//   },
//   {
//     path: "/cartype",
//     name: "CarType",
//     isExact: false,
//     component: (props) => <Inbox {...props} type="inbox" />,
//   },
// ];

export const MENU_ROUTES = [
  {
    path: "/tours",
    name: "Tour",
    id: "tours",
    icon: <i className="symbol feather feather-home text-danger" />,
    isExact: false,
    isHidden: false,
    component: (props) => <Tour {...props} />,
  }
  // {
  //   path: "/template",
  //   name: "Template",
  //   icon: <i className="symbol feather feather-mail text-danger" />,
  //   isExact: false,
  //   isHidden: false,
  //   nestedRoutes: nestedRotues,
  // }
];

import {
  CarType,
  Hotel,
  RoomType,
  Services,
  Tour,
  TourProgram,
} from "@layouts";
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
  tourAdd: MICROSERVICE_URL + "/tours/add",
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

  // Service

  serviceList: MICROSERVICE_URL + "/service_templates/list",
  serviceAdd: MICROSERVICE_URL + "/service_templates/add",

  //Car Type
  carTypeList: MICROSERVICE_URL + "/car_types/list",
  carTypeAdd: MICROSERVICE_URL + "/car_types/add",

  //Room Type
  roomTypeList: MICROSERVICE_URL + "/room_types/list",
  roomTypeAdd: MICROSERVICE_URL + "/room_types/add",
};

let nestedRotues = [
  // {
  //   path: "/tourprogram",
  //   name: "TourProgram",
  //   id: "offers_templates",
  //   icon: <i className="symbol feather feather-mail text-danger" />,
  //   isExact: false,
  //   component: (props) => <TourProgram {...props} type="inbox" draft={true} />,
  // },
  // {
  //   path: "/hotel",
  //   name: "Hotel",
  //   icon: <i className="symbol feather feather-mail text-danger" />,
  //   isExact: false,
  //   // component: (props) => <Inbox {...props} type="inbox" />,
  // },
  // {
  //   path: "/services",
  //   name: "Services",
  //   icon: <i className="symbol feather feather-mail text-danger" />,
  //   isExact: false,
  //   // component: (props) => <Inbox {...props} type="inbox" />,
  // },
  // {
  //   path: "/cartype",
  //   name: "CarType",
  //   icon: <i className="symbol feather feather-mail text-danger" />,
  //   isExact: false,
  //   // component: (props) => <Inbox {...props} type="inbox" />,
  // },
];

export const MENU_ROUTES = [
  {
    path: "/tours",
    name: "Tour",
    id: "tours",
    icon: <i className="symbol feather feather-home text-danger" />,
    isExact: false,
    isHidden: false,
    component: (props) => <Tour {...props} />,
  },
  {
    path: "/tourprogram",
    name: "TourProgram",
    icon: <i className="symbol feather feather-mail text-danger" />,
    id: "tours_program",
    isExact: false,
    component: (props) => <TourProgram {...props} type="inbox" draft={true} />,
  },
  {
    path: "/hotel",
    name: "Hotel",
    icon: <i className="symbol feather feather-mail text-danger" />,
    id: "tours_hotel",
    isExact: false,
    component: (props) => <Hotel {...props} type="inbox" draft={true} />,
  },
  {
    path: "/services",
    name: "Services",
    icon: <i className="symbol feather feather-mail text-danger" />,
    id: "tours_services",
    isExact: false,
    component: (props) => <Services {...props} type="inbox" draft={true} />,
  },
  {
    path: "/cartype",
    name: "CarType",
    icon: <i className="symbol feather feather-mail text-danger" />,
    id: "tours_cartype",
    isExact: false,
    component: (props) => <CarType {...props} type="inbox" draft={true} />,
  },
  {
    path: "/roomtype",
    name: "RoomType",
    icon: <i className="symbol feather feather-mail text-danger" />,
    id: "tours_roomtype",
    isExact: false,
    component: (props) => <RoomType {...props} type="inbox" draft={true} />,
  },
];

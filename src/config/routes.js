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

  //Data
  dataStatusList: MICROSERVICE_URL + "/data/status",
  dataLocationList: MICROSERVICE_URL + "/locations/search",
  dataParameters: MICROSERVICE_URL + "/data/parameters",
  timezonesList: CORE_API_URL + "/data/timezones",

  //Users
  userList: MICROSERVICE_URL + "/users/search",

  //Branches
  branchesList: MICROSERVICE_URL + "/branches/query",
  branchesAdd: MICROSERVICE_URL + "/branches/add",
  branchesDelete: MICROSERVICE_URL + "/branches/delete",

  //Task Labels
  labelsList: MICROSERVICE_URL + "/labels/list",
  labelsCheck: MICROSERVICE_URL + "/labels/check",
  labelsAdd: MICROSERVICE_URL + "/labels/add",
  labelsEdit: MICROSERVICE_URL + "/labels/edit",
  labelsDelete: MICROSERVICE_URL + "/labels/delete",
  labelsMoveLabel: MICROSERVICE_URL + "/cards/Movelabel",

  // Tour
  tourList: MICROSERVICE_URL + "/tours/list",
  tourAdd: MICROSERVICE_URL + "/tours/add",
  tourDelete: MICROSERVICE_URL + "/tours/delete",
  tourInfo: MICROSERVICE_URL + "/tours/info",
  tourEdit: MICROSERVICE_URL + "/tours/edit",

  // Tour program
  tourProgramList: MICROSERVICE_URL + "/tour_programmes/list",
  tourProgramAdd: MICROSERVICE_URL + "/tour_programmes/add",
  tourProgramDelete: MICROSERVICE_URL + "/tour_programmes/delete",
  tourProgramInfo: MICROSERVICE_URL + "/tour_programmes/info",
  tourProgramEdit: MICROSERVICE_URL + "/tour_programmes/edit",

  // Hotel
  hotelList: MICROSERVICE_URL + "/hotel_templates/list",
  hotelAdd: MICROSERVICE_URL + "/hotel_templates/add",
  hotelDelete: MICROSERVICE_URL + "/hotel_templates/delete",
  hotelInfo: MICROSERVICE_URL + "/hotel_templates/info",
  hotelEdit: MICROSERVICE_URL + "/hotel_templates/edit",

  // Service
  serviceList: MICROSERVICE_URL + "/service_templates/list",
  serviceAdd: MICROSERVICE_URL + "/service_templates/add",
  serviceDelete: MICROSERVICE_URL + "/service_templates/delete",
  serviceInfo: MICROSERVICE_URL + "/service_templates/info",
  serviceEdit: MICROSERVICE_URL + "/service_templates/edit",

  //Car Type
  carTypeList: MICROSERVICE_URL + "/car_types/list",
  carTypeAdd: MICROSERVICE_URL + "/car_types/add",
  carTypeDelete: MICROSERVICE_URL + "/car_types/delete",
  carTypeInfo: MICROSERVICE_URL + "/car_types/info",
  carTypeEdit: MICROSERVICE_URL + "/car_types/edit",

  //Room Type
  roomTypeList: MICROSERVICE_URL + "/room_types/list",
  roomTypeMinList: MICROSERVICE_URL + "/room_types/minlist",
  roomTypeAdd: MICROSERVICE_URL + "/room_types/add",
  roomTypeDelete: MICROSERVICE_URL + "/room_types/delete",
  roomTypeInfo: MICROSERVICE_URL + "/room_types/info",
  roomTypeEdit: MICROSERVICE_URL + "/room_types/edit",
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
    name: "Template",
    id: "template",
    isExact: false,
    path: "/template",
    icon: <i className="symbol feather feather-folder text-info" />,
    nestedRoutes: [
      {
        path: "/tourprogram",
        name: "TourProgram",
        icon: <i className="symbol feather feather-upload text-danger" />,
        id: "tours_program",
        isExact: false,
        component: (props) => (
          <TourProgram {...props} type="inbox" draft={true} />
        ),
      },
      {
        path: "/hotel",
        name: "Hotel",
        icon: <i className="symbol feather feather-image text-danger" />,
        id: "tours_hotel",
        isExact: false,
        component: (props) => <Hotel {...props} type="inbox" draft={true} />,
      },
      {
        path: "/services",
        name: "Services",
        icon: <i className="symbol feather feather-code text-danger" />,
        id: "tours_services",
        isExact: false,
        component: (props) => <Services {...props} type="inbox" draft={true} />,
      },
      {
        path: "/cartype",
        name: "CarType",
        icon: <i className="symbol feather feather-file text-danger" />,
        id: "tours_cartype",
        isExact: false,
        component: (props) => <CarType {...props} type="inbox" draft={true} />,
      },
      {
        path: "/roomtype",
        name: "RoomType",
        icon: <i className="symbol feather feather-file-text text-danger" />,
        id: "tours_roomtype",
        isExact: false,
        component: (props) => <RoomType {...props} type="inbox" draft={true} />,
      },
    ],
  },
];

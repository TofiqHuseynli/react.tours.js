import {
  Inbox,
} from "@layouts";
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
 mailsInfo: MICROSERVICE_URL + "/mails/info"
};
export const MENU_ROUTES = [
  {
    path: "/inbox",
    name: "Inbox",
    id: "inbox",
    icon: <i className="symbol feather feather-mail text-danger" />,
    isExact: false,
    isHidden: false,
    component: (props) => <Inbox {...props} type="inbox" />,
  },
];

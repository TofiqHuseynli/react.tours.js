import { Api } from "fogito-core-ui";

export const serviceAdd = (params) => {
    return Api.post("serviceAdd", { data: params });
  };

export const serviceList = (params) => {
    return Api.post("serviceList", { data: params });
  };
import { Api } from "fogito-core-ui";

export const serviceList = (params) => {
  return Api.post("serviceList", { data: params });
};

export const serviceAdd = (params) => {
  return Api.post("serviceAdd", { data: params });
};

export const serviceDelete = (params) => {
  return Api.post("serviceDelete", { data: params });
};

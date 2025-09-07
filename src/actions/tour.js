import { Api } from "fogito-core-ui";

export const tourList = (params) => {
  return Api.post("tourList", { data: params });
};

export const tourAdd = (params) => {
  return Api.post("tourAdd", { data: params });
};

export const tourDelete = (params) => {
  return Api.post("tourDelete", { data: params });
};

export const tourInfo = (params) => {
  return Api.post("tourInfo", { data: params });
};

export const tourEdit = (params) => {
  return Api.post("tourEdit", { data: params });
};


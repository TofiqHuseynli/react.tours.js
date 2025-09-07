import { Api } from "fogito-core-ui";

export const roomTypeList = (params) => {
  return Api.post("roomTypeList", { data: params });
};

export const roomTypeMinList = (params) => {
  return Api.post("roomTypeMinList", { data: params });
};

export const roomTypeAdd = (params) => {
  return Api.post("roomTypeAdd", { data: params });
};

export const roomTypeDelete = (params) => {
  return Api.post("roomTypeDelete", { data: params });
};

export const roomTypeInfo = (params) => {
  return Api.post("roomTypeInfo", { data: params });
};

export const roomTypeEdit = (params) => {
  return Api.post("roomTypeEdit", { data: params });
};


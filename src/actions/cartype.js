import { Api } from "fogito-core-ui";

export const carTypeList = (params) => {
  return Api.post("carTypeList", { data: params });
};

export const carTypeAdd = (params) => {
  return Api.post("carTypeAdd", { data: params });
};

export const carTypeDelete = (params) => {
  return Api.post("carTypeDelete", { data: params });
};

export const carTypeInfo = (params) => {
  return Api.post("carTypeInfo", { data: params });
};

export const carTypeEdit = (params) => {
  return Api.post("carTypeEdit", { data: params });
};

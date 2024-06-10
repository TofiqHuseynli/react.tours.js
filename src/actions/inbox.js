import { Api } from "fogito-core-ui";

export const mailsList = (params) => {
  return Api.post("mailsList", { data: params });
};

export const mailsAdd = (params) => {
  return Api.post("mailsAdd", params);
};

export const mailsDelete = (params) => {
  return Api.post("mailsDelete", params);
};

export const mailsInfo = (params) => {
  return Api.post("mailsInfo", { data: params });
};





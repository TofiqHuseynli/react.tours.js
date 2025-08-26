import { Api } from "fogito-core-ui";

export const tourList = (params) => {
  return Api.post("tourList", { data: params });
};

// export const mailsAdd = (params) => {
//   return Api.post("mailsAdd", params);
// };

// export const mailsDelete = (params) => {
//   return Api.post("mailsDelete", params);
// };

// export const mailsInfo = (params) => {
//   return Api.post("mailsInfo", { data: params });
// };

// export const mailList = (params) => {
//   return Api.post("mailList", params);
// };

// export const mailMessage = (params) => {
//   return Api.post("mailMessage", { data: params });
// };

// export const mailsForward = (params) => {
//   return Api.post("mailsForward",  params);
// };

// export const mailsReply = (params) => {
//   return Api.post("mailsReply",  params);
// };
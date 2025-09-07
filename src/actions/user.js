import { Api } from "fogito-core-ui";

export const userList = (params) => {
  return Api.get("userList", { data: params });
};

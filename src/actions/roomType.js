import { Api } from "fogito-core-ui";


export const roomTypeList = (params) => {
    return Api.post("roomTypeList", { data: params });
  };


export const roomTypeAdd = (params) => {
    return Api.post("roomTypeAdd", { data: params });
  };

import { Api } from "fogito-core-ui";


export const carTypeList = (params) => {
    return Api.post("carTypeList", { data: params });
  };


export const carTypeAdd = (params) => {
    return Api.post("carTypeAdd", { data: params });
  };

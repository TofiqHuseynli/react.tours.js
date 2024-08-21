import { Api } from "fogito-core-ui";

export const connectedList = (params) => {
    return Api.post("connectedList", { data: params });
  };

  export const connectedAdd = (params) => {
    return Api.post("connectedAdd", params);
  };
  

  export const connectedDelete = (params) => {
    return Api.post("connectedDelete", { data: params });
  };
  
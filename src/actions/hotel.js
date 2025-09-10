import { Api } from "fogito-core-ui";


export const hotelList = (params) => {
    return Api.post("hotelList", { data: params });
  };

  export const hotelMinList = (params) => {
    return Api.post("hotelMinList", { data: params });
  };

  export const hotelAdd = (params) => {
    return Api.post("hotelAdd", { data: params });
  };

  export const hotelDelete = (params) => {
    return Api.post("hotelDelete", { data: params });
  };

  export const hotelInfo = (params) => {
    return Api.post("hotelInfo", { data: params });
  };

  export const hotelEdit = (params) => {
    return Api.post("hotelEdit", { data: params });
  };
import { Api } from "fogito-core-ui";


export const hotelList = (params) => {
    return Api.post("hotelList", { data: params });
  };


  export const hotelAdd = (params) => {
    return Api.post("hotelAdd", { data: params });
  };


  export const hotelDelete = (params) => {
    return Api.post("hotelDelete", { data: params });
  };
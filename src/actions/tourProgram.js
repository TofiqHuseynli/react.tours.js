import { Api } from "fogito-core-ui";

export const tourProgramList = (params) => {
    return Api.post("tourProgramList", { data: params });
  };

export const tourProgramAdd = (params) => {
    return Api.post("tourProgramAdd", { data: params });
  };

  export const tourProgramDelete = (params) => {
    return Api.post("tourProgramDelete", { data: params });
  };

  export const tourProgramInfo = (params) => {
    return Api.post("tourProgramInfo", { data: params });
  };

  export const tourProgramEdit = (params) => {
    return Api.post("tourProgramEdit", { data: params });
  };

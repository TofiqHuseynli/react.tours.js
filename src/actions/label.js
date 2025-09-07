import { Api } from 'fogito-core-ui';

export const labelsList = (params) => {
  return Api.get('labelsList', { data: params });
};

export const labelsCheck = (params) => {
  return Api.get('labelsCheck', { data: params });
};

export const labelsAdd = (params) => {
  return Api.get('labelsAdd', { data: params });
};

export const labelsEdit = (params) => {
  return Api.get('labelsEdit', { data: params });
};

export const labelsDelete = (params) => {
  return Api.get('labelsDelete', { data: params });
};

export const labelsMoveLabel = (params) => {
  return Api.get('labelsMoveLabel', { data: params });
};

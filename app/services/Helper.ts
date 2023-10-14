import {v4} from 'uuid';

export function generateUUID() : string {
  return v4();
}

export function getQuery(url) : any {
  const queryParams = new URLSearchParams(new URL(url).search);
  const params = {};

  queryParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

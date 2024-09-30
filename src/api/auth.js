import {axiosInstance} from '.';

export async function authorize(username, password) {
  const {data} = await axiosInstance.post('/auth/login/', {username, password});
  axiosInstance.defaults.headers.common.Authorization = `Token ${data.key}`;
  return data;
}

export function unauthorize() {
  delete axiosInstance.defaults.headers.common.Authorization;
}

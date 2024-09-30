import {axiosInstance} from '.';
import {getCached} from '@/utils/local-cache.js';

export async function authorize(username, password) {
  const {data} = await axiosInstance.post('/auth/login/', {username, password});
  axiosInstance.defaults.headers.common.Authorization = `Token ${data.key}`;
  return {userId: data.employee_id, apiKey: data.key};
}

export function unauthorize() {
  delete axiosInstance.defaults.headers.common.Authorization;
}

const cachedApiKey = getCached('apiKey');
if (cachedApiKey) {
  axiosInstance.defaults.headers.common.Authorization = `Token ${cachedApiKey}`;  
}

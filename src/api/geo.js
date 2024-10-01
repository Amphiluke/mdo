import {axiosInstance} from '.';

export async function getPremises() {
  const {data} = await axiosInstance.get('/geo/v2.0/user-premises/');
  return data.results;
}

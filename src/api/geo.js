import {axiosInstance} from '.';

export async function getPremises(search) {
  const {data} = await axiosInstance.get('/geo/v2.0/user-premises/', {params: {search}});
  return data.results;
}

export async function getApartments({premisesId, search}) {
  const {data} = await axiosInstance.get('/geo/v1.0/apartments/', {params: {premise_id: premisesId, search}});
  return data.results;
}

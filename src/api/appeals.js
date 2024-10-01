import {axiosInstance} from '.';

export async function getAppeals({search, premiseId, page = 1, pageSize = 10} = {}) {
  const {data} = await axiosInstance.get('/appeals/v1.0/appeals/', {
    params: {
      search,
      premise_id: premiseId,
      page,
      page_size: pageSize,
    },
  });
  return {
    pageCount: data.pages,
    appeals: data.results,
  };
}

export async function getPremises() {
  const {data} = await axiosInstance.get('/geo/v2.0/user-premises/');
  return data.results;
}

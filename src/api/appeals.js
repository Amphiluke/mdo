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
    count: data.count,
    appeals: data.results,
  };
}

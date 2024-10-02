import {axiosInstance} from '.';
import {formatISO} from 'date-fns';

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

export function createAppeal(payload) {
  return axiosInstance.post('/appeals/v1.0/appeals/', {
    premise_id: payload.premisesId,
    apartment_id: payload.apartmentId,
    applicant: {
      last_name: payload.lastName,
      first_name: payload.firstName,
      patronymic_name: payload.patronymicName,
      username: payload.userName,
    },
    description: payload.description,
    due_date: formatISO(payload.dueDate),
    status_id: 1,
  });
}

export function updateAppeal(appealId, payload) {
  return axiosInstance.patch(`/appeals/v1.0/appeals/${appealId}/`, {
    premise_id: payload.premisesId,
    apartment_id: payload.apartmentId,
    applicant: {
      last_name: payload.lastName,
      first_name: payload.firstName,
      patronymic_name: payload.patronymicName,
      username: payload.userName,
    },
    description: payload.description,
    due_date: formatISO(payload.dueDate),
  });
}

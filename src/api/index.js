import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://dev.moydomonline.ru/api',
});

export function extractAPIError(response, defaultMessage = 'Произошла непредвиденная ошибка') {
  let message = '';
  if (response.data?.data) {
    message = Object.values(response.data.data).reduce((memo, msg) => {
      if (Array.isArray(msg)) {
        return memo + msg.join(' ');
      }
      return memo + msg;
    }, '');
  }
  return message || response.detail || defaultMessage;
}

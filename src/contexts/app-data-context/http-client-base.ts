import axios from 'axios';
import { appConstants } from '../../constants/app-constants';
import { handleDates } from '../../utils/date-convertor';

const httpClientBase = axios.create({
  baseURL: appConstants.webApiRoot,
});

httpClientBase.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data);

  return originalResponse;
});

export { httpClientBase };

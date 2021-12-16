import axios from 'axios';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';
import logger from './loggerService';

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (expectedError) return Promise.reject(error);
  //   console.log(error, error.response);
  //   Sentry.captureException(error);
  logger.captureException(error);
  toast.error('Some unexpected error happened', { theme: 'colored' });
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

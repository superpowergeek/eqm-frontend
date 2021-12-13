import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga';
import { getHeaders } from '../utils/HeaderManager';

export default (axioConfig) => {
  const source = CancelToken.source();
  const request = axios({
    ...axioConfig,
    url: `${process.env.REACT_APP_BACKEND_DOMAIN}${axioConfig.url}`,
    cancelToken: source.token,
    headers: {
      ...axioConfig.headers,
      ...getHeaders(),
    }
  });
  request[CANCEL] = () => source.cancel()
  return request;
}

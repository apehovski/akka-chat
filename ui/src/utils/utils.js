import dateFormat from 'dateformat';

export function isMockDev() {
  return process.env.REACT_APP_ENVIRONMENT === "mock_development";
}

export function formatMessageDate(datetime) {
  return dateFormat(datetime, "dd.mm.yyyy HH:MM:ss");
}

const host = process.env.REACT_APP_SERVER_HOST
export const config = {
  API:    'http://' + host + ':8080/api',
  WS_API: 'ws://' + host + ':8080/api/wsConnection'
}
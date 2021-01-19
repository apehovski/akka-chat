import dateFormat from 'dateformat';

export function generateColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function isMockDev() {
  return process.env.REACT_APP_ENVIRONMENT === "mock_development";
}

export function formatMessageDate(datetime) {
  return dateFormat(datetime, "dd.mm.yyyy HH:MM:ss");
}

export const config = {
  API: process.env.REACT_APP_SERVER_URL,
  WS_API: process.env.REACT_APP_WS_SERVER_URL,
}
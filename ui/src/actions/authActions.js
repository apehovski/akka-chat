import * as auth from "../utils/authLocalStorage";

export const LOGIN_REQ = 'LOGIN_REQ';
export const LOGIN_RESP = 'LOGIN_RESP';
export const RELOAD_USER = 'RELOAD_USER';
export const LOGOUT_REQ = 'LOGOUT_REQ';
export const LOGOUT_RESP = 'LOGOUT_RESP';

export function doLogin(username) {
  return {
    type: LOGIN_REQ,
    username
  };
}

export function reloadUser() {
  let loadedProfile = auth.reloadUserFromStorage();

  return {
    type: RELOAD_USER,
    loadedProfile
  };
}

export function doLogout() {
  return {
    type: LOGOUT_REQ
  };
}


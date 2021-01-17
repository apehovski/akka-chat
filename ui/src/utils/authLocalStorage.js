export const LOGGED_IN_KEY = 'logged-in';

export function logIn(userProfile) {
  localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(userProfile));
}

export function logOut() {
  localStorage.removeItem(LOGGED_IN_KEY);
}

export function reloadUserFromStorage() {
  return JSON.parse(localStorage.getItem(LOGGED_IN_KEY));
}

export function isLoggedIn() {
  return localStorage.getItem(LOGGED_IN_KEY) !== null;
}

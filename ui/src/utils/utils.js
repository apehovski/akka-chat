export const LOGGED_IN_KEY = 'logged-in';

export function logIn() {
  localStorage.setItem(LOGGED_IN_KEY, 'true');
}

export function logOut() {
  localStorage.removeItem(LOGGED_IN_KEY);
}

export function isLoggedIn() {
  return localStorage.getItem(LOGGED_IN_KEY) === 'true';
}

export function generateColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function isLocalDev() {
  return process.env.NODE_ENV === "development";
}

export function generateColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function isLocalDev() {
  return process.env.NODE_ENV === "development";
}

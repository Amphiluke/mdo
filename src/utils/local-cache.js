export function getCached(key) {
  return localStorage.getItem(key);
}

export function setCached(key, value) {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
}

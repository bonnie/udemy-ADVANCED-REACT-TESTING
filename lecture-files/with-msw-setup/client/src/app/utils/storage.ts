export const storeItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const clearItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const getItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('Error reading localStorage', error);
    return defaultValue;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    if (value === undefined || value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error writing localStorage', error);
  }
};

export const removeLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage', error);
  }
};


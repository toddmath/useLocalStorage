import { useState } from 'react';

Storage.prototype.setObject = function(key: string, value: string) {
  this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key: string) {
  let output = this.getItem(key);
  return output ? JSON.parse(output) : new Error(`${output} does not exist!`);
};

interface ObjectLike {
  [key: string]: string;
}

export function useLocalStorage(
  key: string | ObjectLike,
  initialValue: string
) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof key === 'string') {
        const item = window.localStorage.getItem(key);

        return item ? JSON.parse(item) : initialValue;
      } else if (typeof key === 'object') {
        const item = window.localStorage.getObject(key);

        return item || initialValue;
      }
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue = (value: string | ObjectLike | Function): void => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;

      setStoredValue(newValue);
      window.localStorage.setObject(String(key), newValue);
    } catch (error) {
      console.warn(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;

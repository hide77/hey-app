import { STORAGE_KEY } from "hey-mocks";
import { AsyncStorage } from "react-native";

export const storeData = async (_key, _value, _options = {}) => {
  try {
    await AsyncStorage.setItem(
      `@${STORAGE_KEY}:${_key}`,
      _options.json ? JSON.stringify(_value) : _value
    );
  } catch (e) {
    // saving error
    console.log("STORAGE_ERROR", e);
  }
};

export const getData = async (_key, _options = {}) => {
  try {
    const value = await AsyncStorage.getItem(`@${STORAGE_KEY}:${_key}`);
    if (value !== undefined && value !== null) {
      return _options.json ? JSON.parse(value) : value;
    } else return null;
  } catch (e) {
    // error reading value
    console.log("STORAGE_ERROR", e);
  }
};

export const removeData = async (_key, _cb = () => {}) => {
  try {
    await AsyncStorage.removeItem(`@${STORAGE_KEY}:${_key}`);
    _cb();
  } catch (e) {
    // error reading value
    console.log("REMOVE_ERROR", e);
  }
};

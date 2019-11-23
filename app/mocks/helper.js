import React, { Component } from "react";
import { Alert } from "react-native";

export const Ink = message => {
  Alert.alert(
    "console",
    message,
    [
      {
        text: "👍"
      }
    ],
    { cancelable: false }
  );
};
export const idx = (p, o, d = null) => {
  return p.reduce((xs, x) => (xs && xs[x] ? xs[x] : d), o);
};

export const isCloseToBottom = (
  { layoutMeasurement, contentOffset, contentSize },
  _offset
) => {
  return (
    layoutMeasurement.height + contentOffset.y >= contentSize.height - _offset
  );
};

export const safeStringify = obj => {
  var seen = [];

  return JSON.stringify(obj, function(key, val) {
    if (val != null && typeof val == "object") {
      if (seen.indexOf(val) >= 0) {
        return;
      }
      seen.push(val);
    }
    return val;
  });
};

export const debounce = (func, wait, immediate = false) => {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const extractFromArray = (_array, _element, _key) => {
  let _foundElement = null;
  for (var i = 0; i < _array.length; i++) {
    if (_array[i][_key] === _element) {
      _foundElement = _array[i];
      break;
    }
  }
  return _foundElement;
};

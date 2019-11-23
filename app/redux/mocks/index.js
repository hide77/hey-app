import { DEFAULT_API_URL as _DEFAULT_API_URL } from "hey-mocks";
import { STORAGE_KEY as _STORAGE_KEY } from "hey-mocks";
export const DEFAULT_API_URL = _DEFAULT_API_URL;
export const STORAGE_KEY = _STORAGE_KEY;
import "react-native-console-time-polyfill";

export const WRONG_TOKEN = "wrong_token";
import { logoutUser } from "hey-redux/actions/authentication";

function getQueryString(p) {
  const e = encodeURIComponent;
  return p
    ? `?${Object.keys(p)
        .map(k => `${e(k)}=${e(p[k])}`)
        .join("&")}`
    : "";
}

export const FETCH = (
  _path,
  {
    stringify,
    token,
    path = "",
    headers = {},
    params,
    body,
    method = "GET",
    json = false,
    dispatch = () => {}
  } = {}
) => {
  const req = {
    method,
    headers
  };
  let __path = path || _path;
  if (__path.indexOf(" ") > -1) {
    __path = __path.split(" ");
    req.method = __path[0];
    __path = __path[1];
  }
  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }
  if (json) {
    req.headers["Content-Type"] = "application/json";
    req.headers["Accept"] = "application/json";
  }
  if (body) {
    req.body = stringify ? JSON.stringify(body) : body;
  }
  const fetch_path = `${req.method} ${__path}`;
  return new Promise(resolve => {
    // console.time(fetch_path);
    fetch(`${DEFAULT_API_URL}${__path}${getQueryString(params)}`, req)
      .then(r => {
        // console.timeEnd(fetch_path);
        return r.json();
      })
      .then(r => {
        if (r.error === WRONG_TOKEN) {
          dispatch(logoutUser());
        }
        resolve(r);
      })
      .catch(r => {
        resolve(r);
      });
  });
};

export const stateDelete = (a, k, v) => {
  return k ? a.filter(i => i[k] !== v) : a.filter(i => i !== v);
};

export const stateUpdate = (a, k, v) => {
  return a.map(i => {
    return i[k] === v[k] ? v : i;
  });
};

export const isKeyinArray = (k, v, a) => {
  return a.some(function(e) {
    return e[k] === v;
  });
};

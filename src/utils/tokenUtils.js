const TOKEN_KEY = "bdms_token";
const REFRESH_KEY = "bdms_refresh_token";

export const tokenUtils = {
  getToken:        ()      => localStorage.getItem(TOKEN_KEY),
  setToken:        (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken:     ()      => localStorage.removeItem(TOKEN_KEY),

  getRefreshToken:    ()      => localStorage.getItem(REFRESH_KEY),
  setRefreshToken:    (token) => localStorage.setItem(REFRESH_KEY, token),
  removeRefreshToken: ()      => localStorage.removeItem(REFRESH_KEY),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
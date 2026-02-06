export const getToken = () => localStorage.getItem("access_token");

export const isLoggedIn = () => !!getToken();

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

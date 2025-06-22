// src/utils/logoutHelper.js
export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '?expired=true';
};

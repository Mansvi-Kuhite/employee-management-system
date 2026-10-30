const KEY = "ems_flash";

export const setFlash = (value) => sessionStorage.setItem(KEY, value);
export const readFlash = () => sessionStorage.getItem(KEY);
export const clearFlash = () => sessionStorage.removeItem(KEY);
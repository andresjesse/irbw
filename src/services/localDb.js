const set = (key, val) => {
  localStorage.setItem(key, JSON.stringify({ data: val }));
};

const get = (key) => {
  let value = localStorage.getItem(key);
  return value && JSON.parse(localStorage.getItem(key)).data;
};

const localDb = {
  set,
  get,
};

export default localDb;

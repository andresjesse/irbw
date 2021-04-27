// testing/fake API

const login = () => {
  return new Promise((resolve, reject) =>
    resolve({
      token: "ABC123",
    })
  );
};

export default {
  login,
};

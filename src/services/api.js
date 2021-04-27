// testing/fake API

//------------------------------------------------- Auth

export const login = () => {
  return new Promise((resolve, reject) => {
    resolve({
      token: "ABC123",
    });
  });
};

export const logout = () => {};

export const isAuthenticated = () => true;

//------------------------------------------------- Project

export const getProjects = () => {
  return new Promise((resolve, reject) =>
    resolve([
      {
        id: 1,
        name: "Playground Project",
        editorVersion: 1,
      },
    ])
  );
};

export const getProject = (id) => {
  if (id == 1)
    return new Promise((resolve, reject) =>
      resolve({
        id: 1,
        name: "Playground Project",
        editorVersion: 1,
        scenes: [
          {
            id: 1,
            name: "Playground Scene",
          },
        ],
      })
    );

  throw new Error("projectId=" + id + " does not exist!");
};

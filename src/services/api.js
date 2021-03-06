// testing/fake API

import localDb from "./localDb";

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

const defaultProject = {
  id: 1,
  name: "Playground Project",
  editorVersion: 1,
  scenes: {
    1: {
      name: "Playground Scene",
    },
  },
};

export const getProject = (id) => {
  if (id == 1)
    return new Promise((resolve, reject) =>
      resolve(localDb.get("playgroundProject") || defaultProject)
    );

  throw new Error("projectId=" + id + " does not exist!");
};

export const saveProject = (project) => {
  console.log("api->Save");
  console.log(project);

  localDb.set("playgroundProject", project);
};

/**
 * This is a Vanilla JS redux toolkit store.
 */

import { createSlice, configureStore } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "appWebGL",
  initialState: {
    gameMode: "TERRAIN_EDIT",
  },
  reducers: {
    gameModeTerrainEdit: (state) => {
      state.gameMode = "TERRAIN_EDIT";
    },
    gameModeGameplay: (state) => {
      state.gameMode = "GAMEPLAY";
    },
  },
});

export const { gameModeTerrainEdit, gameModeGameplay } = appSlice.actions;

const store = configureStore({
  reducer: appSlice.reducer,
});

export default store;

// USAGE>
//import store, { incremented, decremented } from "./ReduxStore";

// // Can still subscribe to the store
// store.subscribe(() => console.log(store.getState()));

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented());
// // {value: 1}
// store.dispatch(incremented());
// // {value: 2}
// store.dispatch(decremented());
// // {value: 1}
/**
 * This is a Vanilla JS redux toolkit store.
 */

import { createSlice, configureStore } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "appWebGL",
  initialState: {
    editor: {
      ui: {
        mainToolbar: {
          activeTab: "environment",
          activeTool: "terrain_segments_edit",
          brushOptions: {
            brushSize: 50,
            brushStrength: 50,
          },
        },
      },
    },
    smgr: {
      lightManager: {
        timeOfDay: 12,
        dynamic: false,
        cycleDurationSec: 360,
      },
    },
  },
  reducers: {
    //editor
    editorUiMainToolbarSetTab: (state, action) => {
      state.editor.ui.mainToolbar.activeTab = action.payload;
      state.editor.ui.mainToolbar.activeTool = null;
    },
    editorUiMainToolbarSetTool: (state, action) => {
      state.editor.ui.mainToolbar.activeTool = action.payload;
    },
    editorUiMainToolbarSetBrushOptions: (state, action) => {
      state.editor.ui.mainToolbar.brushOptions = action.payload;
    },
    //smgr
    smgrLightManagerSetTimeOfDay: (state, action) => {
      state.smgr.lightManager.timeOfDay = action.payload;
    },
    smgrLightManagerSetDynamic: (state, action) => {
      state.smgr.lightManager.dynamic = action.payload;
    },
    smgrLightManagerSetCycleDurationSec: (state, action) => {
      state.smgr.lightManager.cycleDurationSec = action.payload;
    },
  },
});

export const {
  editorUiMainToolbarSetTab,
  editorUiMainToolbarSetTool,
  editorUiMainToolbarSetBrushOptions,
  smgrLightManagerSetTimeOfDay,
  smgrLightManagerSetDynamic,
  smgrLightManagerSetCycleDurationSec,
} = appSlice.actions;

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

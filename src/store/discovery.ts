import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import storage from "redux-persist/lib/storage";
export interface DiscoveryObj {
  discoverySelected: any | {};
}

export const discovery = createSlice({
  name: "Discovery",
  initialState: {
    discoverySelected: {},
  } as DiscoveryObj | null,
  reducers: {
    selectDiscovery: (state, action: any) => {
      if (state) {
        if (
          state?.discoverySelected.id &&
          state.discoverySelected.id === action.payload.id
        ) {
          state.discoverySelected = {};
        } else {
          // setTimeout(() => {

          state.discoverySelected = action.payload;
          // }, 0)
        }
      } else {
        // setTimeout(() => {
        // console.log(action.payload);
        //@ts-ignore
        state.discoverySelected! = action.payload;
        // }, 0)
      }
    },
  },
});

export const { selectDiscovery } = discovery.actions;

export const Drawer = (state: RootState) => state.drawer;

const DiscoveryReducer = discovery.reducer;
export default DiscoveryReducer;

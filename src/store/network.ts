import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import storage from "redux-persist/lib/storage";
export interface DiscoveryObj {
    discoverySelected: any | {};
}

export const network = createSlice({
    name: "Network",
    initialState: {
        discoverySelected: {},
    } as DiscoveryObj,
    reducers: {
        selectDiscovery: (state, action: any) => {
            if (state) {
                // console.log(action.payload);
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

export const { selectDiscovery } = network.actions;

export const Drawer = (state: RootState) => state.drawer;

const NetworkReducer = network.reducer;
export default NetworkReducer;

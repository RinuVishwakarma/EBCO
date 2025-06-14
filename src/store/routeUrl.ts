import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface UrlState {
  url: string;
}

const initialState: UrlState = {
  url: '',
};

export const routeUrlSlice = createSlice({
  name: 'routeUrl',
  initialState,
  reducers: {
    setUrl: (state, action: PayloadAction<Partial<UrlState>>) => {
      if (action.payload.url !== undefined) {
        state.url = action.payload.url;
      }
    },
  },
});

export const { setUrl } = routeUrlSlice.actions;

export const selectRouteUrl = (state: RootState) => state.routeUrl.url;

const routeUrlReducer = routeUrlSlice.reducer;
export default routeUrlReducer;

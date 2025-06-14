import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define the AuthObj interface
export interface AuthObj {
  token: string | null;
  user_email: string | null;
  user_nicename: string | null;
  user_display_name: string | null;
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  roles: string | null;
  registered_date: string | null;
  isLoggedIn: boolean;
  billing_address_1: string;
  billing_address_2: string;
  billing_phone: string;
  gst_in: string;
}

export const authSlice = createSlice({
  name: "Auth",
  initialState: {
    token: null,
    user_email: null,
    user_nicename: null,
    user_display_name: null,
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    roles: null,
    registered_date: null,
    isLoggedIn: false,
    billing_address_1: "",
    billing_address_2: "",
    billing_phone: "",
    gst_in: "",
  } as AuthObj, // Corrected initialization to match AuthObj type
  reducers: {
    setAuthToken: (state, action: PayloadAction<Partial<AuthObj>>) => {
      // Ensure action.payload is not null or undefined
      if (action.payload) {
        return { ...state, ...action.payload, isLoggedIn: true };
      } else {
        return state;
      }
    },
    logout: (state) => {
      // Reset the state to initial values on logout
      return {
        token: null,
        user_email: null,
        user_nicename: null,
        user_display_name: null,
        id: null,
        first_name: null,
        last_name: null,
        email: null,
        roles: null,
        registered_date: null,
        isLoggedIn: false,
        billing_address_1: "",
        billing_address_2: "",
        billing_phone: "",
        gst_in: "",
      };
    },
  },
});

export const { setAuthToken, logout } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;

// Reducer
const authReducer = authSlice.reducer;
export default authReducer;

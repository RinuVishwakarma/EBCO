// store/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authReducer";
import DiscoveryReducer from "./discovery";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import cartReducer from "./cart";
import cartDrawerReducer from "./cartDrawer";
import DrawerReducer from "./drawerReducer";
import MainMenuReducer from "./mainMenu";
import checkoutReducer from "./checkout";
import wishlistReducer from "./wishlist";
import routeUrlReducer from "./routeUrl";
import bookmarkReducer from "./bookmark";
import pincodeReducer from "./pincodeSlice";
import cartCountReducer from "./cartCount";
import NetworkReducer from "./network";

const reducers = combineReducers({
  auth: AuthReducer,
  drawer: DrawerReducer,
  discovery: DiscoveryReducer,
  cart: cartReducer,
  cartDrawer: cartDrawerReducer,
  mainMenu: MainMenuReducer,
  checkout: checkoutReducer,
  wishlist: wishlistReducer,
  routeUrl: routeUrlReducer,
  bookmark: bookmarkReducer,
  pincode: pincodeReducer,
  cartCount: cartCountReducer,
  network: NetworkReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "mainMenu", "cart", "wishlist", "bookmark"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

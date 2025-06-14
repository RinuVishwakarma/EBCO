// store/store.ts
import {combineReducers,configureStore} from "@reduxjs/toolkit";
import {FLUSH,PAUSE,PERSIST,persistReducer,persistStore,PURGE,REGISTER,REHYDRATE} from "redux-persist";
import AuthReducer from "./authReducer";
import bookmarkReducer from "./bookmark";
import cartReducer from "./cart";
import cartCountReducer from "./cartCount";
import cartDrawerReducer from "./cartDrawer";
import checkoutReducer from "./checkout";
import DiscoveryReducer from "./discovery";
import DrawerReducer from "./drawerReducer";
import MainMenuReducer from "./mainMenu";
import NetworkReducer from "./network";
import pincodeReducer from "./pincodeSlice";
import routeUrlReducer from "./routeUrl";
import wishlistReducer from "./wishlist";

// Create a noopStorage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    }
  };
};

// Use the appropriate storage based on environment
const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage();

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
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to avoid serialization errors with redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
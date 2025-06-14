import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { MenuData } from '@/utils/menuData/MainMenuData';

interface MenuProp {
  id: number;
  label: string;
  route: string;
  children?: MenuProp[];
  name?: string;
}

interface MainMenuState {
  menu: MenuProp[];
  mobileMenu: MenuProp[]
  mainMenu: MenuData[]
}

// Define the initial state using that type
const initialState: MainMenuState = {
  menu: [],
  mobileMenu:[],
  mainMenu:[]
};

// Create the slice
const mainMenuSlice = createSlice({
  name: 'mainMenu',
  initialState,
  reducers: {
    setMainMenu: (state, action: PayloadAction<MenuProp[]>) => {
      state.menu = action.payload;
    },
    setMobileMainMenu: (state, action: PayloadAction<MenuProp[]>) => {
      state.menu = action.payload;
    },
    setMainMenuAll: (state, action: PayloadAction<MenuData[]>) => {
      state.mainMenu = action.payload;
    }
  },
});

// Export the actions generated from the slice
export const { setMainMenu , setMobileMainMenu , setMainMenuAll} = mainMenuSlice.actions;

// Selector to get the main menu from the state
export const selectMainMenu = (state: RootState) => state.mainMenu.menu;
export const selectAllMainMenu = (state: RootState) => state.mainMenu.mainMenu;
export const selectMobileMainMenu = (state: RootState) => state.mainMenu.mobileMenu;

// Export the reducer to be included in the store
const MainMenuReducer = mainMenuSlice.reducer;
export default MainMenuReducer;

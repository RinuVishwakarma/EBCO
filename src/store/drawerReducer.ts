import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import storage from 'redux-persist/lib/storage'

export interface DrawerObj {
  isOpen : boolean
}

export const drawerSlice = createSlice({
  name: 'Drawer',
  initialState: { 
    isOpen: false
 } as Partial<DrawerObj> | null,
  reducers: {
    setDrawerOpen: (state, action: PayloadAction<Partial<DrawerObj | null>>) => {
      if (state) {
        return { ...state, ...action.payload }
      } else {
        return { ...action.payload }
      }
    },
   
  },
})

export const { setDrawerOpen } = drawerSlice.actions

export const Drawer = (state: RootState) => state.drawer

const DrawerReducer = drawerSlice.reducer
export default DrawerReducer

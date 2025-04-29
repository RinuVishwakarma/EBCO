// store/cartProductsCountSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartProductsCountState {
    count: number;
}

const initialState: CartProductsCountState = {
    count: 0,
};

const cartProductsCountSlice = createSlice({
    name: 'cartProductsCount',
    initialState,
    reducers: {
        setCartProductsCount(state, action: PayloadAction<number>) {
            state.count = action.payload;
        },

        resetCartProductsCount(state) {
            state.count = 0;
        },
    },
});

export const {
    setCartProductsCount,
    resetCartProductsCount,
} = cartProductsCountSlice.actions;

export default cartProductsCountSlice.reducer;

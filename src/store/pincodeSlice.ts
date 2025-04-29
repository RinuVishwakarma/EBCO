// store/slices/pincodeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PincodeState {
    pincode: string;
}

const initialState: PincodeState = {
    pincode: '',
};

const pincodeSlice = createSlice({
    name: 'pincode',
    initialState,
    reducers: {
        setPincode(state, action: PayloadAction<string>) {
            state.pincode = action.payload;
        },
        clearPincode(state) {
            state.pincode = '';
        },
    },
});

export const { setPincode, clearPincode } = pincodeSlice.actions;
export default pincodeSlice.reducer;

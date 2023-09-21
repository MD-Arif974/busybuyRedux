import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    products:[]
}






const homeSlice = createSlice({
    name:"home",
    initialState:INITIAL_STATE,
    reducers:{
        setupInitialState:(state,action) => {
            state.products = action.payload;
        }
    }
})

export const homeReducers = homeSlice.reducer;

export const homeActions = homeSlice.actions;

export const homeSelector = (state) => state.homeReducers;
import { createSlice } from "@reduxjs/toolkit"


const INITIAL_STATE = {
    user:null,
    
}



const authSlice = createSlice({
    name:'auth',
    initialState:INITIAL_STATE,
    reducers:{
        login:(state,action) => {
            state.user = action.payload;
        }
        ,
        logout:(state,action) => {
            state.user = null;
        }
    }
})

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

export const authSelector = (state) => state.authReducer;
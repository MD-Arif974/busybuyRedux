import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  ordersArr: [],
  totalOrderPriceArr: [],
  dayArr: [],
  tempArr:[]
};

const orderSlice = createSlice({
  name: "order",
  initialState: INITIAL_STATE,
  reducers: {
    setupInitializeArr: (state, action) => {
      state.ordersArr.push(action.payload[0]);
      state.totalOrderPriceArr.push(action.payload[1]);
      state.dayArr.push(action.payload[2]);
       
      // console.log('state',current(state));
    },
    emptyCurrOrderArr:(state,action) => {
      state.ordersArr = [];
    }
  },
});

export const orderReducer = orderSlice.reducer;
export const orderActions = orderSlice.actions;

export const orderSelector = (state) => state.orderReducer;

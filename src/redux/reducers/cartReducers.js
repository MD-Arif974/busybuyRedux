import { createSlice, current } from "@reduxjs/toolkit"



const INITIAL_STATE = {
    carts:[],
    totalCartsPrice:0
}


const cartsSlice = createSlice({
    name:'cart',
    initialState:INITIAL_STATE,
    reducers:{
       setupInitializeCart:(state,action) => {
       
             state.carts = action.payload[0];
             state.totalCartsPrice = action.payload[1];
           
       }
        ,
        add:(state,action) => {
           let ind = state.carts.findIndex((item) => item.id === action.payload[1]);

           if(ind === -1) {
             state.carts.push({...action.payload[0],qty:1});
           }
           else{
               state.carts[ind].qty += 1;
           }
           

           cartsSlice.caseReducers.totalCartItemPrice(state,action);
           
        },
        incrementProdCnt:(state,action) => {
             
            let ind = state.carts.findIndex((item) => item.id === action.payload);
             state.carts[ind].qty += 1;

             cartsSlice.caseReducers.totalCartItemPrice(state,action);
             
        },
        decrementProdCnt:(state,action) => {
            let ind = state.carts.findIndex((item) => item.id === action.payload);
            if(state.carts[ind].qty >=2) {
                state.carts[ind].qty -=1;
            }
            else{
                state.carts.splice(ind,1);
            }
            cartsSlice.caseReducers.totalCartItemPrice(state,action);
        },
        totalCartItemPrice:(state,action) => {
            let totalPrice = 0;
            for(let i=0;i<state.carts.length;i++) {
                totalPrice += state.carts[i].price * state.carts[i].qty;
            }
            state.totalCartsPrice = totalPrice;
            
        },
        removeCartItem:(state,action) => {
            let ind = state.carts.findIndex((item) => item.id === action.payload);

            state.carts.splice(ind,1);
            cartsSlice.caseReducers.totalCartItemPrice(state,action);
        }


    }
})

export const cartReducer = cartsSlice.reducer;
export const cartActions = cartsSlice.actions;

export const cartSelector = (state) => state.cartReducer;
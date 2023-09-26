import { configureStore } from '@reduxjs/toolkit';
import { homeReducer } from '../redux/reducers/homeReducers';
import { authReducer } from '../redux/reducers/authReducers';
import { cartReducer } from '../redux/reducers/cartReducers';
import { orderReducer } from '../redux/reducers/orderReducers';



export const store = configureStore({
   reducer:{
      homeReducer,
      authReducer,
      cartReducer,
      orderReducer,
      
   }
});

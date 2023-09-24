import { configureStore } from '@reduxjs/toolkit';
import { homeReducers } from '../redux/reducers/homeReducers';
import { authReducers } from '../redux/reducers/authReducers';
import { cartReducer } from '../redux/reducers/cartReducers';


export const store = configureStore({
   reducer:{
      homeReducers,
      authReducers,
      cartReducer
   }
});

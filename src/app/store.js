import { configureStore } from '@reduxjs/toolkit';
import { homeReducers } from '../redux/reducers/homeReducers';
import { authReducers } from '../redux/reducers/authReducers';


export const store = configureStore({
   reducer:{
      homeReducers,
      authReducers
   }
});

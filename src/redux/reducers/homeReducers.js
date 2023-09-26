import { createSlice } from "@reduxjs/toolkit";


const INITIAL_STATE = {
  products: [],
  categoryArr: [],
  checkBoxList: [
    {
      id: "mens-cloth",
      category: "mens-cloth",
      value: "Men's Clothing ",
      check: false,
    },
    {
      id: "womens-cloth",
      category: "womens-cloth",
      value: "Women's Clothing",
      check: false,
    },
    {
      id: "jewellery",
      category: "jewellery",
      value: "Jewellery",
      check: false,
    },
    {
      id: "electronics",
      category: "electronics",
      value: "Electronics",
      check: false,
    },
  ],
  arr: [],
  filterProdName:"",
  filterRangeValue:0,
  filterArr:[],
  userClicked:false
};

const homeSlice = createSlice({
  name: "home",
  initialState: INITIAL_STATE,
  reducers: {
    setupInitialState: (state, action) => {
      
      state.products = action.payload[0];
      state.filterArr = action.payload[0];
      state.filterRangeValue = action.payload[1];
       
     
      
    },
    categoryFilterOut: (state, action) => {
      let ind = state.checkBoxList.findIndex(
        (item) => item.category === action.payload
      );

      state.checkBoxList[ind].check = !state.checkBoxList[ind].check;

      if (state.checkBoxList[ind].check === false) {
        let arr = state.categoryArr.filter(
          (item) => item.category !== action.payload
        );
        state.categoryArr = arr;
      } else {
        let arr = state.products.filter(
          (item) => item.category === action.payload
        );
        state.categoryArr.push(...arr);
      }

     
    },
    filterProductsByName:(state,action) => {
       
         state.filterProdName = action.payload;
    },
    filterProductsByPrice:(state,action) => {
        state.filterRangeValue = Math.floor(action.payload);
        
         let filteredCategoryProducts = state.checkBoxList.filter((item) => item.check === true);
          
         state.arr = filteredCategoryProducts;
        
         if(filteredCategoryProducts.length > 0) {
            state.categoryArr = [];
            
            let arr  = [];
             for(let i=0;i<filteredCategoryProducts.length;i++) {
               let temp = state.products.filter((item) => item.price <= state.filterRangeValue && item.category === filteredCategoryProducts[i].category);
               arr.push(...temp);
    
             }
             state.categoryArr = arr;

         }
         else{
             state.filterArr = state.products.filter((item) => item.price <= state.filterRangeValue);

         }
        
    },
    showLogOutButton:(state,action) =>{
     
       if(action.payload === undefined) {
        state.userClicked = !state.userClicked;
       }
       else{
          state.userClicked = false;
       }
    }
  },
});

export const homeReducer = homeSlice.reducer;

export const homeActions = homeSlice.actions;

export const homeSelector = (state) => state.homeReducer;

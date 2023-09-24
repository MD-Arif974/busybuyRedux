import styles from "./Filter.module.css";
import { useDispatch, useSelector } from "react-redux";
import { homeActions,homeSelector } from "../../redux/reducers/homeReducers";

const Filter = () => {
   const {filterRangeValue,checkBoxList} = useSelector(homeSelector);
   const dispatch = useDispatch();
  

  return (
    <aside className={styles.filterCont}>
      <h2>Filter</h2>
      <form>
        <div className={styles.priceCont}>
          <div className={styles.filterPrice}>Price:{filterRangeValue}</div>
          <div className={styles.filterRangeCont}>
            <input type="range" id="price" step={0.5} min="1" max="100000" 
             value={filterRangeValue}
             onChange={(e) => dispatch(homeActions.filterProductsByPrice(e.target.value))}
            />
          </div>
        </div>
        <h2>Category</h2>
        <div className={styles.filterProductCont}>
       {
        checkBoxList.map((checkList,i) => (
          <div className={styles.filterItem} key={i}>
          <input type="checkbox" onChange={() => dispatch(homeActions.categoryFilterOut(checkList.category))}/>
          <label htmlFor="category">{checkList.value}</label>
        </div>

        ))
       }
       
          
        </div>
      </form>
    </aside>
  );
};

export default Filter;

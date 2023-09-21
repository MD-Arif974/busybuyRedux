import styles from "./Filter.module.css";
import { checkBoxList } from "../../data/data";

const Filter = () => {
  return (
    <aside className={styles.filterCont}>
      <h2>Filter</h2>
      <form>
        <div className={styles.priceCont}>
          <div className={styles.filterPrice}>Price:{}</div>
          <div className={styles.filterRangeCont}>
            <input type="range" id="price" step={0.5} min="1" max="100000" />
          </div>
        </div>
        <h2>Category</h2>
        <div className={styles.filterProductCont}>
       {
        checkBoxList.map((checkList,i) => (
          <div className={styles.filterItem} key={i}>
          <input type="checkbox" />
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

import styles from "./Home.module.css";
import Filter from "../Filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { homeActions,homeSelector } from "../../redux/reducers/homeReducers";
import { useEffect, useState } from "react";
import {db} from '../../firebaseInit';
import Spinner from 'react-spinner-material';

import {collection,getDocs} from 'firebase/firestore';

const Home = () => {
  const {products} = useSelector(homeSelector);
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
    
  
  const getProducts = async() => {
       setLoading(true);
       const querySnapshot = await getDocs(collection(db,"products"));
       let arr = [];
       querySnapshot.docs.map((doc) => {
           arr.push(doc.data());
       })
       
       
       dispatch(homeActions.setupInitialState(arr));
       setLoading(false);
  }
  useEffect(() => {
       getProducts();
  },[])

   if(loading) {
    return (
      <div className={styles.loader}>
        <Spinner  color={"#7064e5"} />
      </div>
    );
   }
  return (
    <>
      <div className={styles.homeCont}>
        <div className={styles.searchCont}>
          <input
            type="text"
            placeholder="Search by Name..."
           
          />
        </div>
        { products.length > 0 ? <Filter /> : null}
        <div className={styles.productCont}>
          {

          products.map((item,i) => (
           <div className={styles.productDetails} key={item.id} >
            <div className={styles.productImg}>
              <img  src={item.icon} alt = {item.name}/>
            </div>
            <div className={styles.productName}>{item.name}</div>
            <div className={styles.productPrice}>
              <span>&#8377; {item.price}</span>&nbsp;
            </div>

            <div className={styles.productButton}>
              <button>Add to Cart</button>
            </div>
          </div>
            
          ))
          
            }
        </div>
    
      </div>
    </>
  );
};

export default Home;

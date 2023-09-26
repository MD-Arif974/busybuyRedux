import styles from "./Home.module.css";
import Filter from "../Filter/Filter";

// redux reducers
import { useDispatch, useSelector } from "react-redux";
import { homeActions, homeSelector } from "../../redux/reducers/homeReducers";
import { cartActions, cartSelector } from "../../redux/reducers/cartReducers";
import { authActions} from "../../redux/reducers/authReducers";


import { useEffect, useState } from "react";
import { db } from "../../firebaseInit";
import Spinner from "react-spinner-material";
import {useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';



//firebase methods
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";





const Home = () => {
  const { products, categoryArr,filterProdName, filterArr} = useSelector(homeSelector);
  const { carts } = useSelector(cartSelector);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let email = sessionStorage.getItem("email");




  // This method is used to get the all products from firebase db once it is mounted.
  const getProducts = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    let arr = [];
    querySnapshot.docs.map((doc) => (
       arr.push(doc.data())
    ));

    dispatch(homeActions.setupInitialState([arr, 75000]));

    setLoading(false);
  };
  useEffect(() => {
    getProducts();
  }, []);

   
  // This method is used to get the username of that person
  const getUserName = async() =>{
    try{
      const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.email === email) {
        dispatch(authActions.login(data.name));
      }
      return data;
    });
    }catch(error){
       toast.error("Error while fetching username");
    }
  }

  useEffect(() => {
     getUserName();
  },[])

  


  // addItemsToDb method is used to add the items to db after clicking add to cart button
  const addItemsToDb = async (e, prod, id) => {
    try{

    
      // if user is not sign in we are navigating to sign in 
    if (!email) {
      navigate("/signin");
    } else {
      e.target.innerText = "Adding...";
      setTimeout(async () => {
        dispatch(cartActions.add([prod, id]));
        let ind = carts.findIndex((item) => item.id === prod.id);
        
        // if ind >=0 means item is present in cart we just need to update cnt of the product
        if (ind >= 0) {
          const cartsProdRef = doc(db, "users", email, "carts", id);

          await updateDoc(cartsProdRef, {
            qty: carts[ind].qty + 1,
          });
          toast.success("Product Incremented!");
        } else {
          await setDoc(doc(db, "users", email, "carts", id), {
            name: prod.name,
            price: prod.price,
            qty: 1,
            icon: prod.icon,
            id,
            category: prod.category,
          });

          toast.success("Product Added Successfully!");
          
        }
        e.target.innerText = "Add to Cart";
      }, 1000);
    }
     }catch(error){
        toast.error("Product Added Failed");
     }
  };

 
 // until all data is fetching from firebase showing spinner
  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color={"#7064e5"} />
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
            onChange={(e) =>
              dispatch(homeActions.filterProductsByName(e.target.value))
            }
          />
        </div>
        {products.length > 0 ? <Filter /> : null}

        {categoryArr.length > 0 ? (
          <>
            <div className={styles.productCont}>
              {categoryArr
                .filter((item) => {
                  if (filterProdName.length === 0) return true;
                  if (
                    item.name
                      .toLowerCase()
                      .includes(filterProdName.toLowerCase())
                  )
                    return true;
                })
                .map((item, i) => (
                  <div className={styles.productDetails} key={item.id}>
                    <div className={styles.productImg}>
                      <img src={item.icon} alt={item.name} />
                    </div>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productPrice}>
                      <span>&#8377; {item.price}</span>&nbsp;
                    </div>

                    <div
                      className={styles.productButton}
                      onClick={(e) => addItemsToDb(e, item, item.id)}
                    >
                      <button>Add to Cart</button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className={styles.productCont}>
            {filterArr
              .filter((item) => {
                if (filterProdName.length === 0) return true;
                if (
                  item.name.toLowerCase().includes(filterProdName.toLowerCase())
                )
                  return true;
              })
              .map((item, i) => (
                <div className={styles.productDetails} key={item.id}>
                  <div className={styles.productImg}>
                    <img src={item.icon} alt={item.name} />
                  </div>
                  <div className={styles.productName}>{item.name}</div>
                  <div className={styles.productPrice}>
                    <span>&#8377; {item.price}</span>&nbsp;
                  </div>

                  <div
                    className={styles.productButton}
                    onClick={(e) => addItemsToDb(e, item, item.id)}
                  >
                    <button>Add to Cart</button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

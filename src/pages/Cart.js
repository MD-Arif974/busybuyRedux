import { useDispatch, useSelector } from "react-redux";
import { cartActions, cartSelector } from "../redux/reducers/cartReducers";
import styles from "../components/Home/Home.module.css";
import {
  doc,
  updateDoc,
  deleteField,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseInit";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { homeSelector } from "../redux/reducers/homeReducers";

const Cart = () => {
  const { carts, totalCartsPrice } = useSelector(cartSelector);
const dispatch = useDispatch();


  let auth = sessionStorage.getItem("email");
  
  if(!auth) {
    return <Navigate to ='/signin' replace = {true} />
  }

  const incrementQtyToDB = async (id) => {
    dispatch(cartActions.incrementProdCnt(id));
    let email = sessionStorage.getItem("email");
    const cartsProdRef = doc(db, "users", email, "carts", id);
    let ind = carts.findIndex((item) => item.id === id);
    await updateDoc(cartsProdRef, {
      qty: carts[ind].qty + 1,
    });
  };
  const decrementQtyToDB = async (id) => {
    let email = sessionStorage.getItem("email");
    const cartsProdRef = doc(db, "users", email, "carts", id);

    let ind = carts.findIndex((item) => item.id === id);

    if (carts[ind].qty >= 2) {
      await updateDoc(cartsProdRef, {
        qty: carts[ind].qty - 1,
      });
    } else {
      const itemRef = doc(db, "users", email, "carts", id);

      // Remove the 'all prod ' field from the document
      await updateDoc(itemRef, {
        name: deleteField(),
        icon: deleteField(),
        price: deleteField(),
        qty: deleteField(),
        category: deleteField(),
        id: deleteField(),
      });
    }
    dispatch(cartActions.decrementProdCnt(id));
  };

  const removeCartItemFromDB = async (id) => {
    console.log("id", typeof id);
    let email = sessionStorage.getItem("email");

    const itemRef = doc(db, "users", email, "carts", id);

    console.log("ref", itemRef);
    // Remove the 'all prod ' field from the document
    await updateDoc(itemRef, {
      name: deleteField(),
      icon: deleteField(),
      price: deleteField(),
      qty: deleteField(),
      category: deleteField(),
      id: deleteField(),
    });
    dispatch(cartActions.removeCartItem(id));
  };

  const getCartsProd = async () => {
    const email = sessionStorage.getItem("email");
    const querySnapshot = await getDocs(
      collection(db, "users", email, "carts")
    );

    let arr = [];
    let price = 0;
    querySnapshot.docs.map((doc) => {
      const data = doc.data();

      if (Object.keys(data).length > 0) {
        price += data.price * data.qty;
        arr.push(data);
      }
    });

    dispatch(cartActions.setupInitializeCart([arr, price]));
  };

  useEffect(() => {
    if(auth)
     getCartsProd();
  }, []);

  return (
    <>
      <>
        {carts.length > 0 ? (
          <>
            <div className={styles.cartProductPriceCont}>
              <h3>
                Total Price:- <span>&#8377; {totalCartsPrice} </span>
                /-
              </h3>
              <button>Purchase</button>
            </div>
            <div className={styles.productCont}>
              {carts.map((item) => (
                <div className={styles.cartProductDetails} key={item.id}>
                  <div className={styles.cartProductImg}>
                    <img src={item.icon} alt={item.icon} />
                  </div>
                  <div className={styles.productName}>{item.name}</div>
                  <div className={styles.productPrice}>
                    <span>&#8377; {item.price}</span>&nbsp;
                    <div className={styles.prodCnt}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png"
                        alt="decrement btn"
                        onClick={() => decrementQtyToDB(item.id)}
                      />
                      <span>{item.qty}</span>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png"
                        alt="increament btn"
                        onClick={() => incrementQtyToDB(item.id)}
                      />
                    </div>
                  </div>
                  <div
                    className={styles.cartProductButton}
                    onClick={() => removeCartItemFromDB(item.id)}
                  >
                    <button>Remove from Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h1>Cart is Empty!!</h1>
        )}
      </>
    </>
  );
};

export default Cart;

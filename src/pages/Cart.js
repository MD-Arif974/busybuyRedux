import { useDispatch, useSelector } from "react-redux";
import styles from "../components/Home/Home.module.css";
import Spinner from "react-spinner-material";
import { db } from "../firebaseInit";
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";


// redux reducers
import { orderActions, orderSelector } from "../redux/reducers/orderReducers";
import { cartActions, cartSelector } from "../redux/reducers/cartReducers";



//firebase methods
import {
  doc,
  updateDoc,
  deleteField,
  getDocs,
  collection,
  setDoc,
} from "firebase/firestore";





const Cart = () => {
  let { carts, totalCartsPrice, IsPurchased } = useSelector(cartSelector);
  let { ordersArr, dayArr } = useSelector(orderSelector);
  const dispatch = useDispatch();
  let auth = sessionStorage.getItem("email");
  const navigate = useNavigate();
  let [loading, setLoading] = useState(false);

 
  // this is to get current date
  let d = new Date();
  let str = JSON.stringify(d);
  let currDay = str.substring(1, 11).split("-").reverse().join("-");
  

  // getCartsProd methods is used to get the all producst to carts arr from db
  const getCartsProd = async () => {
    setLoading(true);
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
      return data;
    });

    dispatch(cartActions.setupInitializeCart([arr, price]));
    setLoading(false);
  };

  useEffect(() => {
    if (auth) getCartsProd();
  }, [auth]);



  //addOrdersToDb  methods is used to add all the order once we purchased and remove all the products from carts.
  const addOrdersToDB = async () => {
    IsPurchased = true;
    await setDoc(doc(db, "users", auth, "orders", currDay), {
      id: currDay,
    });

    carts.map(async (item) => {
      let indArr = ordersArr.map((arr) =>
        arr.findIndex((prod) => prod.id === item.id)
      );

      if (
        dayArr[dayArr.length - 1] === currDay &&
        indArr[indArr.length - 1] !== -1
      ) {
        const docRef = doc(
          db,
          "users",
          auth,
          "orders",
          currDay,
          "orderList",
          item.id
        );
        await updateDoc(docRef, {
          qty:
            ordersArr[ordersArr.length - 1][indArr[indArr.length - 1]].qty +
            item.qty,
          totalPrice:
            ordersArr[ordersArr.length - 1][indArr[indArr.length - 1]]
              .totalPrice + item.price,
        });
      } else {
        await setDoc(
          doc(db, "users", auth, "orders", currDay, "orderList", item.id),
          {
            name: item.name,
            price: item.price,
            qty: item.qty,
            totalPrice: item.price * item.qty,
            id: item.id,
          }
        );
      }
    });
    
    // this getdocs is used to remove all the carts items from carts collection in db
    const querySnapshot = await getDocs(collection(db, "users", auth, "carts"));

    querySnapshot.docs.map(async (item) => {
      let data = item.data();
      if (Object.keys(data).length > 0) {
        const itemRef = doc(db, "users", auth, "carts", data.id);

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
    });

    if (IsPurchased) {
      dispatch(orderActions.emptyCurrOrderArr());
    }
    dispatch(cartActions.emptyState());
    setTimeout(() => {
      navigate("/order");
    }, 1000);
  };


  // incrementQtyToDb method is used to increment the cnt of product in cart arr as well as in db
  const incrementQtyToDB = async (id) => {
    dispatch(cartActions.incrementProdCnt(id));
    let email = sessionStorage.getItem("email");
    const cartsProdRef = doc(db, "users", email, "carts", id);
    let ind = carts.findIndex((item) => item.id === id);
    await updateDoc(cartsProdRef, {
      qty: carts[ind].qty + 1,
    });
  };

  // decrementQtyToDB method is used to decrement the cnt of product in cart arr as well as in db
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


  // removeCartItemFromDb method is used to remove the product from cart after clicking on remove button as well as from db
  const removeCartItemFromDB = async (id) => {
    let email = sessionStorage.getItem("email");

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
    dispatch(cartActions.removeCartItem(id));
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color={"#7064e5"} />
      </div>
    );
  }
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
              <button onClick={() => addOrdersToDB()}>Purchase</button>
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

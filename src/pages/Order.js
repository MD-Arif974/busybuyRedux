import { useDispatch, useSelector } from "react-redux";
import styles from "./Orders.module.css";
import { orderActions, orderSelector } from "../redux/reducers/orderReducers";
import { useEffect ,useState} from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseInit";
import Spinner from "react-spinner-material";

const Order = () => {
  const { ordersArr, totalOrderPriceArr, dayArr } = useSelector(orderSelector);

  const dispatch = useDispatch();
  const email = sessionStorage.getItem("email");
  let [loading, setLoading] = useState(false);

  const getOrders = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(
      collection(db, "users", email, "orders")
    );

    querySnapshot.docs.map(async (doc) => {
      let currDay = doc.data();

      let currArr = [];
      let totalPrice = 0;

      const listQuerySnapshot = await getDocs(
        collection(db, "users", email, "orders", currDay.id, "orderList")
      );

      listQuerySnapshot.docs.map((prod) => {
        let item = prod.data();
        totalPrice += item.price * item.qty;
        currArr.push(item);
      });

      if (currArr.length > 0) {
        dispatch(
          orderActions.setupInitializeArr([
            [...currArr],
            totalPrice,
            currDay.id,
          ])
        );
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (email && ordersArr.length === 0) {
      getOrders();
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color={"#7064e5"} />
      </div>
    );
  }

  return (
    <>
      <div className={styles.ordersCont}>
        {ordersArr.length > 0 ? (
          <>
            <h1>Your Orders</h1>

            {ordersArr.map((itemArr, i) => (
              <table key={i}>
                <caption>Ordered On:- {dayArr[i]}</caption>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {itemArr.map((prod, ind) => (
                    <tr key={ind}>
                      <td>{prod.name}</td>
                      <td>
                        <span>&#8377; {prod.price}</span>
                      </td>
                      <td>{prod.qty}</td>
                      <td>
                        <span>&#8377;</span> {prod.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <th>
                      <span>&#8377;</span> {totalOrderPriceArr[i]}
                    </th>
                  </tr>
                </tfoot>
              </table>
            ))}
          </>
        ) : (
          <h1>Order is Empty!!</h1>
        )}
      </div>
    </>
  );
};

export default Order;

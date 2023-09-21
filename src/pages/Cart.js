
import styles from "../components/Home/Home.module.css";


const Cart = () => {
 

     

    
  return (
    <>
   
        <>
          <div className={styles.cartProductPriceCont}>
            <h3>
              Total Price:- <span>&#8377;</span>
              /-
            </h3>
            <button >Purchase</button>
          </div>
          <div className={styles.productCont}>
         
              <div className={styles.cartProductDetails} >
                <div className={styles.cartProductImg}>
                  <img/>
                </div>
                <div className={styles.productName}></div>
                <div className={styles.productPrice}>
                  <span>&#8377;</span>&nbsp;
                  <div className={styles.prodCnt}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png"
                      alt="decrement btn"
                     
                    />
                    <span></span>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png"
                      alt="increament btn"
                     
                    />
                  </div>
                </div>
                <div
                  className={styles.cartProductButton}
                 
                >
                  <button>Remove from Cart</button>
                </div>
              </div>
         
          </div>
        </>
     
    </>
  );
};

export default Cart;

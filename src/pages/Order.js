import styles from "./Orders.module.css";


const Order = () => {
 

  return (
    <>
      <div className={styles.ordersCont}>
       
      
            <h1>Your Orders</h1>

           
        
                <table >
                  <caption>Ordered On:-</caption>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                        <td></td>
                        <td>
                          <span>&#8377;</span> 
                        </td>
                        <td>{}</td>
                        <td>
                          <span>&#8377;</span> {}
                        </td>
                      </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>
                        <span>&#8377;</span> {}
                      </th>
                    </tr>
                  </tfoot>
                </table>
             
           
         
        
      </div>
    </>
  );
};

export default Order;

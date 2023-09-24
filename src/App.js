import { db } from "./firebaseInit";
import Navbar from "./components/Navbar/Navbar";
import Order from "./pages/Order";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./components/Home/Home";
import NotFound from "./pages/NotFound";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,


} from "react-router-dom";
import { useSelector } from "react-redux";
import { homeSelector } from "./redux/reducers/homeReducers";



function App() {
  

  let auth = sessionStorage.getItem("email");
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement:<NotFound />,
      element: <Navbar />,
     
      children: [
        { index: true, element: <Home />},
        {
          path: "order",
          element: auth ? <Order /> : <SignIn />
        },
        {
          path: "cart",
          element: auth ?   <Cart /> : <Cart />
        },
        {
          path: "signup",
          element: <SignUp />,
        },
        {
          path: "signin",
          element:<SignIn />,
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

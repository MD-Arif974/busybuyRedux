import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { authActions,authSelector } from "../redux/reducers/authReducers";
import { useDispatch } from "react-redux";


const SignIn = () => {
   const emailRef = useRef();
   const passwordRef = useRef();
   
   //authAction creators 
  
   const dispatch = useDispatch();
   const navigate = useNavigate();

 


  const handleSignIn = (e) => {
    e.preventDefault();
    
    if(emailRef.current.value && passwordRef.current.value)
     e.target.innerText = "...";
    setTimeout(() => {
      const auth = getAuth();
     
    signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then((userCredential) => {
        // Signed in
        
         
        sessionStorage.setItem("email",emailRef.current.value);
       
        emailRef.current.value = "";
        passwordRef.current.value = "";
        e.target.innerText = "Sign In";
        navigate('/');
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    }, 1000);
  };

  return (
    <>
      <div className={styles.signInCont}>
        <h2>Sign In</h2>
        <form className={styles.signInForm} >
          <input type="email" ref={emailRef} placeholder="Enter Email" required/>
          <br />
          <input type="password" ref={passwordRef} placeholder="Enter Password" required/>
          <br />
          <button onClick={(e) => handleSignIn(e)}>Sign in</button>
        </form>

        <Link
          to="/signup"
          style={{ textDecoration: "none", height: "auto", marginTop: "15px" }}
        >
          <span>Or SignUp instead</span>
        </Link>
      </div>
    </>
  );
};

export default SignIn;

import { useRef } from "react";
import styles from "./SignIn.module.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {doc,setDoc} from 'firebase/firestore';
import {db} from '../firebaseInit';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';

const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();


  // handleSignUp method is used to handle the signup functionality
  const handleSignUp = (e) => {
    e.preventDefault();
     try{
      if(nameRef.current.value && emailRef.current.value && passwordRef.current.value)
      e.target.innerText = "...";
     setTimeout(() => {
       
       const auth = getAuth();
     createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
       .then(async(userCredential) => {
         // Signed Up
       
         
         await setDoc(doc(db,"users",emailRef.current.value),{
             email:emailRef.current.value,
             name:nameRef.current.value,
             password:passwordRef.current.value
         })
         
        
             
             emailRef.current.value = "";
             nameRef.current.value = "";
             passwordRef.current.value = "";
             e.target.innerText = "Sign Up";
             toast.success("SignUp Successfully!!");
             navigate('/signin')
       })
       .catch((error) => {
        e.target.innerText = "Sign Up";
         const errorCode = error.code;
       
        if(errorCode === 'auth/email-already-in-use') {
          toast.error("Email already exists!");
        }
       });
     }, 1000);
     }catch(error){
      toast.error("Sign Up Failed!");
     }

  };

  return (
    <>
      <div className={styles.signUpCont}>
        <h2>Sign Up</h2>
        <form >
          <input type="text" ref={nameRef} placeholder="Enter Name" required/>
          <br />
          <input type="email" ref={emailRef} placeholder="Enter Email" required/>
          <br />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Enter Password"
            required
          />
          <br />
          <button onClick={(e) => handleSignUp(e)}>Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;

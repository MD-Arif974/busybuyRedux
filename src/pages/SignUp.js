import { useRef } from "react";
import styles from "./SignIn.module.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {doc,setDoc} from 'firebase/firestore';
import {db} from '../firebaseInit';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then(async(userCredential) => {
        // Signed Up
        const user = userCredential.user;
        await setDoc(doc(db,"users",emailRef.current.value),{
            email:emailRef.current.value,
            name:nameRef.current.value,
            password:passwordRef.current.value
        })
        
       
            localStorage.setItem('name',nameRef.current.value);
            emailRef.current.value = "";
            nameRef.current.value = "";
            passwordRef.current.value = "";
            navigate('/signin')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,"...",errorMessage);
      });

  };

  return (
    <>
      <div className={styles.signUpCont}>
        <h2>Sign Up</h2>
        <form>
          <input type="text" ref={nameRef} placeholder="Enter Name" />
          <br />
          <input type="email" ref={emailRef} placeholder="Enter Email" />
          <br />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Enter Password"
          />
          <br />
          <button onClick={(e) => handleSignUp(e)}>Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;

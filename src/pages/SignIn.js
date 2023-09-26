import { Link,  useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { toast } from "react-toastify";


const SignIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  //authAction creators

 // handleSignIn method is used to handle the sign functionality
  const handleSignIn = (e) => {
    e.preventDefault();

    try {
      if (emailRef.current.value && passwordRef.current.value)
        e.target.innerText = "...";
      setTimeout(() => {
        const auth = getAuth();

        signInWithEmailAndPassword(
          auth,
          emailRef.current.value,
          passwordRef.current.value
        )
          .then((userCredential) => {
            // Signed in

            sessionStorage.setItem("email", emailRef.current.value);

            emailRef.current.value = "";
            passwordRef.current.value = "";
            e.target.innerText = "Sign In";
            toast.success("Login Successfully!!");

            navigate("/");
          })
          .catch((error) => {
            e.target.innerText = "Sign In";
            const errorCode = error.code;
            

            if (errorCode === "auth/user-not-found") {
              toast.error("Please check your Email!");
            } else if (errorCode === "auth/wrong-password") {
              toast.error("Password is Wrong!");
            }
          });
      }, 1000);
    } catch (error) {
    
      toast.error(error.code);
    }
  };

  return (
    <>
      <div className={styles.signInCont}>
        <h2>Sign In</h2>
        <form className={styles.signInForm}>
          <input
            type="email"
            ref={emailRef}
            placeholder="Enter Email"
            required
          />
          <br />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Enter Password"
            required
          />
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

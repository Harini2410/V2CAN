import { React, useRef } from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import classes from "./Login.module.css";
import { useState } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorModal from "../components/UI/ErrorModal";
import FirstPageModal from "../components/UI/FirstPageModal";
var CryptoJS = require("crypto-js")
const Login = (props) => {
  const history = useHistory();
  const emailInputRef = useRef("Initial value");
  const passwordInputRef = useRef("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();
  const [showFirstPage,setShowFirstPage]=useState(true);

  async function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);
    const userId = emailInputRef.current.value.split("@")[0];
    const password = passwordInputRef.current.value;

    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/User.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const existingUser = data[userId];
      if (existingUser) {
        const storedPwrd = existingUser.userConfig.password;
        var bytes = CryptoJS.AES.decrypt(storedPwrd, 'my-secret-key@123');
        const decryptedPwrd=bytes.toString(CryptoJS.enc.Utf8);
        if (password !== decryptedPwrd) {
          throw new Error("Invalid Password");
        } else {
          homeRedirect(existingUser.userConfig);
        }
      } else {
        throw new Error("User does not exist");
      }
    } catch (errornew) {
      console.log(errornew.message);
      setIsError(true);
    }
    setIsLoading(false);
  }

  const newUserHandler = (event) => {
    history.push({ pathname: "/signup" });
  };
  const guestUserHandler = () => {
    history.push({ pathname: "/advertisement" });
  };
  const homeRedirect = (userConfig) => {
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('currentUser', JSON.stringify(userConfig));
    props.setLoggedInState()
    history.push({ pathname: "/home" });
  };
  const errorHandler = () => {
    setIsError(null);
  };

  return (
    <>{showFirstPage &&<FirstPageModal onClose={()=>{setShowFirstPage(false)}}/>}
      {isError && (
        <ErrorModal
          title="Invalid Credentials"
          message="Try again"
          onConfirm={errorHandler}
        />
      )}
      <Card className={classes.input}>
        <form onSubmit={submitHandler}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" ref={emailInputRef} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" ref={passwordInputRef} />
          <div className={classes.btngrp}>
            {!isLoading && (
              <Button type="submit"
                className={`${classes.button} ${classes.login}`}
              >
                Login
              </Button>
            )}
            <Button
              type="button"
              className={classes.button}
              onClick={guestUserHandler}
            >
              Login as Guest
            </Button>
          </div>
          {isLoading && <LoadingSpinner />}
          <div className={classes.newUser} onClick={newUserHandler}>
            New user? Signup
          </div>
        </form>
      </Card>
    </>
  );
};

export default Login;

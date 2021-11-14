import React from "react";
import Card from "../UI/Card";
import classes from "./UserKindMain.module.css";
const UserKindMain = (props) => {
  return (
    <Card className={classes.card}>
      <header>How would you like to Register?</header>
      <div className={classes.button}>
      <button onClick={()=>{props.onClickHandler('entrepreneur')}}>Entrepreneur</button>
      <button onClick={()=>{props.onClickHandler('fundProvider')}}>Fund Provider</button></div>
    </Card>
  );
};
export default UserKindMain;

import React from "react";
import Card from "../UI/Card";
import classes from "./UserKindMain.module.css";
const FundProvSelectionForm = (props) => {
  return (
    <Card className={classes.card}>
      <header>How would you like to Register?</header>
      <div className={classes.button}>
      <button onClick={()=>{props.onClickHandler('bank')}}>Bank</button>
      <button onClick={()=>{props.onClickHandler('ventureCapitalist')}}>Venture Capitalist</button>
      </div><button className={classes.singleBtn} onClick={()=>{props.onClickHandler('selfFinance')}}>Self Finance</button>
    </Card>
  );
};
export default FundProvSelectionForm;

import AllBlogs from "./AllBlogs";
import AllNews from "./AllNews";
import classes from "./EntHome.module.css";
import { useState } from "react";
import SuccessModal from "../UI/SuccessModal";

const EntHome = (props) => {
  const [isSuccess, setIsSuccess] = useState(false);
  return (
    <div>
      {isSuccess && (
        <SuccessModal
          setIsSuccess={setIsSuccess}
          message="Notification sent successfully"
          redirectionPath="/home"
        />
      )}
      <AllBlogs className={classes.content} setIsSuccess={setIsSuccess}/>
      <AllNews />
    </div>
  );
};
export default EntHome;

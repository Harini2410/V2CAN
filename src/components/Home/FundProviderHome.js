import AllBlogs from "./AllBlogs";
import classes from "./FundProviderHome.module.css";
import { useState } from "react";
import SuccessModal from "../UI/SuccessModal";

const FundProviderHome = (props) => {
  const [isSuccess, setIsSuccess] = useState(false);
  return (
    <div>
      {isSuccess && (
        <SuccessModal
          setIsSuccess={setIsSuccess}
          message="Notification sent successfully"
          redirectionPath="/home"
        />
      )} <AllBlogs className={classes.contentOuter} blogsContainerClassName={classes.blogsContainer} cardClassName={classes.card} contentClassName={classes.content} setIsSuccess={setIsSuccess}/>
    </div>
  )
};

export default FundProviderHome;
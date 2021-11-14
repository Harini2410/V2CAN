import { useState } from "react";
import Card from "../UI/Card";
import ProfileAllBlogs from "./ProfileAllBlogs";
import classes from "./FPProfileForm.module.css";
import { useHistory } from "react-router-dom";
const FPProfileForm = (props) => {
  const history = useHistory();
  async function userDelete() {
    const currentUser = localStorage.getItem("currentUser");
    const userId = JSON.parse(currentUser).email.split("@")[0];
    try {
      let response = await fetch(
        `https://v2can-aac4a-default-rtdb.firebaseio.com/User/${userId}.json`,
        {
          method: "DELETE",
        }
      );

      response = await fetch(
        `https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs.json`
      );
      const data = await response.json();
      const BlogsList = [];
      for (const key in data) {
        if (data[key].userId === userId) {
          BlogsList.push(key);
        }
      }
      for (const key in BlogsList) {
        response = await fetch(
          `https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs/${BlogsList[key]}.json`,
          {
            method: "DELETE",
          }
        );
      }
    } catch (errornew) {
      console.log(errornew.message);
    }
  }
  const onDeleteClickHandler = (event) => {
    userDelete();
    localStorage.setItem("isLoggedIn", false);
    props.setLoggedInState();
    history.push({ pathname: "/login" });
  };
  const currentUser = localStorage.getItem("currentUser");
  const profileImage = JSON.parse(currentUser).profileImage;
  const defaultDPImage =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  const name = JSON.parse(currentUser).name;
  let contentleft = <div>Empty</div>;
  let contentright = "";
  if (JSON.parse(currentUser).aadhar) {
    const aadhar = JSON.parse(currentUser).aadhar;
    const email = JSON.parse(currentUser).email;
    const phone = JSON.parse(currentUser).phone;
    const interest = JSON.parse(currentUser).interest;
    contentleft = (
      <>
        <div>
          <img
            className={classes.selfFinanceProfileIcon}
            src={profileImage ? profileImage : defaultDPImage}
          />
          <header class={classes.selfFinanceHeader}>About You!</header>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.selfFinlabel}> Name</div>
          <p className={classes.selfFinvalue}>{name}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.selfFinlabel}> Aadhar</div>
          <p className={classes.selfFinvalue}>{aadhar}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.selfFinlabel}> Email</div>
          <p className={classes.selfFinvalue}>{email}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.selfFinlabel}> Phone</div>
          <p className={classes.selfFinvalue}>{phone}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.selfFinlabel}> Interests</div>
          <div className={classes.selfFinvalue}>
            {interest.map((item) => (
              <p className={classes.interest}> {item} </p>
            ))}
          </div>
        </div>
        <button onClick={onDeleteClickHandler} className={classes.button}>
          Delete Account
        </button>
      </>
    );
  } else {
    const email = JSON.parse(currentUser).email;
    const phone = JSON.parse(currentUser).firmPhone;
    const interest = JSON.parse(currentUser).interest;
    contentleft = (
      <>
        <header class={classes.header}>About You!</header>
        <div className={classes.innercontent}>
          <div className={classes.label}> Firm Name</div>
          <p className={classes.value}>{name}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.label}> Firm email</div>
          <p className={classes.value}>{email}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.label}> Firm Phone</div>
          <p className={classes.value}>{phone}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.label}> Interests</div>
          <div className={classes.value}>
            {interest.map((item) => (
              <p className={classes.interest}> {item} </p>
            ))}
          </div>
        </div>
      </>
    );
    const branch = JSON.parse(currentUser).branch;
    const pocName = JSON.parse(currentUser).pocName;
    const pocEmail = JSON.parse(currentUser).pocEmail;
    const pocPhone = JSON.parse(currentUser).pocPhone;
    contentright = (
      <>
        <div className={classes.innercontent}>
          <div className={classes.label}> Branch Area</div>
          <p className={classes.value}>{branch}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.label}> Name</div>
          <p className={classes.value}>{pocName}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.label}> Email</div>
          <p className={classes.value}>{pocEmail}</p>
        </div>
        <div className={classes.innercontent}>
          <div className={classes.label}> Phone</div>
          <p className={classes.value}>{pocPhone}</p>
        </div>
      </>
    );
  }
  return (
    <div>
      <div
        className={
          !JSON.parse(currentUser).aadhar
            ? classes.userDet
            : classes.selfFinance
        }
      >
        <Card className={classes.card}>
          <div
            className={
              !JSON.parse(currentUser).aadhar
                ? classes.content
                : classes.selfFinanceContent
            }
          >
            {contentleft}
          </div>
        </Card>
      </div>
      <div>
        {contentright !== "" && (
          <div className={classes.userDetRight}>
            <Card className={classes.card}>
              <div className={classes.content}>
                <div>
                  <img
                    className={classes.profileIcon}
                    src={profileImage ? profileImage : defaultDPImage}
                  />
                  <header class={classes.header}>
                    Point of Contact Details
                  </header>
                </div>

                {contentright}
                <button
                  onClick={onDeleteClickHandler}
                  className={classes.button}
                >
                  Delete Account
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
export default FPProfileForm;

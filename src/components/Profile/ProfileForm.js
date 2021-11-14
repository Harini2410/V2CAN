import { useState } from "react";
import Card from "../UI/Card";
import ProfileAllBlogs from "./ProfileAllBlogs";
import classes from "./ProfileForm.module.css";
import { useHistory } from "react-router-dom";
const ProfileForm = (props) => {
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
  const name = JSON.parse(currentUser).name;
  const aadhar = JSON.parse(currentUser).aadhar;
  const email = JSON.parse(currentUser).email;
  const phone = JSON.parse(currentUser).phone;
  const interest = JSON.parse(currentUser).interest;
  const profileImage = JSON.parse(currentUser).profileImage;
  const defaultDPImage = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  return (
    <div>
      <div className={classes.userDet}>
        <Card className={classes.card}>
          <div className={classes.content}>
            <div>
              <img className={classes.profileIcon} src={profileImage?profileImage:defaultDPImage} />
              <header class={classes.header}>About You!</header>
            </div>
            <div className={classes.innercontent}>
              <div className={classes.label}> Name</div>
              <p className={classes.value}>{name}</p>
            </div>
            <div className={classes.innercontent}>
              <div className={classes.label}> Aadhar</div>
              <p className={classes.value}>{aadhar}</p>
            </div>
            <div className={classes.innercontent}>
              <div className={classes.label}> Email</div>
              <p className={classes.value}>{email}</p>
            </div>
            <div className={classes.innercontent}>
              <div className={classes.label}> Phone</div>
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
            {/* <div className={classes.innercontent}>
            <div className={classes.label}> Name</div>
            <p className={classes.value}>Charanya A G</p>
          </div> */}
            <button onClick={onDeleteClickHandler} className={classes.button}>
              Delete Account
            </button>
          </div>
        </Card>
      </div>
      <div>
        <ProfileAllBlogs></ProfileAllBlogs>
      </div>
    </div>
  );
};
export default ProfileForm;

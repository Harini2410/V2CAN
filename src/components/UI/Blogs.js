import Card from "./Card";
import classes from "./Blogs.module.css";
import Modal from "./Modal";
import { useState } from "react/cjs/react.development";

const Blogs = (props) => {
  const [showReadMoreModal, setShowReadMoreModal] = useState(false);
  const currentUser = localStorage.getItem("currentUser");
  const curUserKind = JSON.parse(currentUser).userKind;
  const curUserName = JSON.parse(currentUser).name;
  const curUserID = JSON.parse(currentUser).email.split("@")[0];
  const curUserPhone = JSON.parse(currentUser).pocPhone ? JSON.parse(currentUser).pocPhone : JSON.parse(currentUser).phone  
  const curUserEmail = JSON.parse(currentUser).pocEmail ? JSON.parse(currentUser).pocEmail : JSON.parse(currentUser).email
  const defaultDPImage =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  async function onColabHandler(event) {
    const message =
      curUserKind === "fundProvider"
        ? `The fund Provider "${curUserName}" finds your business idea "${props.title}" interesting and may be looking forward to fund your idea`
        : `The User "${curUserName}" finds your idea "${props.title}" interesting and is ready to colab`;

    const notificationDetails = {
      from: curUserID,
      to: props.userName,
      fromUserKind: curUserKind,
      message: message,
      fromPhone: curUserPhone,
      fromEmail: curUserEmail,
      blogConfig: {
        title: props.title,
        category: props.category,
        imageInput: props.img,
        shortDescription: props.shortDes,
        longDescription: props.longDes,
        userId: props.userName,
      },
    };
    event.preventDefault();
    const response = await fetch(
      "https://v2can-aac4a-default-rtdb.firebaseio.com/Notifications.json",
      {
        method: "POST",
        body: JSON.stringify(notificationDetails),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    props.setIsSuccess(true);
  }
  return (
    <div>
      {showReadMoreModal && (
        <Modal
          onClose={() => {
            setShowReadMoreModal(false);
          }}
          className={classes.readMoreModal}
          styleOverride={{ top: "20%", left: "30%" }}
        >
          <h3>{props.title}</h3>
          <h5>Category : {props.category}</h5>
          <div className={classes.longDesContainer}>{props.longDes}</div>
        </Modal>
      )}
      <Card className={props.cardClassName || classes.card}>
        <div className={props.contentClassName || classes.content}>
          <div className={classes.header}>
            <img
              className={classes.icon}
              src={props.profileImage ? props.profileImage : defaultDPImage}
              alt="DP"
            />{" "}
            <div className={classes.tu}>
              <header className={classes.title}>{props.title}</header>
              <div className={classes.uname}>{props.userName}</div>
            </div>
            {curUserKind === "entrepreneur" ? (
              <button className={classes.colab} onClick={onColabHandler}>
                Colab
              </button>
            ) : (
              <button className={classes.interested} onClick={onColabHandler}>
                Interested
              </button>
            )}
          </div>
          <img className={classes.image} src={props.img} alt="Blog" />
          <div className={classes.shortDesc}>
            {props.shortDes}
            <div
              className={classes.readMore}
              onClick={() => {
                setShowReadMoreModal(true);
              }}
            >
              Read more
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Blogs;

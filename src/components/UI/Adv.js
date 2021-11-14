import Card from "./Card";
import classes from "./Blogs.module.css";
import Modal from "./Modal";
import { useState } from "react/cjs/react.development";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTrashAlt} from "@fortawesome/free-solid-svg-icons";
const Adv = (props) => {
  const [showReadMoreModal, setShowReadMoreModal] = useState(false);
  const currentUser = localStorage.getItem("currentUser");
  const userKind = (currentUser && JSON.parse(currentUser).userKind);
  const defaultDPImage = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  async function singleAdvDelete(advId) {
    try {
      let response = await fetch(
        `https://v2can-aac4a-default-rtdb.firebaseio.com/Advertisements/${advId}.json`,
        {
          method: "DELETE",
        }
      );
    } catch (errornew) {
      console.log(errornew.message);
    }
    props.allBlogsFetch();
  }

  const deleteClickHandler = () => {
    singleAdvDelete(props.advId);
  };
  return (
    <div>
      {showReadMoreModal && (
        <Modal
          onClose={()=>{setShowReadMoreModal(false)}}
          className={classes.readMoreModal}
          styleOverride={{"top":"20%", "left":"30%"}}
        >
          <h3>{props.title}</h3>
          <h5>Category     : {props.category}</h5>
          <h5>Phone number : {props.phoneNum}</h5>
          <h5>Email        : {props.email}</h5>
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
            {userKind==="admin"&&<button
              className={classes.deletebtn}
              onClick={deleteClickHandler}
              style={{padding: "10px", border: "white" }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>}
          </div>
          <img className={classes.image} src={props.img} alt="Blog" />
          <div className={classes.shortDesc}>
            {props.shortDes}
            <div className={classes.readMore} onClick={()=>{setShowReadMoreModal(true)}}>
              Read more
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Adv;

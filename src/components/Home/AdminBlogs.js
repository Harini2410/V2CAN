import Card from "../UI/Card";
import classes from "./AdminBlogs.module.css";
import Modal from "../UI/Modal";
import { useState, useRef } from "react/cjs/react.development";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const _ = require("lodash");
const AdminBlogs = (props) => {
  const [showReadMoreModal, setShowReadMoreModal] = useState(false);
  const defaultDPImage =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  const { allBlogsFetch } = props;

  async function singleBlogDelete(blogId) {
    try {
      let response = await fetch(
        `https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs/${blogId}.json`,
        {
          method: "DELETE",
        }
      );
    } catch (errornew) {
      console.log(errornew.message);
    }
    allBlogsFetch();
  }

  const deleteClickHandler = () => {
    singleBlogDelete(props.blogId);
  };

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
              alt="Display"
            />{" "}
            <div className={classes.tu}>
              <header className={classes.title}>{props.title}</header>
              <div className={classes.uname}>{props.userName}</div>
            </div>
            <button
              className={classes.colab}
              onClick={deleteClickHandler}
              style={{ padding: "10px", border: "white" }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
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
export default AdminBlogs;

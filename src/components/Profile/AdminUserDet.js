import classes from "./AdminUserDet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const AdminUserDet = (props) => {
  const defaultDPImage =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  async function userDelete() {
    try {
      let response = await fetch(
        `https://v2can-aac4a-default-rtdb.firebaseio.com/User/${props.userId}.json`,
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
        if (data[key].userId === props.userId) {
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
    setTimeout(() => {
      props.allUserFetch();
    }, 300);
  };
  return (
    <div className={classes.outer}>
      <img
        className={classes.img}
        src={props.profileImage ? props.profileImage : defaultDPImage}
      />
      <div className={classes.rightOuter}>
        <div className={classes.innerContent}>
          <label>Name</label>
          <p> {props.name}</p>
        </div>
        <div className={classes.innerContent}>
          <label>Email</label>
          <p> {props.email} </p>
        </div>
        <div className={classes.innerContent}>
          <label>Phone</label>
          <p>{props.phone}</p>
        </div>
        <div className={classes.innerContent}>
          <label>User Kind</label>
          <p>{props.userKind}</p>
        </div>
      </div>
      <button
        className={classes.colab}
        onClick={onDeleteClickHandler}
        style={{ marginLeft: "5px", padding: "10px", border: "white" }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
};
export default AdminUserDet;

import classes from "./AdminProfile.module.css";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import AdminUserDet from "./AdminUserDet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
const AdminProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState([]);

  const allUserFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/User.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const UserList = [];
      for (const key in data) {
        if (
          data[key].userConfig.userKind === "fundProvider" &&
          data[key].userConfig.aadhar
        ) {
          const singleUser = {
            userId: key,
            name: data[key].userConfig.name,
            email: data[key].userConfig.email,
            phone: data[key].userConfig.phone,
            userKind: data[key].userConfig.userKind,
            profileImage: data[key].userConfig.profileImage,
          };
          UserList.push(singleUser);
        } else if (data[key].userConfig.userKind === "fundProvider") {
          const singleUser = {
            userId: key,
            name: data[key].userConfig.name,
            email: data[key].userConfig.pocEmail,
            phone: data[key].userConfig.pocPhone,
            userKind: data[key].userConfig.userKind,
            profileImage: data[key].userConfig.profileImage,
          };
          UserList.push(singleUser);
        } else if (data[key].userConfig.userKind === "entrepreneur") {
          const singleUser = {
            userId: key,
            name: data[key].userConfig.name,
            email: data[key].userConfig.email,
            phone: data[key].userConfig.phone,
            userKind: data[key].userConfig.userKind,
            profileImage: data[key].userConfig.profileImage,
          };
          UserList.push(singleUser);
        }
      }
      setUser(UserList);
    } catch (errornew) {
      console.log(errornew.message);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    allUserFetch();
  }, [allUserFetch]);
  return (
    <div className={classes.container}>
      
      <header className={classes.notificationHeaderText}><FontAwesomeIcon icon={faUserCircle} /><div style={{marginRight:"350px",float:"right"}}>Users List</div></header>
      {isLoading && (
        <div
          style={{
            backgroundColor: "white",
            width: "55px",
            alignContent: "center",
            margin: "20px",
            marginLeft: "45%",
            opacity: "25%",
            borderRadius: "20px",
          }}
        >
          <LoadingSpinner />
        </div>
      )}
      {user.map((item) => (
        <AdminUserDet
          name={item.name}
          key={item.userId}
          userId={item.userId}
          email={item.email}
          phone={item.phone}
          userKind={item.userKind}
          profileImage={item.profileImage}
          allUserFetch={allUserFetch}
        />
      ))}
    </div>
  );
};
export default AdminProfile;

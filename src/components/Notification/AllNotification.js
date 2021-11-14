import classes from "./AllNotification.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import Modal from "../UI/Modal";

const AllNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showReadMoreModal, setShowReadMoreModal] = useState(false);
  const [showBlogDetails, setShowBlogDetails] = useState(false);
  const [currentNotificationConfig, setCurrentNotificationConfig] = useState(
    {}
  );

  const allNotificationsFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/Notifications.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const NotificationsList = [];
      for (const key in data) {
        const singleNotification = {
          id: key,
          ...data[key],
        };
        NotificationsList.push(singleNotification);
      }
      const currentUser = localStorage.getItem("currentUser");
      const userName = JSON.parse(currentUser).email.split("@")[0];
      const filteredNotificationsList = NotificationsList.filter((item) => {
        return item.to === userName;
      });
      const reversedFilteredNotificationsList =
        filteredNotificationsList.reverse();
      setNotifications(reversedFilteredNotificationsList);
    } catch (errornew) {
      console.log(errornew.message);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    allNotificationsFetch();
  }, [allNotificationsFetch]);
  return (
    <div className={classes.allnotification}>
      {showReadMoreModal && (
        <Modal
          onClose={() => {
            setShowReadMoreModal(false);
          }}
          className={classes.readMoreModal}
          styleOverride={{ top: "30%", left: "40%" }}
        >
          <h3>Contact Information</h3>
          <h5>Phone number : {currentNotificationConfig.fromPhone}</h5>
          <h5>Email : {currentNotificationConfig.fromEmail}</h5>
          <h6>
            Disclaimer: Please only use the provided information for productive
            purposes.Any misuse reported may result in your account being
            permanently banned..
          </h6>
        </Modal>
      )}
      {showBlogDetails && (
        <Modal
          onClose={() => {
            setShowBlogDetails(false);
          }}
          className={classes.blogDetailsModal}
          styleOverride={{ top: "15%", left: "30%" }}
        >
          <h3>{currentNotificationConfig.blogConfig.title}</h3>
          <h5>Category: {currentNotificationConfig.blogConfig.category}</h5>
          <h5 className={classes.shortDescription}>{currentNotificationConfig.blogConfig.shortDescription}</h5>
          <div className={classes.longDescription}><img className={classes.imageInput} src={currentNotificationConfig.blogConfig.imageInput}/>{currentNotificationConfig.blogConfig.longDescription}</div>
        </Modal>
      )}
      <div className={classes.notificationContainer}>
        <div className={classes.notificationHeader}>
          <FontAwesomeIcon icon={faBell} className={classes.globeIcon} />
          <div className={classes.notificationHeaderText}>
            Your Notifications!
          </div>
        </div>
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
        {notifications.map((items) => (
          <>
            <div
              className={
                items.fromUserKind === "entrepreneur"
                  ? classes.notifications_entrepreneur
                  : classes.notifications_fundProvider
              }
            >
              {items.message}
              <div>
                <div
                  className={classes.readMore}
                  onClick={() => {
                    setCurrentNotificationConfig(items);
                    setShowReadMoreModal(true);
                  }}
                >
                  Contact Details
                </div>
                {items.fromUserKind === "entrepreneur" && (
                  <div
                    className={classes.readMore}
                    onClick={() => {
                      setCurrentNotificationConfig(items);
                      setShowBlogDetails(true);
                    }}
                  >
                    Business idea
                  </div>
                )}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
export default AllNotification;

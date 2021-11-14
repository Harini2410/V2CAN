import { NavLink } from "react-router-dom";
import classes from "./MainHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBell,
  faPlus,
  faAd,
  faShoppingCart,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./UI/Button";
import { useHistory } from "react-router-dom";
import { useState } from "react/cjs/react.development";

const MainHeader = (props) => {
  const { isLoggedIn, setLoggedInState } = props;
  const currentUser = localStorage.getItem("currentUser")||"{}";
  const userKind = JSON.parse(currentUser).userKind;
  const history = useHistory();
  const logOutHandler = (event) => {
    event.preventDefault();
    localStorage.setItem("isLoggedIn", false);
    setLoggedInState();
    history.push({ pathname: "/login" });
  };

  return (
    <header className={classes.header}>
      <img alt="Logo" className={classes.img} src="/FirstPageLogo.jpg"/>
      <img className={classes.logo} src="/Heading.png"/>
      {isLoggedIn !== "false" && (
        <>
          <nav className={classes.nav}>
            <ul>
              <li>
                <NavLink activeClassName={classes.active} to="/home">
                  <FontAwesomeIcon icon={faHome} />
                </NavLink>
              </li>
              {!(userKind==="admin")&&
              <li>
                <NavLink activeClassName={classes.active} to="/notification">
                  <FontAwesomeIcon icon={faBell} />
                </NavLink>
              </li>}
              {userKind === "entrepreneur" && (
                <li>
                  <NavLink activeClassName={classes.active} to="/new-Blog">
                    <FontAwesomeIcon icon={faPlus} />
                  </NavLink>
                </li>
              )}
              {userKind === "entrepreneur" && (
                <li>
                  <NavLink activeClassName={classes.active} to="/new-ad">
                    <FontAwesomeIcon icon={faAd} />
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink activeClassName={classes.active} to="/advertisement">
                  <FontAwesomeIcon icon={faShoppingCart} />
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName={classes.active} to="/profile">
                  <FontAwesomeIcon icon={faUserCircle} />
                </NavLink>
              </li>
            </ul>
          </nav>
          <Button className={classes.logout} onClick={logOutHandler}>
            Log out
          </Button>
        </>
      )}
    </header>
  );
};
export default MainHeader;

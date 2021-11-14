import { Fragment } from "react";
import ReactDOM from "react-dom";

import classes from "./FirstPageModal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div className={`${classes.modal}`} style={props.styleOverride}>
      <div className={`${classes.content} ${props.className}`}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("backdrop-root");

const FirstPageModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay className={props.className} styleOverride={{borderBottom: "solid 3px white"}}><img  className={classes.logo} alt="Poster" src="/VTooCanPoster.jpg"/></ModalOverlay>,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay className={props.className} styleOverride={props.styleOverride}><img onClick={props.onClose} alt="Logo" className={classes.img} src="/VTooCanLady.jpg"/></ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default FirstPageModal;

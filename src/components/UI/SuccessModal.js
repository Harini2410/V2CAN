import Modal from "./Modal";
import style from "./OtpModal.module.css";
import Button from "./Button";
import { useHistory } from "react-router-dom";

const SuccessModal = (props) => {
  const history = useHistory();
  const successModalHandler = () => {
    props.setIsSuccess(false);
    history.push({ pathname: props.redirectionPath });
  };

  return (
    <>
      <Modal className={style.modal}>
        <div style={{color:"#000"}}>{props.message}</div>
        <Button type="button" onClick={successModalHandler} styleOverRide={props.styleOverRide}>
          Close
        </Button>
      </Modal>
    </>
  );
};

export default SuccessModal;

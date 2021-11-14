import Modal from "./Modal";
import style from "./OtpModal.module.css"
import Button from "./Button";
import { useRef, useState } from "react";

const OtpModal = (props) => {
  const otpInputRef = useRef("");
  const [isError, setIsError] = useState(false);
  const { otpConfig, setOtpConfig } = props;
  const otpVerification = () => {
    const enteredOtp = otpInputRef.current.value;
    if (enteredOtp === otpConfig.otp) {
      setOtpConfig({
        showOtpModal: false,
        otp: "",
      });
    } else {
      setIsError(true);
    }
  };
  return (
    <>
      <Modal className={style.modal}>
        
        <input id="otp" type="otp" ref={otpInputRef} />
        {isError && <div id="otpError">Invalid OTP.Please verify the mail sent and enter valid OTP</div>}
        <Button type="button" onClick={otpVerification}>
          Verify OTP
        </Button>
      </Modal>
    </>
  );
};

export default OtpModal;

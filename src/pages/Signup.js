import { useState } from "react";
import UserKindMain from "../components/Signup/UserKindMain";
import EntAadharDetailsForm from "../components/Signup/EntAadharDetailsForm";
import FundProvSelectionForm from "../components/Signup/FundProvSelectionForm";
//import PasswordInterestDetailsForm from "../components/Signup/PasswordInterestDetails";
import ErrorModal from "../components/UI/ErrorModal";
import OtpModal from "../components/UI/OtpModal";
import VentureCapDetailsForm from "../components/Signup/VentureCapDetailsForm";
import BankDetailsForm from "../components/Signup/BankDetailsForm";
import SelfFinanceDetailsForm from "../components/Signup/SelfFinanceDetailsForm";
import SuccessModal from "../components/UI/SuccessModal";

const Signup = () => {
  const [showUserKind, setShowUserKind] = useState(true);
  const [showfPKind, setShowfPKind] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userKind, setUserKind] = useState("");
  const [fpKind, setfPKind] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess,setIsSuccess]=useState(false);
  const [errorConfig, setErrorConfig] = useState({
    isError: false,
    errorMessage: "",
  });
  const [otpConfig, setOtpConfig] = useState({
    otp: "",
    showOtpModal: false,
  });

  const onClick = (userType) => {
    console.log("ent clicked");
    setShowUserKind(false);
    setUserKind(userType);
  };

  const errorHandler = () => {
    setErrorConfig({ isError: false, errorMessage: "" });
  };

  const onFPTypeClick = (fPType) => {
    setShowfPKind(false);
    setfPKind(fPType);
  };

  return (
    <div>
      {errorConfig.isError && (
        <ErrorModal
          title="Verification Failed"
          message={errorConfig.errorMessage}
          onConfirm={errorHandler}
        />
      )}
      {isSuccess&&(<SuccessModal setIsSuccess={setIsSuccess} message="Account creation successful" redirectionPath="/login"/>)}
      {otpConfig.showOtpModal && (
        <OtpModal otpConfig={otpConfig} setOtpConfig={setOtpConfig} />
      )}
      {showUserKind ? (
        <UserKindMain onClickHandler={onClick} />
      ) : userKind === "entrepreneur" ? (
        <div>
          <EntAadharDetailsForm
            setIsLoading={setIsLoading}
            setShowPasswordForm={setShowPasswordForm}
            setErrorConfig={setErrorConfig}
            setOtpConfig={setOtpConfig}
            showPasswordForm={showPasswordForm}
            isLoading={isLoading}
            setIsSuccess={setIsSuccess}
          />
        </div>
      ) : showfPKind ? (
        <FundProvSelectionForm onClickHandler={onFPTypeClick} />
      ) : fpKind === "bank" ? (
        <BankDetailsForm
          setIsLoading={setIsLoading}
          setShowPasswordForm={setShowPasswordForm}
          setErrorConfig={setErrorConfig}
          setOtpConfig={setOtpConfig}
          showPasswordForm={showPasswordForm}
          isLoading={isLoading}
          setIsSuccess={setIsSuccess}

        />
      ) : fpKind === "ventureCapitalist" ? (
        <VentureCapDetailsForm
          setIsLoading={setIsLoading}
          setShowPasswordForm={setShowPasswordForm}
          setErrorConfig={setErrorConfig}
          setOtpConfig={setOtpConfig}
          showPasswordForm={showPasswordForm}
          isLoading={isLoading}
          setIsSuccess={setIsSuccess}
        />
      ) : (
        <SelfFinanceDetailsForm
          setIsLoading={setIsLoading}
          setShowPasswordForm={setShowPasswordForm}
          setErrorConfig={setErrorConfig}
          setOtpConfig={setOtpConfig}
          showPasswordForm={showPasswordForm}
          isLoading={isLoading}
          setIsSuccess={setIsSuccess}
        />
      )}
    </div>
  );
};
export default Signup;

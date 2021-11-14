import { useState } from "react";
import SuccessModal from "../components/UI/SuccessModal";
import CreateAdvertisementForm from "../components/CreateAdvertisement/CreateAdvertisementForm";
import ErrorModal from "../components/UI/ErrorModal";
const CreateAdvertisement = () => {
  const [errorConfig, setErrorConfig] = useState({
    isError: false,
    errorMessage: "",
  });
  const [isSuccess,setIsSuccess]=useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const errorHandler = () => {
    setErrorConfig({ isError: false, errorMessage: "" });
  };

  return (
    <>
      {errorConfig.isError && (
        <ErrorModal
          title="Verification Failed"
          message={errorConfig.errorMessage}
          onConfirm={errorHandler}
        />
      )}
      {
        isSuccess && <SuccessModal setIsSuccess={setIsSuccess} message="Advertisement is created successfully" redirectionPath="/home" styleOverRide={{marginLeft:"35%"}}/>
      }
      <CreateAdvertisementForm setErrorConfig={setErrorConfig} setIsSuccess={setIsSuccess} isLoading={isLoading} setIsLoading={setIsLoading}/>
    </>
  );
};
export default CreateAdvertisement;

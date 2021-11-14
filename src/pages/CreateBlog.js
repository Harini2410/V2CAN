import { useState } from "react";
import SuccessModal from "../components/UI/SuccessModal";
import CreateBlogForm from "../components/CreateBlog/CreateBlogForm";
import ErrorModal from "../components/UI/ErrorModal";
const CreateBlog = () => {
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
        isSuccess && <SuccessModal setIsSuccess={setIsSuccess} message="Your Business idea is created as a microblog successfully" redirectionPath="/home" styleOverRide={{marginLeft:"40%"}}/>
      }
      <CreateBlogForm setErrorConfig={setErrorConfig} setIsSuccess={setIsSuccess} isLoading={isLoading} setIsLoading={setIsLoading}/>
    </>
  );  
};
export default CreateBlog;

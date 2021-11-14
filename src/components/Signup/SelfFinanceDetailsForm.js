import { React, useRef } from "react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import classes from "./UserKindMain.module.css";
import styles from "./EntDetailsForm.module.css";
import Multiselect from "multiselect-react-dropdown";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useState } from "react/cjs/react.development";
import { sendEmail } from "../Helper/EmailHelper";
var CryptoJS = require("crypto-js");

const SelfFinanceDetailsForm = (props) => {
  const nameInputRef = useRef("");
  const emailInputRef = useRef("");
  const aadharInputRef = useRef("");
  const phoneInputRef = useRef("");
  const passwordInputRef = useRef("");
  const interestInputRef = useRef("");
  const imageInputRef = useRef("");

  const [profileImage, setProfileImage] = useState(null);
  const {
    setIsLoading,
    setShowPasswordForm,
    setErrorConfig,
    setOtpConfig,
    setIsSuccess,
  } = props;

  const encodeImageFile = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
      reader.onload = function () {
        const encodedImage = reader.result;
        setProfileImage(encodedImage);
      };
    } else {
      setProfileImage(null);
    }
  };

  function submitHandler(event) {
    event.preventDefault();

    let enteredDetails = {
      name: nameInputRef.current.value,
      email: emailInputRef.current.value,
      aadhar: aadharInputRef.current.value,
      phone: phoneInputRef.current.value,
    };

    console.log(enteredDetails);
    selfFinanceSigupVerification(enteredDetails);
  }
  async function selfFinanceSigupVerification(userDetails) {
    console.log(userDetails);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/Aadhar.json"
      );
      const userResponse = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/User.json"
      );
      if (!response.ok || !userResponse.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      const userData = await userResponse.json();

      const userName = emailInputRef.current.value.split("@")[0];
      const existingUser = userData[userName];
      const existingUserAadar = data[userDetails.aadhar];
      let validationResults = {
        isError: false,
        errorMessage: "",
      };
      if (existingUser) {
        validationResults.isError = true;
        validationResults.errorMessage =
          "An account for this email already exists";
      } else {
        if (existingUserAadar) {
          if (
            userDetails.phone !== existingUserAadar.phone &&
            userDetails.phone === ""
          ) {
            validationResults.isError = true;
            validationResults.errorMessage = "Give Valid Phone Number";
          }
          if (
            userDetails.name !== existingUserAadar.name &&
            userDetails.name === ""
          ) {
            validationResults.isError = true;
            validationResults.errorMessage = "Give Valid Name";
          }
          if (userDetails.email === "") {
            validationResults.isError = true;
            validationResults.errorMessage = "Give Valid Email";
          }
          if (!validationResults.isError) {
            //const otp = sendEmail(userDetails.name, userDetails.email);
            const otp = "123456";
            setOtpConfig({
              showOtpModal: true,
              otp: otp,
            });
          }
        } else {
          validationResults.isError = true;
          validationResults.errorMessage = "Invalid Aadhar Number";
        }
      }
      if (validationResults.isError) {
        setErrorConfig(validationResults);
        throw new Error(validationResults.errorMessage);
      } else {
        setShowPasswordForm(true);
      }
    } catch (errornew) {
      setErrorConfig({
        isError: true,
        errorMessage: errornew.message || "Something went wrong..",
      });
    }
    setIsLoading(false);
  }

  async function formSubmitHandler(event) {
    event.preventDefault();
    const userId = emailInputRef.current.value.split("@")[0];
    const interest = interestInputRef.current.getSelectedItems();
    const password = passwordInputRef.current.value;
    const imageInput = imageInputRef.current.files[0];
    let userDetails = {};
    let encryptedPassword = "";
    let validationResults = {
      isError: false,
      errorMessage: "",
    };
    const passwordRegularExpression =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (interest.length === 0) {
      validationResults.isError = true;
      validationResults.errorMessage = "Select atleast one interest";
    }
    if (password === "" || !passwordRegularExpression.test(password)) {
      validationResults.isError = true;
      validationResults.errorMessage =
        "Give a valid Password with 6 to 16 characters with alphabets, numbers and special characters";
    } else {
      encryptedPassword = CryptoJS.AES.encrypt(
        password,
        "my-secret-key@123"
      ).toString();
    }
    if (imageInput && !imageInput.type.match("image.*")) {
      validationResults.isError = true;
      validationResults.errorMessage = "Select a valid image file (.png,.jpg)";
    }
    if (validationResults.isError) {
      setErrorConfig(validationResults);
    } else {
      userDetails[userId] = {
        userConfig: {
          name: nameInputRef.current.value,
          email: emailInputRef.current.value,
          aadhar: aadharInputRef.current.value,
          phone: phoneInputRef.current.value,
          password: encryptedPassword,
          interest: interest,
          profileImage: profileImage,
          userKind: "fundProvider",
        },
      };
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/User.json",
        {
          method: "PATCH",
          body: JSON.stringify(userDetails),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setIsSuccess(true);
    }
  }

  return (
    <Card className={classes.card}>
      <header>Self Finance Verification</header>
      <div className={styles.input}>
        <form
          onSubmit={(event) => {
            formSubmitHandler(event);
          }}
        >
          <label htmlFor="name">Name(As in Aadhar)</label>
          <input id="name" type="text" ref={nameInputRef} />
          <label htmlFor="email">email</label>
          <input id="email" type="email" ref={emailInputRef} />
          <label htmlFor="aadhar">Aadhar Number</label>
          <input id="aadhar" type="text" ref={aadharInputRef} />
          <label htmlFor="phone">Phone Number(As in Aadhar)</label>
          <input id="phone" type="text" ref={phoneInputRef} />
          {props.showPasswordForm && (
            <>
              <div>
                <label htmlFor="imgUrl">Profile image</label>
                <input
                  id="imgUrl"
                  type="file"
                  ref={imageInputRef}
                  onChange={(e) => {
                    encodeImageFile(e);
                  }}
                />
                {profileImage && (
                  <div className={classes.imagePreviewContainer}>
                    <img src={profileImage} className={classes.previewImage} />
                  </div>
                )}
              </div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" ref={passwordInputRef} />
              <label htmlFor="Interest">Interest</label>
              <Multiselect
                id="css_custom"
                placeholder="Choose from options"
                ref={interestInputRef}
                isObject={false}
                avoidHighlightFirstOption={true}
                onRemove={function noRefCheck() {}}
                onSearch={function noRefCheck() {}}
                onSelect={function noRefCheck() {}}
                options={[
                  "Art",
                  "Automobile",
                  "Cosmetics",
                  "Education",
                  "Food",
                  "Gadgets",
                  "Health Care",
                  "Innovation",
                  "Invention",
                  "Jewellery",
                  "Marketing",
                  "Real Estate",
                  "Science",
                  "Technology",
                  "Telecommuication",
                  "Textiles",
                  "Transportation",
                ]}
                style={{
                  chips: {
                    background: "#e8f0fe",
                    color: "#00545f",
                  },
                  inputField: {
                    margin: "0px",
                    padding: "3px",
                  },
                  optionContainer: {
                    // To change css for option container
                    borderRadius: "2px",
                  },
                  option: {
                    background: "#e8f0fe",
                    color: "#00545f",
                  },
                  optionListContainer: {
                    width: "100%",
                  },
                  multiselectContainer: {
                    color: "black",
                    borderRadius: "2px",
                  },
                  searchBox: {
                    borderColor: "#00545f",
                    borderRadius: "8px",
                  },
                }}
              />
              <Button type="submit" className={classes.button}>
                Submit
              </Button>
            </>
          )}
          {!props.isLoading && !props.showPasswordForm && (
            <Button
              type="button"
              className={classes.button}
              onClick={submitHandler}
            >
              Verify email and Aadhar
            </Button>
          )}
          {props.isLoading && <LoadingSpinner />}
        </form>
      </div>
    </Card>
  );
};
export default SelfFinanceDetailsForm;

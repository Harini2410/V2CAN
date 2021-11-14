import { React, useRef } from "react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import classes from "./UserKindMain.module.css";
import styles from "./EntDetailsForm.module.css";
import Multiselect from "multiselect-react-dropdown";
import { useState } from "react/cjs/react.development";
import LoadingSpinner from "../UI/LoadingSpinner";
import { sendEmail } from "../Helper/EmailHelper";

//import { useHistory } from "react-router-dom";
import { VCList } from "../Helper/FundProviderListHelper";
var CryptoJS = require("crypto-js");
const VentureCapDetailsForm = (props) => {
  //const history = useHistory();
  const firmNameInputRef = useRef("");
  const branchInputRef = useRef("");
  const firmPhoneInputRef = useRef("");
  const pocNameInputRef = useRef("");
  const pocEmailInputRef = useRef("");
  const pocPhoneInputRef = useRef("");
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

  async function formSubmitHandler(event) {
    event.preventDefault();
    const userId = firmNameInputRef.current
      .getSelectedItems()[0]
      .email.split("@")[0];
    const interest = interestInputRef.current.getSelectedItems();
    const pocName = pocNameInputRef.current.value;
    const pocEmail = pocEmailInputRef.current.value;
    const pocPhone = pocPhoneInputRef.current.value;
    const password = passwordInputRef.current.value;
    const pocBranch = branchInputRef.current.value;
    const imageInput = imageInputRef.current.files[0];
    let validationResults = {
      isError: false,
      errorMessage: "",
    };
    let enteredDetails = {};
    let encryptedPassword = "";
    const passwordRegularExpression =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (interest.length === 0) {
      validationResults.isError = true;
      validationResults.errorMessage = "Select atleast one interest";
    }
    if (imageInput && !imageInput.type.match("image.*")) {
      validationResults.isError = true;
      validationResults.errorMessage = "Select a valid image file (.png,.jpg)";
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
    if (pocPhone === "" || pocPhone.length !== 10) {
      validationResults.isError = true;
      validationResults.errorMessage = "Give a valid Phone Number";
    }
    if (pocEmail === "") {
      validationResults.isError = true;
      validationResults.errorMessage = "Give a valid Email";
    }
    if (pocName === "") {
      validationResults.isError = true;
      validationResults.errorMessage = "Give a valid Name";
    }
    if (pocBranch === "") {
      validationResults.isError = true;
      validationResults.errorMessage = "Give a valid branch name";
    }
    if (validationResults.isError) {
      setErrorConfig(validationResults);
    } else {
      enteredDetails[userId] = {
        userConfig: {
          name: firmNameInputRef.current.getSelectedItems()[0].name,
          email: firmNameInputRef.current.getSelectedItems()[0].email,
          branch: branchInputRef.current.value,
          firmPhone: firmPhoneInputRef.current.value,
          pocName: pocName,
          pocEmail: pocEmail,
          pocPhone: pocPhone,
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
          body: JSON.stringify(enteredDetails),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsSuccess(true);
    }
  }
  function submitHandler(event) {
    event.preventDefault();
    let enteredDetails = {
      firmName: firmNameInputRef.current.value,
      branch: branchInputRef.current.value,
      firmPhone: firmPhoneInputRef.current.value,
      // pocName: pocNameInputRef.current.value,
      // pocEmail: pocEmailInputRef.current.value,
      // pocPhone: pocPhoneInputRef.current.value,
      // password: passwordInputRef.current.value,
      // interest: interestInputRef.current.value,
    };

    console.log(enteredDetails);
    bankSigupVerification(enteredDetails);
  }

  async function bankSigupVerification(userDetails) {
    console.log(userDetails);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/User.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      const selectedBank = firmNameInputRef.current.getSelectedItems()[0];
      const bankUserName = selectedBank.email.split("@")[0];
      const bankEmail = selectedBank.email;
      let validationResults = {
        isError: false,
        errorConfig: "",
      };

      console.log(selectedBank);

      if (data[bankUserName]) {
        validationResults.isError = true;
        validationResults.errorMessage =
          "An Account for this bank already exists";
      } else {
        // const otp = sendEmail(firmNameInputRef.current.getSelectedItems(), bankEmail);
        const phone = firmPhoneInputRef.current.value;
        if (phone === "" || phone.length !== 10) {
          validationResults.isError = true;
          validationResults.errorMessage = "Give a valid Phone Number";
        } else {
          setShowPasswordForm(true);
          const otp = "123456";
          setOtpConfig({
            showOtpModal: true,
            otp: otp,
          });
        }
      }
      setErrorConfig(validationResults);
    } catch (errornew) {
      setErrorConfig({
        isError: true,
        errorMessage: errornew.message || "Something went wrong..",
      });
    }
    setIsLoading(false);
  }
  return (
    <Card className={classes.card}>
      <header>Firm Details</header>
      <div className={styles.input}>
        <form
          onSubmit={(event) => {
            formSubmitHandler(event);
          }}
        >
          <label htmlFor="firmname">Firm Name</label>
          <Multiselect
            id="css_custom"
            placeholder="Select Firm name"
            ref={firmNameInputRef}
            isObject={true}
            singleSelect={true}
            avoidHighlightFirstOption={true}
            onRemove={function noRefCheck() {}}
            onSearch={function noRefCheck() {}}
            onSelect={function noRefCheck() {}}
            options={VCList}
            displayValue="name"
            style={{
              chips: {
                background: "white",
                width: "100%",
                color: "#00545f",
              },
              inputField: {
                margin: "0px",
                padding: "4px",
              },
              optionListContainer: {
                width: "100%",
              },
              optionContainer: {
                borderRadius: "2px",
              },
              option: {
                background: "#e8f0fe",
                color: "#00545f",
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

          <label htmlFor="firmphone">Firm Phone Number</label>
          <input id="phone" type="text" ref={firmPhoneInputRef} />
          {props.showPasswordForm && (
            <>
              <h3>Point Of Contact Details</h3>
              <label htmlFor="branch">Branch</label>
              <input id="branch" type="branch" ref={branchInputRef} />

              <label htmlFor="pocname">Name</label>
              <input id="pocname" type="pocname" ref={pocNameInputRef} />
              <label htmlFor="pocemail">Email</label>
              <input id="pocemail" type="pocemail" ref={pocEmailInputRef} />
              <label htmlFor="pocphone">Phone</label>
              <input id="pocphone" type="pocphone" ref={pocPhoneInputRef} />
              <label htmlFor="password">Password</label>
              <input id="password" type="password" ref={passwordInputRef} />
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
              <label htmlFor="Interest">Interest</label>
              <Multiselect
                id="css_custom"
                placeholder="Choose from options"
                avoidHighlightFirstOption={true}
                ref={interestInputRef}
                isObject={false}
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
                  multiselectContainer: {
                    color: "black",
                    borderRadius: "2px",
                  },
                  optionListContainer: {
                    width: "100%",
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
              Email Verification
            </Button>
          )}
          {props.isLoading && <LoadingSpinner />}
        </form>
      </div>
    </Card>
  );
};
export default VentureCapDetailsForm;

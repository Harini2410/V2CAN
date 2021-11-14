import Modal from "../UI/Modal";
import style from "./FundProviderListForm.module.css";
import Button from "../UI/Button";
import { useRef, useState } from "react";
import Multiselect from "multiselect-react-dropdown";

const FundProviderListForm = (props) => {
  const fundProviderInputRef = useRef("");
  const [isError, setIsError] = useState(false);
  async function onShareHandler(event) {
    const selectedFP = fundProviderInputRef.current.getSelectedItems();
    const currentUser = localStorage.getItem("currentUser");
    const curUserKind = JSON.parse(currentUser).userKind;
    const curUserName = JSON.parse(currentUser).name;
    const curUserID = JSON.parse(currentUser).email.split("@")[0];
    const message = `The User "${curUserName}" have shared the idea "${props.title}" for you to look into`;
    const fromPhone = JSON.parse(currentUser).phone;
    const fromEmail = JSON.parse(currentUser).email;
    for (const fP in selectedFP) {
      const notificationDetails = {
        from: curUserID,
        to: selectedFP[fP].userId,
        fromUserKind: curUserKind,
        message: message,
        fromPhone: fromPhone,
        fromEmail: fromEmail,
        blogConfig: props.blogConfig
      };
      event.preventDefault();
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/Notifications.json",
        {
          method: "POST",
          body: JSON.stringify(notificationDetails),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    props.setShowFundProviderList(false);
    props.setIsSuccess(true);
  }
  return (
    <>
      <Modal
        className={style.modal}
        styleOverride={{ left: "calc(45% - 10rem)" }}
        onClose={() => {
          props.setShowFundProviderList(false);
        }}
      >
        <header className={style.header}>Select Fund Providers to share</header>
        <Multiselect
          id="css_custom"
          placeholder="Choose from options"
          ref={fundProviderInputRef}
          isObject={true}
          singleSelect={false}
          avoidHighlightFirstOption={true}
          onRemove={function noRefCheck() {}}
          onSearch={function noRefCheck() {}}
          onSelect={function noRefCheck() {}}
          options={props.FPList}
          displayValue="name"
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
              marginBottom: "20px",
            },
            searchBox: {
              borderColor: "#00545f",
              borderRadius: "8px",
            },
          }}
        />
        {isError && <div id="otpError">Please select atleast one</div>}
        <Button type="button" onClick={onShareHandler}>
          Share
        </Button>
      </Modal>
    </>
  );
};

export default FundProviderListForm;

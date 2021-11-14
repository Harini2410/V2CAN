import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";
import Button from "../UI/Button";
import classes from "./ProfileBlogs.module.css";
import Modal from "../UI/Modal";
import { useState, useRef } from "react/cjs/react.development";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faShare } from "@fortawesome/free-solid-svg-icons";
import SuccessModal from "../UI/SuccessModal";
import Multiselect from "multiselect-react-dropdown";
import FundProviderListForm from "../EditBlog/FundProviderListForm";
const _ = require("lodash");
const ProfileBlogs = (props) => {
  const [showReadMoreModal, setShowReadMoreModal] = useState(false);
  const [showFundProviderList, setShowFundProviderList] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fundProviderList, setFundProviderList] = useState([]);
  const defaultDPImage =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  const shortDescInputRef = useRef("");
  const interestInputRef = useRef("");
  const longDescInputRef = useRef("");
  const titleInputRef = useRef("");
  const imageInputRef = useRef("");
  const {
    title,
    shortDes,
    longDes,
    img,
    userName,
    category,
    blogId,
    allBlogsFetch,
  } = props;

  const [blogConfig, setBlogConfig] = useState({
    title: title,
    category: category,
    imageInput: img,
    shortDescription: shortDes,
    longDescription: longDes,
    userId: userName,
  });

  const onEditHandler = (key, value) => {
    let editedBlogConfig = _.clone(blogConfig);
    editedBlogConfig[key] = value;
    setBlogConfig(editedBlogConfig);
  };

  async function blogDBHandler(enteredBlogDetails) {
    const response = await fetch(
      `https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs/${blogId}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(enteredBlogDetails),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setIsLoading(false);
    setShowEditModal(false);
    allBlogsFetch();
  }
  const blogSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (blogConfig.longDescription === "") {
      onEditHandler("longDescription", props.longDes);
    }
    if (blogConfig.shortDescription === "") {
      onEditHandler("shortDescription", props.shortDes);
    }
    if (!blogConfig.imageInput) {
      onEditHandler("category", props.img);
    }
    if (blogConfig.category.length === 0) {
      onEditHandler("category", props.category);
    }
    if (blogConfig.title === "") {
      onEditHandler("title", props.title);
    }
    blogDBHandler(blogConfig);
  };
  async function singleBlogDelete(blogId) {
    try {
      let response = await fetch(
        `https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs/${blogId}.json`,
        {
          method: "DELETE",
        }
      );
    } catch (errornew) {
      console.log(errornew.message);
    }
    setIsLoading(false);
    allBlogsFetch();
  }
  async function fetchFPHandler() {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/User.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const FPList = [];
      for (const key in data) {
        if (data[key].userConfig.userKind === "fundProvider") {
          const singleFP = {
            userId: key,
            ...data[key].userConfig,
          };
          FPList.push(singleFP);
        }
      }
      setFundProviderList(FPList);
    } catch (errornew) {
      console.log(errornew.message);
    }
    setIsLoading(false);
  }
  const editClickHandler = () => {
    setShowEditModal(true);
  };
  const deleteClickHandler = () => {
    singleBlogDelete(props.blogId);
  };
  const shareClickHandler = () => {
    fetchFPHandler();
    setShowFundProviderList(true);
  };
  const encodeImageFile = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
      reader.onload = function () {
        const encodedImage = reader.result;
        onEditHandler("imageInput", encodedImage);
      };
    } else {
      onEditHandler("imageInput", null);
    }
  };
  return (
    <div>
      {showEditModal && (
        <Modal
          onClose={() => {
            setShowEditModal(false);
          }}
          className={classes.readMoreModal}
          styleOverride={{ top: "10%", left: "30%" }}
        >
          <div>
            <Card className={`${classes.cardEditBlog}`}>
              <div className={classes.input}>
                <form onSubmit={blogSubmitHandler}>
                  <label htmlFor="Title">Title</label>
                  <input
                    id="name"
                    type="text"
                    value={blogConfig.title}
                    ref={titleInputRef}
                    onInput={(event) => {
                      onEditHandler("title", event.target.value);
                    }}
                  />
                  <label htmlFor="category">Category</label>
                  <Multiselect
                    id="css_custom"
                    placeholder="Choose from options"
                    ref={interestInputRef}
                    isObject={false}
                    singleSelect={true}
                    avoidHighlightFirstOption={true}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={(selectedList, selectedItem) => {
                      onEditHandler("category", selectedItem);
                    }}
                    selectedValues={[props.category]}
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
                  <label htmlFor="imgUrl">Image</label>
                  <div>
                    <input
                      id="imgUrl"
                      type="file"
                      onChange={(e) => {
                        encodeImageFile(e);
                      }}
                    />
                    {blogConfig.imageInput && (
                      <div className={classes.imagePreviewContainer}>
                        <img
                          src={blogConfig.imageInput}
                          className={classes.previewImage}
                          ref={imageInputRef}
                        />
                      </div>
                    )}
                  </div>
                  <label htmlFor="shortDescription">Short Description</label>
                  <textarea
                    className={classes.shortDes}
                    id="shortDescription"
                    type="shortDescription"
                    ref={shortDescInputRef}
                    value={blogConfig.shortDescription}
                    onInput={(event) => {
                      onEditHandler("shortDescription", event.target.value);
                    }}
                  />
                  <label htmlFor="longDesc">Long Description</label>
                  <textarea
                    id="longDesc"
                    type="longDesc"
                    ref={longDescInputRef}
                    className={classes.longDes}
                    value={blogConfig.longDescription}
                    onInput={(event) => {
                      onEditHandler("longDescription", event.target.value);
                    }}
                  ></textarea>
                  <Button type="submit" className={classes.button}>
                    Submit
                  </Button>
                  {isLoading && <LoadingSpinner />}
                </form>
              </div>
            </Card>
          </div>
        </Modal>
      )}
      {showReadMoreModal && (
        <Modal
          onClose={() => {
            setShowReadMoreModal(false);
          }}
          className={classes.readMoreModal}
          styleOverride={{ top: "20%", left: "30%" }}
        >
          <h3>{props.title}</h3>
          <h5>Category : {props.category}</h5>
          <div className={classes.longDesContainer}>{props.longDes}</div>
        </Modal>
      )}
      {isSuccess && (
        <SuccessModal
          message="Your business idea is shared to fund provider selected"
          setIsSuccess={setIsSuccess}
          redirectionPath="/profile"
          styleOverRide={{ marginLeft: "40%" }}
        />
      )}
      {showFundProviderList && (
        <FundProviderListForm
          FPList={fundProviderList}
          title={props.title}
          setShowFundProviderList={setShowFundProviderList}
          setIsSuccess={setIsSuccess}
          blogConfig={blogConfig}
        />
      )}

      <Card className={props.cardClassName || classes.card}>
        <div className={props.contentClassName || classes.content}>
          <div className={classes.header}>
            <img
              className={classes.icon}
              src={props.profileImage ? props.profileImage : defaultDPImage}
              alt="Display"
            />{" "}
            <div className={classes.tu}>
              <header className={classes.title}>{props.title}</header>
              <div className={classes.uname}>{props.userName}</div>
            </div>
            <button
              className={classes.colab}
              onClick={editClickHandler}
              style={{ marginLeft: "0px", padding: "10px", border: "white" }}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className={classes.colab}
              onClick={deleteClickHandler}
              style={{ marginLeft: "5px", padding: "10px", border: "white" }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
            <button
              className={classes.colab}
              onClick={shareClickHandler}
              style={{ marginLeft: "5px", padding: "10px", border: "white" }}
            >
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
          <img className={classes.image} src={props.img} alt="Blog" />
          <div className={classes.shortDesc}>
            {props.shortDes}
            <div
              className={classes.readMore}
              onClick={() => {
                setShowReadMoreModal(true);
              }}
            >
              Read more
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default ProfileBlogs;

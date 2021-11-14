import Card from "../UI/Card";
import Button from "../UI/Button";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useRef } from "react";
import classes from "./CreateBlogForm.module.css";
import Multiselect from "multiselect-react-dropdown";
import { useState } from "react/cjs/react.development";
const CreateBlogForm = (props) => {
  const shortDescInputRef = useRef("");
  const interestInputRef = useRef("");
  const longDescInputRef = useRef("");
  const titleInputRef = useRef("");
  const imageInputRef = useRef("");
  const [blogImage, setBlogImage] = useState(null);
  const { setIsSuccess, setIsLoading, isLoading } = props;

  async function blogDBHandler(enteredBlogDetails) {
    const response = await fetch(
      "https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs.json",
      {
        method: "POST",
        body: JSON.stringify(enteredBlogDetails),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setIsLoading(false);
    setIsSuccess(true);
  }
  const blogSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const title = titleInputRef.current.value;
    const category = interestInputRef.current.getSelectedItems();
    const shortDescription = shortDescInputRef.current.value;
    const longDescription = longDescInputRef.current.value;
    const imageInput = imageInputRef.current.files[0];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser.email.split("@")[0];
    const userProfilePicture = currentUser.profileImage;
    let enteredBlogDetails = {};
    let validationResults = {
      isError: false,
      errorMessage: "",
    };
    if (longDescription === "") {
      validationResults.isError = true;
      validationResults.errorMessage = "Give Valid Long Description";
    }
    if (shortDescription === "") {
      validationResults.isError = true;
      validationResults.errorMessage = "Give Valid Short Description";
    }
    if (!imageInput) {
      validationResults.isError = true;
      validationResults.errorMessage = "Select an image file";
    } else if (!imageInput.type.match("image.*")) {
      validationResults.isError = true;
      validationResults.errorMessage = "Select a valid image file (.png,.jpg)";
    }
    if (category.length === 0) {
      validationResults.isError = true;
      validationResults.errorMessage = "Select one category";
    }
    if (title === "") {
      validationResults.isError = true;
      validationResults.errorMessage = "Give Valid Title";
    }
    if (validationResults.isError) {
      props.setErrorConfig(validationResults);
    } else {
      enteredBlogDetails = {
        title: titleInputRef.current.value,
        category: interestInputRef.current.getSelectedItems()[0],
        shortDescription: shortDescInputRef.current.value,
        longDescription: longDescInputRef.current.value,
        imageInput: blogImage,
        userId: userId,
        profileImage: userProfilePicture,
      };
      blogDBHandler(enteredBlogDetails);
    }
  };

  const encodeImageFile = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
      reader.onload = function () {
        const encodedImage = reader.result;
        setBlogImage(encodedImage);
      };
    } else {
      setBlogImage(null);
    }
  };

  return (
    <div>
      <Card className={`${classes.card} ${classes.cardBorder}`}>
        <div className={classes.input}>
          <form onSubmit={blogSubmitHandler}>
            <header>Create a microblog of your Business idea!</header>
            <label htmlFor="Title">Title</label>
            <input id="name" type="text" ref={titleInputRef} />

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
                ref={imageInputRef}
                onChange={(e) => {
                  encodeImageFile(e);
                }}
              />
              {blogImage && (
                <div className={classes.imagePreviewContainer}>
                  <img src={blogImage} className={classes.previewImage} />
                </div>
              )}
            </div>
            <label htmlFor="shortDescription">Short Description</label>
            <textarea
              className={classes.shortDes}
              id="shortDescription"
              type="shortDescription"
              ref={shortDescInputRef}
            />
            <label htmlFor="longDesc">Long Description</label>
            <textarea
              id="longDesc"
              type="longDesc"
              ref={longDescInputRef}
              className={classes.longDes}
            ></textarea>
            <Button type="submit" className={classes.button}>
              Submit
            </Button>
            {isLoading && <LoadingSpinner />}
          </form>
        </div>
      </Card>
    </div>
  );
};
export default CreateBlogForm;

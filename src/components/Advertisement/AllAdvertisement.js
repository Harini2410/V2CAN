import Adv from "../UI/Adv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
//import { BlogsList } from "../Helper/FundProviderListHelper";
import classes from "./AllAdvertisement.module.css";
import { useCallback, useEffect, useState, useRef } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import Multiselect from "multiselect-react-dropdown";

const AllAdvertisement = (props) => {
  const interestInputRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [interest, setInterest] = useState([
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
  ]);
  const onSelect = () => {
    setInterest(interestInputRef.current.getSelectedItems());
    allBlogsFetch();
  };
  const allBlogsFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/Advertisements.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const BlogsList = [];
      for (const key in data) {
        const singleBlog = {
          id: key,
          ...data[key],
        };
        BlogsList.push(singleBlog);
      }
      //const currentUser = localStorage.getItem("currentUser");
      //const userInterest = JSON.parse(currentUser).interest;

      const filteredBlogsList = BlogsList.filter((item) => {
        return interest.includes(item.category);
      });
      setBlogs(filteredBlogsList);
    } catch (errornew) {
      console.log(errornew.message);
    }
    setIsLoading(false);
  }, [interest]);
  useEffect(() => {
    allBlogsFetch();
  }, [allBlogsFetch, interest]);
  return (
    <div>
      <div>
        <Multiselect
          id="css_custom"
          placeholder="Type Category"
          avoidHighlightFirstOption={true}
          isObject={false}
          ref={interestInputRef}
          hidePlaceholder={true}
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
            optionListContainer: {
              paddingRight: "10px",
              width: "450px",
            },
            optionContainer: {
              // To change css for option container
              borderRadius: "2px",
              width: "450px",
            },
            option: {
              background: "#e8f0fe",
              color: "#00545f",
            },
            multiselectContainer: {
              color: "black",
              borderRadius: "2px",
              width: "60%",
              innerHeight: "30px",
              float: "left",
              paddingLeft: "30%",
              paddingRight: "10px",
              marginTop: "20px",
            },
            searchBox: {
              border: "solid 3px #008080",
              borderRadius: "8px",
              marginBottom: "10px",
              width: "100%",
            },
          }}
        />
        <button
          style={{
            width: "70px",
            marginTop: "20px",
            alignItems: "center",
            border: "solid 3px #008080",
            padding: "0.5rem 1.5rem",
          }}
          onClick={onSelect}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <div className={props.className}>
        <div className={classes.blogsContainer}>
          {isLoading && (
            <div
              style={{
                backgroundColor: "white",
                width: "55px",
                alignContent: "center",
                margin: "20px",
                marginLeft: "45%",
                opacity: "25%",
                borderRadius: "20px",
              }}
            >
              <LoadingSpinner />
            </div>
          )}
          {blogs.map((item) => (
            <Adv
              title={item.title}
              userName={item.userId}
              img={item.imageInput}
              profileImage={item.profileImage}
              shortDes={item.shortDescription}
              longDes={item.longDescription}
              key={item.id}
              advId={item.id}
              category={item.category}
              phoneNum={item.phoneNum}
              email={item.email}
              cardClassName={classes.card}
              contentClassName={classes.content}
              allBlogsFetch={allBlogsFetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AllAdvertisement;

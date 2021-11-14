import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./AdminHome.module.css";
import { useCallback, useEffect, useState } from "react";
import SuccessModal from "../UI/SuccessModal";
import AdminBlogs from "./AdminBlogs";

const AdminHome = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

const allBlogsFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs.json"
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
    setBlogs(BlogsList);
    } catch (errornew) {
      console.log(errornew.message);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    allBlogsFetch();
  }, [allBlogsFetch]);

  return (
    <div className={classes.contentOuter}>
      <div className={classes.blogsContainerClassName || classes.blogsContainer}>
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
        {blogs.map(
          (item) =>
            <AdminBlogs
            title={item.title}
            userName={item.userId}
            img={item.imageInput}
            shortDes={item.shortDescription}
            longDes={item.longDescription}
            key={item.id}
            blogId={item.id}
            category={item.category}
            cardClassName={props.cardClassName}
            contentClassName={props.contentClassName}
            allBlogsFetch={allBlogsFetch}
            profileImage={item.profileImage}
          />
        )}
      </div>
    </div>
  );
};
export default AdminHome;

import Blogs from "../UI/Blogs";
//import { BlogsList } from "../Helper/FundProviderListHelper";
import classes from "./AllBlogs.module.css"
import { useCallback ,useEffect,useState} from "react";
import LoadingSpinner from "../UI/LoadingSpinner";


const AllBlogs = (props) => {

const [isLoading, setIsLoading] = useState(false);
const[blogs,setBlogs]=useState([]);

const allBlogsFetch=useCallback(async()=> {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://v2can-aac4a-default-rtdb.firebaseio.com/Blogs.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const BlogsList=[];
      for (const key in data) {
        const singleBlog = {
          id: key,
          ...data[key],
        };
        BlogsList.push(singleBlog);
      }
      const currentUser=localStorage.getItem("currentUser");
      const userInterest=JSON.parse(currentUser).interest
      const filteredBlogsList= BlogsList.filter((item)=>{return(userInterest.includes(item.category))})
      setBlogs(filteredBlogsList);
    } catch (errornew) {
      console.log(errornew.message)
    }
    setIsLoading(false);
  },[])
  useEffect(() => {
    allBlogsFetch();
  },[allBlogsFetch]);
  return (
    <div className={props.className}>
      <div className={props.blogsContainerClassName || classes.blogsContainer}>
        {isLoading&&<div style={{backgroundColor:"white",width:"55px",alignContent:"center",margin:"20px",marginLeft:"45%",opacity:"25%",borderRadius:"20px"}} ><LoadingSpinner/></div>}
        {blogs.map((item) => (
          <Blogs
            title={item.title}
            userName={item.userId}
            profileImage={item.profileImage}
            img={item.imageInput}
            shortDes={item.shortDescription}
            longDes={item.longDescription}
            key={item.id}
            category={item.category}
            cardClassName={props.cardClassName}
            contentClassName={props.contentClassName}
            setIsSuccess={props.setIsSuccess}
          />
        ))}
      </div>
    </div>
  );
};
export default AllBlogs;

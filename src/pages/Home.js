//import AllBlogs from "../components/Home/AllBlogs";
import AdminHome from "../components/Home/AdminHome";
import EntHome from "../components/Home/EntHome";
import FundProviderHome from "../components/Home/FundProviderHome";
//import Blogs from "../components/UI/Blogs";

const Home = () => {
  const currentUser = localStorage.getItem("currentUser");
  const userKind = (currentUser && JSON.parse(currentUser).userKind) || null;
  return (
    <div>
      {userKind==="entrepreneur"&&<EntHome />}
      {userKind==="fundProvider"&&<FundProviderHome/>}
      {userKind==="admin"&&<AdminHome/>}
    </div>
  );
};
export default Home;

import AdminProfile from "../components/Profile/AdminProfile";
import FPProfileForm from "../components/Profile/FPProfileForm";
import ProfileForm from "../components/Profile/ProfileForm";

const Profile = (props) => {
  const currentUser = localStorage.getItem("currentUser") || "{}";
  const userKind = JSON.parse(currentUser).userKind;
  return (
    <div>
      {userKind === "entrepreneur" ? (
        <ProfileForm setLoggedInState={props.setLoggedInState} />
      ) : userKind === "fundProvider" ? (
        <FPProfileForm
          setLoggedInState={props.setLoggedInState}
        ></FPProfileForm>
      ) : (
        <AdminProfile />
      )}
    </div>
  );
};
export default Profile;

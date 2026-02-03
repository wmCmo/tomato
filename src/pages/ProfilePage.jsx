import LoginComponent from "../components/Login";
import Profile from "../components/Profile";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import useAuth from "../hooks/use-auth";

const ProfilePage = () => {
    const { user, loading } = useAuth();

    if (loading) return <ProfileSkeleton />;

    return user ? <Profile /> : <LoginComponent />;
};

export default ProfilePage;

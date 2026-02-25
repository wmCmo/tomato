import Profile from "../components/Profile";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import useAuth from "../hooks/useAuth";

const ProfilePage = () => {
    const { loading } = useAuth();

    if (loading) return <ProfileSkeleton />;

    return <Profile />;
};

export default ProfilePage;

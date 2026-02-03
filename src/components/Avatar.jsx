import useAuth from "../hooks/use-auth";


const Avatar = () => {
    const { user, loading, isMaybeLoggedIn } = useAuth();
    return <img src="" alt="user avatar" />;
};

export default Avatar;
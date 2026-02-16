import useAuth from "../hooks/useAuth";


const Avatar = () => {
    const { user, loading, isMaybeLoggedIn } = useAuth();
    return <img src="" alt="user avatar" />;
};

export default Avatar;
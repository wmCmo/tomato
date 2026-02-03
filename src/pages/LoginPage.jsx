import { Navigate } from "react-router";
import LoginComponent from "../components/Login";
import useAuth from "../hooks/use-auth";

export default function LoginPage() {
    const { user } = useAuth();

    if (user) {
        return <Navigate to={`/profile/${user.id}`} replace />;
    }
    return (
        <LoginComponent />
    );
}

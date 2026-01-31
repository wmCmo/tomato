import { useOutletContext } from "react-router";

export default function SigninPage() {
    const { dict } = useOutletContext();
    return (
        <div>Signin Page</div>
    );
}

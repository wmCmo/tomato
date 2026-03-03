'use client';

import LoginComponent from "@/components/Login";
import useAuth from "@/hooks/useAuth";
import { useDict } from "@/hooks/useDict";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { dict } = useDict();

    if (user) router.push(`/${dict.langSubTag}/main/profile/${user.id}`);

    return (
        <LoginComponent />
    );
}

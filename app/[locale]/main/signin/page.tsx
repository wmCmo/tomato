'use client';

import LoginComponent from "@/components/Login";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import useAuth from "@/hooks/useAuth";
import useDict from "@/hooks/useDict";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { dict } = useDict();

    useEffect(() => {
        if (user) router.push(`/${dict.langSubTag}/main/profile/${user.id}`);
    }, [user, router]);

    if (user) return <ProfileSkeleton />;

    return <LoginComponent />;
}

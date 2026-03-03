'use client';

import Profile from "@/components/Profile";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import useAuth from "@/hooks/useAuth";
import { use } from "react";

const ProfilePage = ({ params }: { params: Promise<{ userId: string; }>; }) => {
    const { loading } = useAuth();
    const { userId } = use(params);

    if (loading) return <ProfileSkeleton />;

    return <Profile userId={userId} />;
};

export default ProfilePage;

'use client';

import Profile from "@/components/Profile";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import useAuth from "@/hooks/useAuth";
import { useParams } from "next/navigation";

const ProfilePage = () => {
    const { loading } = useAuth();
    const { userId } = useParams<{ userId: string; }>();

    if (loading) return <ProfileSkeleton />;

    return <Profile userId={userId} />;
};

export default ProfilePage;

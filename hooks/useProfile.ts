import fetchProfile from "@/queries/profile";
import { ProfileType } from "@/types/Profile";
import { useQuery } from "@tanstack/react-query";

export default function useProfile<TData = ProfileType>(
    userId: string | undefined,
    options = {},
) {
    return useQuery<ProfileType, Error, TData>({
        queryKey: ["profile", userId],
        queryFn: () => fetchProfile(userId),
        enabled: !!userId,
        staleTime: 60_000, //1 min
        ...options,
    });
}

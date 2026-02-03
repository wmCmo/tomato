import { useQuery } from "@tanstack/react-query";
import fetchProfile from "../queries/profile";

export default function useProfile(userId, options = {}) {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => fetchProfile(userId),
        enabled: !!userId,
        staleTime: 60_000, //1 min
        ...options
    });
}

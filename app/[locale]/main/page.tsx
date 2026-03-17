'use client';

import Clock from "@/components/Clock";
import SideClock from "@/components/SideClock";
import useAuth from "@/hooks/useAuth";
import useNavContext from "@/hooks/useNavContext";
import fetchFollowers from "@/queries/follower";
import fetchFollowing from "@/queries/following";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function ClockPage() {
  const { isPixel, timerOn } = useNavContext();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;
    queryClient.prefetchQuery({
      queryKey: ["followers", user.id],
      queryFn: () => fetchFollowers(user.id)
    });

    queryClient.prefetchQuery({
      queryKey: ["following", user.id],
      queryFn: () => fetchFollowing(user.id)
    });
  }, [user?.id, queryClient]);

  return (
    <main className={`grow flex flex-col gap-12 lg:gap-0 lg:flex-row lg:justify-around justify-center items-center px-4 ${timerOn && 'py-12 lg:py-0'}`}>
      <Clock isPixel={isPixel} />
      {timerOn && <SideClock />}
    </main>
  );
}

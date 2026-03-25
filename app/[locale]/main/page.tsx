'use client';

import Clock from "@/components/Clock";
import SideClock from "@/components/SideClock";
import RoomSkeleton from "@/components/ui/RoomSkeleton";
import useAuth from "@/hooks/useAuth";
import useNavContext from "@/hooks/useNavContext";
import { supabase } from "@/lib/supabase";
import fetchFollowers from "@/queries/follower";
import fetchFollowing from "@/queries/following";
import getRoomStatus from "@/queries/roomStatus";
import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function ClockPage() {
  const { isPixel, timerOn, isMarathon } = useNavContext();
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

  const { data: myRoom, isLoading: myRoomLoading } = useQuery({
    queryKey: ["roomStatus", user?.id],
    queryFn: user?.id ? () => getRoomStatus(user.id) : skipToken,
    staleTime: Infinity
  });

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`room_status:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_status"
        },
        async () => {
          await queryClient.invalidateQueries({ queryKey: ["roomStatus", user.id] });
        }
      ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  if (user?.id && myRoomLoading) return <RoomSkeleton />;

  return (
    <main className={`grow flex flex-col gap-12 lg:gap-0 lg:flex-row lg:justify-around justify-center items-center px-4 ${timerOn && 'py-12 lg:py-0'}`}>
      <Clock isPixel={isPixel} isMarathon={isMarathon} myRoom={myRoom} myRoomLoading={myRoomLoading} />
      {timerOn && <SideClock />}
    </main>
  );
}

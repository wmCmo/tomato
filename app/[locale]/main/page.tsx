'use client';

import Clock from "@/components/Clock";
import SideClock from "@/components/SideClock";
import useAuth from "@/hooks/useAuth";
import useNavContext from "@/hooks/useNavContext";
import { supabase } from "@/lib/supabase";
import fetchFollowers from "@/queries/follower";
import fetchFollowing from "@/queries/following";
import { StatusType } from "@/types/ClockState";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
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
        (payload: RealtimePostgresChangesPayload<{ id: string; status: StatusType; isPlaying: boolean; }>) => {
          queryClient.setQueryData(["roomStatus", user.id], payload.new);
        }
      ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return (
    <main className={`grow flex flex-col gap-12 lg:gap-0 lg:flex-row lg:justify-around justify-center items-center px-4 ${timerOn && 'py-12 lg:py-0'}`}>
      <Clock isPixel={isPixel} isMarathon={isMarathon} />
      {timerOn && <SideClock />}
    </main>
  );
}

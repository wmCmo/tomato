import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useSyncExternalStore } from "react";

// Matches the old hard-coded rule (a long break after every 2nd pomodoro), so nobody's timer changes until they pick a value.
export const DEFAULT_LONG_BREAK_INTERVAL = 2;
export const LONG_BREAK_INTERVAL_RANGE = { min: 1, max: 10 } as const;

const LOCAL_KEY = "longBreakInterval";

function clampInterval(value: unknown) {
    const n = Number(value);
    if (!Number.isInteger(n)) return DEFAULT_LONG_BREAK_INTERVAL;
    return Math.min(LONG_BREAK_INTERVAL_RANGE.max, Math.max(LONG_BREAK_INTERVAL_RANGE.min, n));
}

function readLocal() {
    try {
        const raw = localStorage.getItem(LOCAL_KEY);
        return raw === null ? DEFAULT_LONG_BREAK_INTERVAL : clampInterval(raw);
    } catch {
        return DEFAULT_LONG_BREAK_INTERVAL;
    }
}

// The guest value lives in localStorage; this tiny store lets every component using the hook
// (the settings page and the clock) see a change at once, and other tabs pick it up via "storage".
const localListeners = new Set<() => void>();
function subscribeLocal(listener: () => void) {
    localListeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        localListeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
}
function writeLocal(value: number) {
    try { localStorage.setItem(LOCAL_KEY, String(value)); } catch { /* storage blocked: nothing to persist */ }
    localListeners.forEach(listener => listener());
}

// Signed-in users keep the setting on their profile so it follows them across devices;
// guests keep it on this device. Fetched apart from the profile query on purpose: other people's
// profiles are read through that query too, and this setting is only ever read for yourself.
export default function usePreferences() {
    const { user } = useAuth();
    const userId = user?.id;
    const queryClient = useQueryClient();

    const localInterval = useSyncExternalStore(subscribeLocal, readLocal, () => DEFAULT_LONG_BREAK_INTERVAL);

    const { data: remoteInterval } = useQuery({
        queryKey: ["preferences", userId],
        enabled: !!userId,
        staleTime: Infinity,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("long_break_interval")
                .eq("id", userId!)
                .maybeSingle();
            if (error) throw error;
            return clampInterval(data?.long_break_interval ?? DEFAULT_LONG_BREAK_INTERVAL);
        },
    });

    const longBreakInterval = userId ? remoteInterval ?? DEFAULT_LONG_BREAK_INTERVAL : localInterval;

    const setLongBreakInterval = useCallback(async (value: number) => {
        const next = clampInterval(value);
        if (!userId) {
            writeLocal(next);
            return;
        }
        const key = ["preferences", userId];
        const previous = queryClient.getQueryData<number>(key);
        queryClient.setQueryData(key, next);
        const { error } = await supabase
            .from("profiles")
            .update({ long_break_interval: next })
            .eq("id", userId);
        if (error) {
            queryClient.setQueryData(key, previous);
            throw error;
        }
    }, [userId, queryClient]);

    return { longBreakInterval, setLongBreakInterval };
}

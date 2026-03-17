import { defaultClockState, statusToSec } from "@/components/Clock";
import ClockState from "@/types/ClockState";
import RoomStatusType from "@/types/RoomStatus";
import dateToSec from "@/utils/dateToSec";

export default function roomStatusToClockState(myRoom: RoomStatusType | null | undefined, takenRoom: RoomStatusType | null | undefined, isHost: boolean): ClockState {
    const roomStatus = isHost ? myRoom : takenRoom;
    if (!roomStatus) return defaultClockState;
    const sessions = myRoom?.session?.sessions;
    return {
        sec: roomStatus.ends_at ? dateToSec(roomStatus.ends_at, roomStatus.last_edited) : statusToSec[0],
        session: sessions ? sessions: 1,
        status: roomStatus.status,
        counting: roomStatus.isPlaying,
        current_session: roomStatus.current_session ?? null
    };
}
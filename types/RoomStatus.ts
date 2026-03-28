import { StatusType } from "@/types/ClockState";

export default interface RoomStatusType {
    id: string;
    status: StatusType;
    isPlaying: boolean;
    ends_at?: string;
    last_edited: string;
    current_session?: string;
    current_chat_room?: string;
    session?: { sessions?: number; };
}

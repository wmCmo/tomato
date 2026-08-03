export type StatusType = 0 | 1 | 2;

export type ClockState = {
    sec: number;
    status: StatusType;
    session: number;
    counting: boolean;
    current_session: string | null;
};
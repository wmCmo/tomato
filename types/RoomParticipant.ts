export default interface RoomParticipantsType {
    joiner_id: string;
    joined_room: string;
    accepted: boolean;
    joiner: {
        id: string;
        nickname: string;
        handle: string;
        avatar_url: string;
    };
}

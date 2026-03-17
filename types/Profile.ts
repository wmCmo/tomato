import ConnectionsType from "@/types/Connections";
import StudySessionType from "@/types/StudySession";

export default interface ProfileType extends ConnectionsType {
    emoji?: string;
    study_sessions: StudySessionType[];
}

import type { Session, User } from "@supabase/supabase-js";

export default interface AuthContextType {
    session: Session | null;
    user: User | null | undefined;
    loading: boolean;
}

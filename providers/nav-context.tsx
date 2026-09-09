import { createContext } from "react";

export const NavContext = createContext<{ timerOn: boolean; isPixel: boolean; isMarathon: boolean; isMuted: boolean; } | undefined>(undefined);
import { createContext } from "react";

export const NavContext = createContext<{ timerOn: boolean; isPixel: boolean; isMarathon: boolean; } | undefined>(undefined);
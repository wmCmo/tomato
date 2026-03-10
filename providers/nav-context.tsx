import { createContext } from "react";

export const NavContext = createContext<{ timerOn: boolean; isPixel: boolean; } | undefined>(undefined);
"use client";

import { DictContext } from "@/providers/dict-provider";
import { useContext } from "react";

export function useDict() {
    const context = useContext(DictContext);
    if (!context) throw new Error("useDict must be used within DictProvider");
    return context;
}

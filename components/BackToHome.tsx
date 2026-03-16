'use client';

import useDict from "@/hooks/useDict";
import Link from "next/link";

const BackToHome = () => {
    const { dict } = useDict();
    return <Link href={`/${dict.langSubTag}/main`} className='inline-block bg-foreground px-4 py-2 rounded-lg font-bold active:translate-y-1'>🍅 {dict.components.return2Home}</Link>;

};

export default BackToHome;

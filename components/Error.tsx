'use client';

import useDict from '@/hooks/useDict';
import BackToHome from './BackToHome';

const Error = ({ item }: { item: string; }) => {
    const { dict, locale: lang } = useDict();
    return (
        <div className='text-center space-y-4 text-accent grow flex flex-col justify-center items-center'>
            <h1 className='font-bold text-2xl'>{lang === 'ja' && item}{dict.error.header} {lang === 'en' && item}</h1>
            <p className='text-lg'>{dict.error.desc}</p>
            <BackToHome />
        </div>
    );
};

export default Error;

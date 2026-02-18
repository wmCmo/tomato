import { useOutletContext } from 'react-router';
import BackToHome from './BackToHome';

const Error = ({ item }) => {
    const { lang, dict } = useOutletContext();
    return (
        <div className='text-center space-y-4 text-accent'>
            <h1 className='font-bold text-2xl'>{lang === 'ja' && item}{dict.error.header} {lang === 'en' && item}</h1>
            <p>{dict.error.desc}</p>
            <BackToHome/>
        </div>
    );
};

export default Error;

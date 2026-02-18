import { Link, useOutletContext } from 'react-router';

const BackToHome = () => {
    const { dict } = useOutletContext();
    return <Link to={'/'} className='inline-block bg-foreground px-4 py-2 rounded-lg font-bold hover:translate-y-1'>🍅 {dict.components.return2Home}</Link>;

};

export default BackToHome;

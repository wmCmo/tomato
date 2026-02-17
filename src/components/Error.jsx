import BackToHome from './BackToHome';

const Error = ({ item }) => {
    return (
        <div className='text-center space-y-4'>
            <h1 className='font-bold text-2xl'>There was a trouble getting your {item}</h1>
            <p>Maybe go back to homepage again?</p>
            <BackToHome />
        </div>
    );
};

export default Error;

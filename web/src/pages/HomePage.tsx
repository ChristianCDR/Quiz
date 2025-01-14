import { useEffect } from 'react';

const HomePage = () => {
    useEffect(() => {
        window.location.href = '/mentions-legales';
    }, []);
    
    return null;
}

export default HomePage;
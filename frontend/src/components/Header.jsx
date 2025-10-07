import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <header>
            <div>
                <a href={user ? '/search-trainer' : '/'}><img src="/images/weightlifting.png" alt="" /></a>
                <p><span>GO_</span>TRENER</p>
                {user ? (
                    <div className='header-right'>
                        <a href="/profil" className='login-logo'><img src="/images/user.png" alt="profil" /></a>
                        <a href='' className='login-logo' onClick={handleLogout}><img src="/images/log-out.png" alt="login" /></a>
                    </div>
                ) : (
                    <div className='header-right'>
                        <a href="/login" className='login-logo'><img src="/images/log-in.png" alt="login" /></a>
                    </div>
                )}
                
            </div>
        </header>
    );
}

export default Header;
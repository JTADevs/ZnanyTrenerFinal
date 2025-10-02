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

                    <a href="/"><img src="/images/weightlifting.png" alt="" /></a>
                    <p><span>GO_</span>TRENER</p>
                    <a href="/login" className='login-logo'><img src="/images/user.png" alt="login" /></a>
                
            </div>
            
            {/* {user ? (
                <div className="header-user-actions">
                    <span className="welcome-message">Witaj, {user.displayName || user.email}!</span>
                    <button onClick={handleLogout} className="nav-links logout-button">
                        Wyloguj
                    </button>
                </div>
            ) : (
                <p className="header-login">
                    <a href="/login" className="nav-links">Logowanie</a>
                    <a href="/register" className="nav-links">Rejestracja</a>
                </p>
            )} */}
        </header>
    );
}

export default Header;
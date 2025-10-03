import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import categories from "../data/categories";
import { useEffect, useState } from "react";

function Auth(){
    const [error, setError] = useState("");
    const [role, setRole] = useState("client");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [fullname, setFullname] = useState("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            navigate('/');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Wprowadź email i hasło");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";
            } else if (response.status === 422) {
                const messages = Object.values(data.errors).flat().join(" ");
                setError(messages);
            } else {
                setError(data.error || "Błąd logowania");
            }
        } catch (err) {
            setError("Wystąpił błąd podczas logowania " + err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if(password !== confirm){
            setError("Hasła nie są identyczne.")
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Hasło musi mieć minimum 8 znaków, zawierać dużą literę, małą literę, cyfrę i znak specjalny.");
            return;
        }

        try{
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({role, email, password, fullname})
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";
            } else {
                setError(data.error || "Błąd logowania");
            }

        } catch (err) {
            setError("Wystąpił błąd podczas logowania " + err);
        }
    }

    return (
        <div>
            <Header/>
            <div className="auth-container">
                <div className="auth-login">
                    <h1>Zaloguj się na swoje konto</h1>

                    <div className="login-google">
                        <button className="google-button">
                            <img 
                                src="images/google-logo.png" 
                                alt="Google logo" 
                                width="20" 
                                height="20" 
                                style={{ marginRight: "10px" }} 
                            />
                            Kontynuuj z Google
                        </button>
                    </div>

                    <div className="login-apple">
                        <button className="apple-button">
                            <img
                                src="images/apple-logo.svg"
                                alt="Apple logo"
                                width="16"
                                height="20"
                                style={{ marginRight: "10px" }}
                            />
                            Kontynuuj z Apple
                        </button>
                    </div>

                    <span>Lub</span>

                    {error && <div className="login-error">{error}</div>}

                    <form className="login-form" onSubmit={handleLogin}>
                        <input 
                            type="text" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email"
                            required
                        />
                        <input 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Hasło"
                            required
                        />
                        <button className="login-normal" type="submit">Zaloguj się</button>
                    </form>

                    <div className="login-forgot-password">
                        Zapomniałeś hasła?
                    </div>
                </div>

                <div className="auth-register">
                    <h1>Załóż darmowe konto</h1>

                    <div className="login-google">
                        <button className="google-button">
                            <img 
                                src="images/google-logo.png"
                                alt="Google logo" 
                                width="20" 
                                height="20" 
                                style={{ marginRight: "10px" }} 
                            />
                            Kontynuuj z Google
                        </button>
                    </div>

                    <div className="login-apple">
                        <button className="apple-button">
                            <img
                                src="images/apple-logo.svg"
                                alt="Apple logo"
                                width="16"
                                height="20"
                                style={{ marginRight: "10px" }}
                            />
                            Kontynuuj z Apple
                        </button>
                    </div>

                    <span>Lub</span>

                    <div className="register-role">
                        <h2>Wybierz jaki profil konta chcesz założyć.</h2>
                        <div className="roles">
                            <span onClick={() => setRole('client')} className={role==='client' ? 'selected-role' : null}>Klient</span>
                            <span onClick={() => setRole('trainer')} className={role==='trainer' ? 'selected-role' : null}>Trener personalny</span>
                        </div>
                    </div>

                    { role === 'client' && (
                        <form className="register-form" onSubmit={handleRegister}>
                            <input type="text" 
                                name="fullname" 
                                value={fullname} 
                                onChange={(e) => setFullname(e.target.value)} 
                                placeholder="Imie i nazwisko"
                                autoComplete="new-name"
                                required
                            />
                            <input 
                                type="text" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email"
                                autoComplete="new-email"
                                required
                            />
                            <input 
                                type="password" 
                                name="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Hasło"
                                autoComplete="new-password"
                                required
                            />
                            <input 
                                type="password" 
                                name="confirm" 
                                value={confirm} 
                                onChange={(e) => setConfirm(e.target.value)} 
                                placeholder="Potwierdzenie hasła"
                                autoComplete="new-password"
                                required
                            />
                            <input 
                                type="hidden" 
                                name="role"
                                value={role}
                            />
                            <button className="login-normal" type="submit">Rejestruj konto klienta</button>
                        </form>
                    )}

                    { role === 'trainer' && (
                        <form className="register-form" onSubmit={handleRegister}>
                            <input 
                                type="text" 
                                name="fullname" 
                                value={fullname} 
                                onChange={(e) => setFullname(e.target.value)} 
                                placeholder="Imie i nazwisko"
                                autoComplete="new-name"
                                required
                            />
                            <input 
                                type="text" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email"
                                autoComplete="new-email"
                                required
                            />
                            <input 
                                type="password" 
                                name="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Hasło"
                                autoComplete="new-password"
                                required
                            />
                            <input 
                                type="password" 
                                name="confirm" 
                                value={confirm} 
                                onChange={(e) => setConfirm(e.target.value)} 
                                placeholder="Potwierdzenie hasła"
                                autoComplete="new-password"
                                required
                            />
                            <input 
                                type="hidden" 
                                name="role"
                                value={role}
                            />
                            <button className="login-normal" type="submit">Rejestruj trenera</button>
                        </form>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Auth;
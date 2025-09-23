import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState } from "react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
            } else {
                setError(data.error || "Błąd logowania");
            }
        } catch (err) {
            setError("Wystąpił błąd podczas logowania" + err);
        }
    };

    return (
        <div>
            <Header/>
            <div className="login-form">
                <h1>Zaloguj się na swoje konto</h1>

                <div className="login-google">
                    <button className="google-button">
                        <img 
                            src="https://developers.google.com/identity/images/g-logo.png" 
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
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
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

                <div className="login-line"></div>

                <div className="login-register">
                    Nie masz jeszcze konta? <a href="/register">Zarejestruj się</a>
                </div>

            </div>   
            <Footer/>
        </div>
    )
}

export default LoginForm;
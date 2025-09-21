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
            console.log(data);
            if (response.ok) {
                // alert("Zalogowano:", data);
                // localStorage.setItem("token", data.token);
                // window.location.href = "/";
            } else {
                setError(data.error || "Błąd logowania");
            }
        } catch (err) {
            console.error(err);
            setError("Wystąpił błąd podczas logowania");
        }
    };

    return (
        <div>
            <Header/>
            <div className="login-form">
                <h1>Zaloguj się na swoje konto</h1>

                <div className="login-google">
                    <button className="google-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" width="20" height="20" style={{ marginRight: '10px' }}>
                            <path fill="#4285F4" d="M488 261.8c0-17.4-1.6-34-4.7-50.2H249v95h134.6c-5.8 31.6-23.6 58.4-50 76.4v63h80.7c47.4-43.7 74.7-108 74.7-184.2z"/>
                            <path fill="#34A853" d="M249 512c67.8 0 124.8-22.4 166.4-60.9l-80.7-63c-22.4 15-51 23.9-85.7 23.9-65.9 0-121.9-44.4-141.9-104.4H24v65.6C66.4 460.7 150.3 512 249 512z"/>
                            <path fill="#FBBC05" d="M107.1 311.6c-5-15-7.9-31.1-7.9-47.6s2.9-32.6 7.9-47.6V150.8H24c-15 29-24 61.6-24 95s9 66 24 95l83.1-65.2z"/>
                            <path fill="#EA4335" d="M249 100.3c35.7 0 67.8 12.3 93.1 36.5l69.7-69.7C373.8 31.1 316.8 8.7 249 8.7 150.3 8.7 66.4 60 24 150.8l83.1 65.2c20-60 76-104.4 141.9-104.4z"/>
                        </svg>
                        Kontynuuj z Google
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
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Hasło"
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

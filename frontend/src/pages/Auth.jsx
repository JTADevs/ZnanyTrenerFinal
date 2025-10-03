import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";

function Auth() {
    const [error, setError] = useState("");

    // --- Login state ---
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // --- Register state ---
    const [role, setRole] = useState("client");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfirm, setRegisterConfirm] = useState("");
    const [registerFullname, setRegisterFullname] = useState("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginEmail || !loginPassword) {
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
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else if (response.status === 422 && data.errors) {
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

        if (registerPassword !== registerConfirm) {
            setError("Hasła nie są identyczne.");
            return;
        }

        if (!passwordRegex.test(registerPassword)) {
            setError(
                "Hasło musi mieć minimum 8 znaków, zawierać dużą literę, małą literę, cyfrę i znak specjalny."
            );
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    role,
                    email: registerEmail,
                    password: registerPassword,
                    fullname: registerFullname,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else if (response.status === 422 && data.errors) {
                const messages = Object.values(data.errors).flat().join(" ");
                setError(messages);
            } else {
                setError(data.error || "Błąd rejestracji");
            }
        } catch (err) {
            setError("Wystąpił błąd podczas rejestracji " + err);
        }
    };

    return (
        <div>
            <Header />
            <div className="auth-container">
                {/* LOGIN */}
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
                            type="email"
                            name="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="Email"
                            autoComplete="email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Hasło"
                            autoComplete="current-password"
                            required
                        />
                        <button className="login-normal" type="submit">
                            Zaloguj się
                        </button>
                    </form>

                    <div className="login-forgot-password">Zapomniałeś hasła?</div>
                </div>

                {/* REGISTER */}
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
                            <span
                                onClick={() => setRole("client")}
                                className={role === "client" ? "selected-role" : ""}
                            >
                                Klient
                            </span>
                            <span
                                onClick={() => setRole("trainer")}
                                className={role === "trainer" ? "selected-role" : ""}
                            >
                                Trener personalny
                            </span>
                        </div>
                    </div>

                    <form className="register-form" onSubmit={handleRegister}>
                        <input
                            type="text"
                            name="fullname"
                            value={registerFullname}
                            onChange={(e) => setRegisterFullname(e.target.value)}
                            placeholder="Imię i nazwisko"
                            autoComplete="name"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            placeholder="Email"
                            autoComplete="email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="Hasło"
                            autoComplete="new-password"
                            required
                        />
                        <input
                            type="password"
                            name="confirm"
                            value={registerConfirm}
                            onChange={(e) => setRegisterConfirm(e.target.value)}
                            placeholder="Potwierdzenie hasła"
                            autoComplete="new-password"
                            required
                        />
                        <input type="hidden" name="role" value={role} />
                        <button className="login-normal" type="submit">
                            {role === "client"
                                ? "Rejestruj konto klienta"
                                : "Rejestruj trenera"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Auth;

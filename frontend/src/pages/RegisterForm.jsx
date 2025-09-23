import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import categories from "../data/categories";

function RegisterForm(){
    const [error, setError] = useState("");
    const [role, setRole] = useState("client");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [online, setOnline] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [address, setAddress] = useState("");
    const [nip, setNip] = useState("");
    const [regon, setRegon] = useState("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
        setSelectedCategories([...selectedCategories, value]);
        } else {
        setSelectedCategories(selectedCategories.filter((cat) => cat !== value));
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
            const response = await fetch("https://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({role, email, password, fullname, phone, city, facebook, instagram, online, selectedCategories, address, nip, regon})
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
    }

    return(
        <div>
            <Header/>
            <div className="register-form">
                <h1>Załóż darmowe konto</h1>

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

                <div className="register-role">
                    <h2>Wybierz jaki profil konta chcesz założyć.</h2>
                    <div className="roles">
                        <span onClick={() => setRole('client')} className={role=='client' ? 'selected-role' : null}>Klient</span>
                        <span onClick={() => setRole('trainer')} className={role=='trainer' ? 'selected-role' : null}>Trener personalny</span>
                        <span onClick={() => setRole('company')} className={role=='company' ? 'selected-role' : null}>Firma</span>
                    </div>
                </div>

                { role === 'client' && (
                    <form className="register-form" onSubmit={handleRegister}>
                        <input type="text" 
                            name="fullname" 
                            value={fullname} 
                            onChange={(e) => setFullname(e.target.value)} 
                            placeholder="Imie i nazwisko*"
                            autoComplete="new-name"
                            required
                        />
                        <input 
                            type="text" 
                            name="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Telefon"
                            autoComplete="new-phone"
                        />
                        <input 
                            type="text" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email*"
                            autoComplete="new-email"
                            required
                        />
                        <input 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Hasło*"
                            autoComplete="new-password"
                            required
                        />
                        <input 
                            type="password" 
                            name="confirm" 
                            value={confirm} 
                            onChange={(e) => setConfirm(e.target.value)} 
                            placeholder="Potwierdzenie hasła*"
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
                            placeholder="Imie i nazwisko*"
                            autoComplete="new-name"
                            required
                        />
                        <input 
                            type="text" 
                            name="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Telefon"
                            autoComplete="new-phone"
                        />
                        <input 
                            type="text" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email*"
                            autoComplete="new-email"
                            required
                        />
                        <input 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Hasło*"
                            autoComplete="new-password"
                            required
                        />
                        <input 
                            type="password" 
                            name="confirm" 
                            value={confirm} 
                            onChange={(e) => setConfirm(e.target.value)} 
                            placeholder="Potwierdzenie hasła*"
                            autoComplete="new-password"
                            required
                        />
                        <input 
                            type="text" 
                            name="city" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            placeholder="Miasto"
                            autoComplete="new-city"
                        />
                        <input 
                            type="text" 
                            name="facebook" 
                            value={facebook} 
                            onChange={(e) => setFacebook(e.target.value)} 
                            placeholder="Facebook"
                            autoComplete="new-facebook"
                        />
                        <input 
                            type="text" 
                            name="instagram" 
                            value={instagram} 
                            onChange={(e) => setInstagram(e.target.value)} 
                            placeholder="Instagram"
                            autoComplete="new-instagram"
                        />
                        <span>
                            <input 
                                type="checkbox" 
                                name="online" 
                                id="online"
                                checked={online} 
                                onChange={(e) => setOnline(e.target.checked)}
                                style={{ marginRight: "10px" }}
                            />
                            <label htmlFor="online">Czy prowadzisz zajęcia online ?</label>
                        </span>
                        <div className="categories">
                            <h3>Wybierz swoje kategorie specjalizacji</h3>
                            {categories.map((cat, idx) => (
                            <label key={idx} style={{ display: "block", marginBottom: "5px" }}>
                                <input
                                type="checkbox"
                                value={cat}
                                checked={selectedCategories.includes(cat)}
                                onChange={handleCategoryChange}
                                style={{ marginRight: "8px" }}
                                />
                                {cat}
                            </label>
                            ))}
                        </div>
                        <input 
                            type="hidden" 
                            name="role"
                            value={role}
                        />

                        <button className="login-normal" type="submit">Rejestruj trenera</button>
                    </form>
                )}

                { role === 'company' && (
                    <form className="register-form" onSubmit={handleRegister}>
                        <input 
                            type="text" 
                            name="fullname" 
                            value={fullname} 
                            onChange={(e) => setFullname(e.target.value)} 
                            placeholder="Nazwa firmy*"
                            autoComplete="new-name"
                            required
                        />
                        <input 
                            type="text" 
                            name="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Telefon"
                            autoComplete="new-phone"
                        />
                        <input 
                            type="text" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email*"
                            autoComplete="new-email"
                            required
                        />
                        <input 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Hasło*"
                            autoComplete="new-password"
                            required
                        />
                        <input 
                            type="password" 
                            name="confirm" 
                            value={confirm} 
                            onChange={(e) => setConfirm(e.target.value)} 
                            placeholder="Potwierdzenie hasła*"
                            autoComplete="new-password"
                            required
                        />
                        <input 
                            type="text" 
                            name="address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            placeholder="Adres"
                            autoComplete="new-address"
                        />
                        <input 
                            type="text" 
                            name="nip" 
                            value={nip} 
                            onChange={(e) => setNip(e.target.value)} 
                            placeholder="NIP"
                            autoComplete="new-nip"
                        />
                        <input 
                            type="text" 
                            name="regon" 
                            value={regon} 
                            onChange={(e) => setRegon(e.target.value)} 
                            placeholder="REGON"
                            autoComplete="new-regon"
                        />
                        <input 
                            type="text" 
                            name="city" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            placeholder="Miasto"
                            autoComplete="new-city"
                        />
                        <input 
                            type="text" 
                            name="facebook" 
                            value={facebook} 
                            onChange={(e) => setFacebook(e.target.value)} 
                            placeholder="Facebook"
                            autoComplete="new-facebook"
                        />
                        <input 
                            type="text" 
                            name="instagram" 
                            value={instagram} 
                            onChange={(e) => setInstagram(e.target.value)} 
                            placeholder="Instagram"
                            autoComplete="new-instagram"
                        />
                        <div className="categories">
                            <h3>Wybierz kategorie specjalizacji trenerów</h3>
                            {categories.map((cat, idx) => (
                            <label key={idx} style={{ display: "block", marginBottom: "5px" }}>
                                <input
                                type="checkbox"
                                value={cat}
                                checked={selectedCategories.includes(cat)}
                                onChange={handleCategoryChange}
                                style={{ marginRight: "8px" }}
                                />
                                {cat}
                            </label>
                            ))}
                        </div>
                        <input 
                            type="hidden" 
                            name="role"
                            value={role}
                        />

                        <button className="login-normal" type="submit">Rejestruj firme</button>
                    </form>
                )}

                {error && <div className="login-error">{error}</div>}

                <div className="login-line"></div>

                <div className="login-register register-space">
                    Masz już konto? <a href="/login">Zaloguj się</a>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default RegisterForm;